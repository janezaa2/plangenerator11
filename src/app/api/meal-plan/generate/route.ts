import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import MealPlan from "@/models/MealPlan";
import { generateMealPlan, calculateBMR, calculateTDEE, calculateTargetCalories } from "@/lib/ai";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const profile = user.profile;
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const targetCalories = calculateTargetCalories(tdee, profile.goal);

  const planData = await generateMealPlan({
    ...profile.toObject?.() || profile,
    targetCalories,
  });

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const mealPlan = await MealPlan.findOneAndUpdate(
    { userId: session.user.id, weekStart },
    {
      userId: session.user.id,
      weekStart,
      ...planData,
    },
    { upsert: true, new: true }
  );

  return NextResponse.json(mealPlan);
}
