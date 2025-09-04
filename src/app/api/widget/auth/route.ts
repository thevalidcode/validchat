import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signSocketToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { apiKey } = await req.json();

  const company = await prisma.company.findUnique({ where: { apiKey } });
  if (!company) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  const token = signSocketToken({ companyId: company.id, type: "widget" });

  return NextResponse.json({ token });
}
