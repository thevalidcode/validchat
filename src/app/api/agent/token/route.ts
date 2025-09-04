import { NextResponse } from "next/server";
import cookie from "cookie";
import { verifyToken, signAgentToken } from "@/lib/jwt";

export async function GET(req: Request) {
  const raw = req.headers.get("cookie") || "";
  const { vc_session } = cookie.parse(raw || "");
  if (!vc_session)
    return NextResponse.json({ error: "No session" }, { status: 401 });
  const payload: any = verifyToken(vc_session);
  if (!payload || payload.kind !== "agent")
    return NextResponse.json({ error: "Invalid" }, { status: 401 });
  // issue socket token short lived
  const socketToken = signAgentToken({
    sub: payload.sub,
    companyId: payload.companyId,
  });
  return NextResponse.json({ token: socketToken });
}
