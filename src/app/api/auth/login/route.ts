import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signAgentToken } from "@/lib/jwt";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), password: z.string() });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const agent = await prisma.agent.findUnique({
    where: { email: parsed.data.email },
  });
  if (!agent)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await bcrypt.compare(parsed.data.password, agent.password);
  if (!ok)
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signAgentToken({ sub: agent.id, companyId: agent.company_id });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("vc_session", token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
