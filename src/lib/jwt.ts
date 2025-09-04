import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.WS_JWT_SECRET || process.env.JWT_SECRET || "change-me";

export function signWidgetToken(payload: {
  companyId: number;
  conversationId: number;
}) {
  return jwt.sign({ kind: "widget", ...payload }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function signAgentToken(payload: { sub: number; companyId: number }) {
  return jwt.sign({ kind: "agent", ...payload }, JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
