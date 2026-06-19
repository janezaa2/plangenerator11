import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import MealPlan from "@/models/MealPlan";
import MealPlanClient from "@/components/meal-plan/MealPlanClient";

export default async function MealPlanPage() {
  const session = await auth();
  await connectDB();

  const userId = (session!.user as any).id || session!.user.email;
  const mealPlan = await MealPlan.findOne({ userId }).sort({ weekStart: -1 });

  return <MealPlanClient initialPlan={mealPlan ? JSON.parse(JSON.stringify(mealPlan)) : null} />;
}
