import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { signWidgetToken } from "@/lib/jwt";
import { z } from "zod";

const schema = z.object({ apiKey: z.string(), siteUrl: z.string().optional() });

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const company = await prisma.company.findUnique({
    where: { api_key: parsed.data.apiKey },
  });
  if (!company)
    return NextResponse.json({ error: "Unknown company" }, { status: 404 });

  const convo = await prisma.conversation.create({
    data: { uid: randomUUID(), company_id: company.id },
  });

  // optional record of install
  if (parsed.data.siteUrl) {
    await prisma.widgetInstall.create({
      data: {
        uid: randomUUID(),
        company_id: company.id,
        site_url: parsed.data.siteUrl,
      },
    });
  }

  const token = signWidgetToken({
    companyId: company.id,
    conversationId: convo.id,
  });

  return NextResponse.json({ token, conversationId: convo.id });
}
