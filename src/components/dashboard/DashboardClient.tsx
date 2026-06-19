"use client";

import Link from "next/link";
import { UtensilsCrossed, TrendingUp, Flame, Droplets, ShoppingBag, MessageSquare } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

interface Props {
  user: any;
  mealPlan: any;
  recentProgress: any[];
  targetCalories: number;
  tdee: number;
}

export default function DashboardClient({ user, mealPlan, recentProgress, targetCalories, tdee }: Props) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayPlan = mealPlan?.days?.find((d: any) => d.day === today);
  const latestProgress = recentProgress[0];

  const progressChartData = recentProgress
    .slice()
    .reverse()
    .map((p: any) => ({
      date: format(new Date(p.date), "MMM d"),
      weight: p.weight,
      calories: p.caloriesConsumed,
    }));

  const profileComplete =
    user?.profile?.age && user?.profile?.weight && user?.profile?.height;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Good morning, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's your nutrition overview for today</p>
      </div>

      {!profileComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-amber-800">Complete your profile</p>
            <p className="text-sm text-amber-600">Add your details to get personalized meal plans</p>
          </div>
          <Link
            href="/profile"
            className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600"
          >
            Complete Profile
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Flame className="w-6 h-6 text-orange-500" />}
          label="Target Calories"
          value={`${targetCalories} kcal`}
          sub={`TDEE: ${tdee} kcal`}
          color="bg-orange-50"
        />
        <StatCard
          icon={<Flame className="w-6 h-6 text-red-500" />}
          label="Today Consumed"
          value={`${latestProgress?.caloriesConsumed || 0} kcal`}
          sub={`${Math.round(((latestProgress?.caloriesConsumed || 0) / targetCalories) * 100)}% of goal`}
          color="bg-red-50"
        />
        <StatCard
          icon={<Droplets className="w-6 h-6 text-blue-500" />}
          label="Water Intake"
          value={`${((latestProgress?.waterIntake || 0) / 1000).toFixed(1)}L`}
          sub="Goal: 2.5L"
          color="bg-blue-50"
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-green-500" />}
          label="Current Weight"
          value={`${latestProgress?.weight || user?.profile?.weight || "--"} kg`}
          sub={user?.profile?.targetWeight ? `Target: ${user.profile.targetWeight} kg` : "No target set"}
          color="bg-green-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Today's Meals</h2>
            <Link href="/meal-plan" className="text-sm text-green-600 hover:text-green-700 font-medium">
              View Plan
            </Link>
          </div>
          {todayPlan ? (
            <div className="space-y-3">
              {["breakfast", "lunch", "dinner"].map((meal) => (
                <div key={meal} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 capitalize">{meal}</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {todayPlan[meal]?.name}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {todayPlan[meal]?.calories} kcal
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <UtensilsCrossed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No meal plan yet</p>
              <Link
                href="/meal-plan"
                className="mt-3 inline-block bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600"
              >
                Generate Plan
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Weight Progress</h2>
            <Link href="/progress" className="text-sm text-green-600 hover:text-green-700 font-medium">
              View All
            </Link>
          </div>
          {progressChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={progressChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: "#22c55e", r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No progress data yet</p>
              <Link
                href="/progress"
                className="mt-3 inline-block bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600"
              >
                Log Progress
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/chat"
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 flex items-center gap-4 hover:from-green-600 hover:to-emerald-700 transition-all"
        >
          <MessageSquare className="w-10 h-10" />
          <div>
            <p className="font-semibold text-lg">AI Nutrition Assistant</p>
            <p className="text-green-100 text-sm">Ask questions about your diet and health</p>
          </div>
        </Link>
        <Link
          href="/shop"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6 flex items-center gap-4 hover:from-blue-600 hover:to-indigo-700 transition-all"
        >
          <ShoppingBag className="w-10 h-10" />
          <div>
            <p className="font-semibold text-lg">Nutrition Shop</p>
            <p className="text-blue-100 text-sm">Browse AI-recommended supplements & more</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}
