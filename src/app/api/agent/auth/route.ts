import { NextResponse } from "next/server";
import { signSocketToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { agentId, companyId } = await req.json(); // Replace with real auth

  const token = signSocketToken({ agentId, companyId, type: "agent" });

  return NextResponse.json({ token });
}
