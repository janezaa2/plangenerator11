import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import MealPlan from "@/models/MealPlan";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const plans = await MealPlan.find({ userId: session.user.id })
    .sort({ weekStart: -1 })
    .limit(4);

  return NextResponse.json(plans);
}
