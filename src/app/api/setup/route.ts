// app/api/setup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";

const bodySchema = z.object({
  companyName: z.string().min(2),
  agentEmail: z.email(),
  agentPassword: z.string().min(6),
  domain: z.string().optional(),
});

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production")
    return NextResponse.json({ error: "Disabled" }, { status: 403 });
  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });

  const uid = randomUUID();
  const apiKey = randomUUID();
  const secretKey = randomUUID();
  const hash = await bcrypt.hash(parsed.data.agentPassword, 10);

  const company = await prisma.company.create({
    data: {
      uid,
      name: parsed.data.companyName,
      domain: parsed.data.domain,
      api_key: apiKey,
      secret_key: secretKey,
      agents: {
        create: {
          uid: randomUUID(),
          email: parsed.data.agentEmail,
          password: hash,
          role: "OWNER",
        },
      },
    },
    include: { agents: true },
  });

  return NextResponse.json({ company, apiKey });
}
