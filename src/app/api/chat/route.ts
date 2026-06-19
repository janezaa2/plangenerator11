import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import ChatMessage from "@/models/ChatMessage";
import { chat } from "@/lib/ai";
import { v4 as uuidv4 } from "uuid";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  await connectDB();
  const query: any = { userId: session.user.id };
  if (sessionId) query.sessionId = sessionId;

  const messages = await ChatMessage.find(query)
    .sort({ createdAt: 1 })
    .limit(50);

  return NextResponse.json(messages);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, sessionId: existingSessionId } = await req.json();
  if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const sessionId = existingSessionId || uuidv4();

  await connectDB();
  const user = await User.findById(session.user.id);

  const history = await ChatMessage.find({ userId: session.user.id, sessionId })
    .sort({ createdAt: 1 })
    .limit(20);

  const messages = [
    ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user" as const, content: message },
  ];

  const aiResponse = await chat(messages, user?.profile || {});

  await ChatMessage.insertMany([
    { userId: session.user.id, role: "user", content: message, sessionId },
    { userId: session.user.id, role: "assistant", content: aiResponse, sessionId },
  ]);

  return NextResponse.json({ response: aiResponse, sessionId });
}
