import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Progress from "@/models/Progress";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") || "30");

  const since = new Date();
  since.setDate(since.getDate() - days);

  await connectDB();
  const progress = await Progress.find({
    userId: session.user.id,
    date: { $gte: since },
  }).sort({ date: 1 });

  return NextResponse.json(progress);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const record = await Progress.findOneAndUpdate(
    { userId: session.user.id, date: today },
    { userId: session.user.id, date: today, ...body },
    { upsert: true, new: true }
  );

  return NextResponse.json(record);
}
