import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import axios from "axios";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:3000";
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || "http://localhost:3000";
const WS_JWT_SECRET =
  process.env.WS_JWT_SECRET || process.env.JWT_SECRET || "change-me-in-prod";

// Helper: Verify JWT safely
function verifyToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, WS_JWT_SECRET);
  } catch {
    return null;
  }
}

app.prepare().then(() => {
  const server = createServer((req, res) => handle(req, res));

  const io = new Server(server, {
    cors: {
      origin: ORIGIN === "*" ? true : ORIGIN,
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  /**
   * Widget namespace (site visitors)
   */
  const widgetNS = io.of("/widget");
  widgetNS.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    const payload = verifyToken(token);

    if (!payload || payload.kind !== "widget") {
      return next(new Error("Unauthorized: Invalid widget token"));
    }

    socket.data.companyId = payload.companyId;
    socket.data.conversationId = payload.conversationId;
    next();
  });

  /**
   * Agent namespace (dashboard)
   */
  const agentNS = io.of("/agent");
  agentNS.use((socket, next) => {
    const rawCookie = socket.handshake.headers?.cookie || "";
    const cookies = cookie.parse(rawCookie);
    const token = socket.handshake.auth?.token || cookies.vc_session || null;
    const payload = verifyToken(token);

    if (!payload || payload.kind !== "agent") {
      return next(new Error("Unauthorized: Invalid agent token"));
    }

    socket.data.agentId = payload.sub;
    socket.data.companyId = payload.companyId;
    next();
  });

  /**
   * Widget connection handlers
   */
  widgetNS.on("connection", (socket) => {
    const room = `c_${socket.data.conversationId}`;
    socket.join(room);

    socket.on("message:send", async (msg) => {
      try {
        const messageBody = String(msg?.body || "").trim();
        if (!messageBody) {
          return socket.emit("message:error", "Message body is required");
        }

        await axios.post(
          `${PUBLIC_BASE_URL}/api/messages`,
          {
            conversationId: socket.data.conversationId,
            body: messageBody,
            sender: "visitor",
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        agentNS.to(room).emit("message:new", {
          body: messageBody,
          sender: "visitor",
          conversationId: socket.data.conversationId,
        });

        socket.emit("message:ack");
      } catch (err) {
        console.error("Widget message error:", err.message);
        socket.emit("message:error", "Failed to save message");
      }
    });

    socket.on("disconnect", () => {
      console.log(`Widget disconnected from ${room}`);
    });
  });

  /**
   * Agent connection handlers
   */
  agentNS.on("connection", (socket) => {
    socket.on("conversation:join", ({ conversationId }) => {
      if (!conversationId) return;
      socket.join(`c_${conversationId}`);
    });

    socket.on("message:send", async (payload) => {
      try {
        const { conversationId, body } = payload || {};
        if (!conversationId || !body) {
          return socket.emit("message:error", "Invalid message payload");
        }

        const messageBody = String(body).trim();
        await axios.post(
          `${PUBLIC_BASE_URL}/api/messages`,
          {
            conversationId,
            body: messageBody,
            sender: "agent",
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        widgetNS.to(`c_${conversationId}`).emit("message:new", {
          body: messageBody,
          sender: "agent",
          conversationId,
        });

        socket.emit("message:ack");
      } catch (err) {
        console.error("Agent message error:", err.message);
        socket.emit("message:error", "Failed to send message");
      }
    });
  });

  /**
   * Start server
   */
  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen(port, () => {
    console.log(`✅ Server ready on http://localhost:${port}`);
  });
});
