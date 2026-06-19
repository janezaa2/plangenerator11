import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import MealPlan from "@/models/MealPlan";
import Progress from "@/models/Progress";
import { calculateBMR, calculateTDEE, calculateTargetCalories } from "@/lib/ai";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  await connectDB();

  const userId = (session!.user as any).id || session!.user.email;
  const [user, latestMealPlan, recentProgress] = await Promise.all([
    User.findById(userId),
    MealPlan.findOne({ userId }).sort({ weekStart: -1 }),
    Progress.find({ userId }).sort({ date: -1 }).limit(7),
  ]);

  const profile = user?.profile || {};
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const targetCalories = calculateTargetCalories(tdee, profile.goal);

  return (
    <DashboardClient
      user={JSON.parse(JSON.stringify(user))}
      mealPlan={latestMealPlan ? JSON.parse(JSON.stringify(latestMealPlan)) : null}
      recentProgress={JSON.parse(JSON.stringify(recentProgress))}
      targetCalories={targetCalories}
      tdee={tdee}
    />
  );
}
