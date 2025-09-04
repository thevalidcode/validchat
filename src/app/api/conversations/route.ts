// app/api/conversations/route.ts
import { NextResponse } from "next/server";
import cookie from "cookie";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  const raw = req.headers.get("cookie") || "";
  const { vc_session } = cookie.parse(raw || "");
  if (!vc_session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload: any = verifyToken(vc_session);
  if (!payload || payload.kind !== "agent")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const convos = await prisma.conversation.findMany({
    where: { company_id: payload.companyId },
    orderBy: { updated_at: "desc" },
    include: { messages: { orderBy: { created_at: "asc" }, take: 50 } },
  });

  return NextResponse.json({ convos });
}
