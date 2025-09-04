import { io } from "socket.io-client";

const socket = io(`${process.env.NEXT_PUBLIC_WS_URL}/agent`, {
  withCredentials: true,
  auth: {
    token:
      typeof window !== "undefined" ? localStorage.getItem("agent_token") : "",
  },
});

export default socket;
