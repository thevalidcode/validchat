// app/api/messages/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { z } from "zod";
import { SenderType } from "@/prisma/generated";

const schema = z.object({
  conversationId: z.number().int(),
  body: z.string().min(1).max(5000),
  sender: z.enum(SenderType),
});

export async function POST(req: Request) {
  const json = await req.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const msg = await prisma.message.create({
    data: {
      uid: randomUUID(),
      conversation_id: parsed.data.conversationId,
      sender_type: parsed.data.sender,
      body: parsed.data.body,
    },
  });

  await prisma.conversation.update({
    where: { id: parsed.data.conversationId },
    data: { updated_at: new Date() },
  });

  return NextResponse.json({ message: msg });
}
