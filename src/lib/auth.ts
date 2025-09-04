import jwt from "jsonwebtoken";

const WS_JWT_SECRET = process.env.WS_JWT_SECRET || "super-secret";

export function signSocketToken(payload: object) {
  return jwt.sign(payload, WS_JWT_SECRET, { expiresIn: "1h" });
}

export function verifySocketToken(token: string) {
  return jwt.verify(token, WS_JWT_SECRET);
}
