"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Save, User } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary", desc: "Little or no exercise" },
  { value: "light", label: "Light", desc: "1-3 days/week" },
  { value: "moderate", label: "Moderate", desc: "3-5 days/week" },
  { value: "active", label: "Active", desc: "6-7 days/week" },
  { value: "very_active", label: "Very Active", desc: "Hard exercise daily" },
];

const GOALS = [
  { value: "lose_weight", label: "Lose Weight" },
  { value: "maintain", label: "Maintain Weight" },
  { value: "gain_muscle", label: "Gain Muscle" },
  { value: "improve_health", label: "Improve Health" },
];

const COMMON_ALLERGIES = ["Gluten", "Dairy", "Nuts", "Eggs", "Soy", "Fish", "Shellfish"];
const FOOD_PREFS = ["Vegetarian", "Vegan", "Keto", "Mediterranean", "Paleo", "Halal", "Kosher"];

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => axios.get("/api/user/profile").then((r) => r.data),
  });

  const [form, setForm] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    targetWeight: "",
    activityLevel: "",
    goal: "",
    budget: "",
    allergies: [] as string[],
    diseases: "",
    foodPreferences: [] as string[],
  });

  useEffect(() => {
    if (user?.profile) {
      const p = user.profile;
      setForm({
        age: p.age?.toString() || "",
        gender: p.gender || "",
        height: p.height?.toString() || "",
        weight: p.weight?.toString() || "",
        targetWeight: p.targetWeight?.toString() || "",
        activityLevel: p.activityLevel || "",
        goal: p.goal || "",
        budget: p.budget?.toString() || "",
        allergies: p.allergies || [],
        diseases: p.diseases?.join(", ") || "",
        foodPreferences: p.foodPreferences || [],
      });
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: (data: any) => axios.put("/api/user/profile", { profile: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  const toggleItem = (arr: string[], item: string, field: "allergies" | "foodPreferences") => {
    const updated = arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
    setForm({ ...form, [field]: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      age: form.age ? parseInt(form.age) : undefined,
      gender: form.gender || undefined,
      height: form.height ? parseFloat(form.height) : undefined,
      weight: form.weight ? parseFloat(form.weight) : undefined,
      targetWeight: form.targetWeight ? parseFloat(form.targetWeight) : undefined,
      activityLevel: form.activityLevel || undefined,
      goal: form.goal || undefined,
      budget: form.budget ? parseFloat(form.budget) : undefined,
      allergies: form.allergies,
      diseases: form.diseases ? form.diseases.split(",").map((s) => s.trim()).filter(Boolean) : [],
      foodPreferences: form.foodPreferences,
    });
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
          <User className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500">Update your details for personalized meal plans</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="25"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
              <input
                type="number"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
                placeholder="175"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                placeholder="70"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={form.targetWeight}
                onChange={(e) => setForm({ ...form, targetWeight: e.target.value })}
                placeholder="65"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Budget ($)</label>
              <input
                type="number"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="300"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Activity Level</h2>
          <div className="grid grid-cols-1 gap-2">
            {ACTIVITY_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setForm({ ...form, activityLevel: level.value })}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border text-left transition-colors",
                  form.activityLevel === level.value
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <span className="font-medium text-sm">{level.label}</span>
                <span className="text-xs text-gray-500">{level.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Goal</h2>
          <div className="grid grid-cols-2 gap-2">
            {GOALS.map((goal) => (
              <button
                key={goal.value}
                type="button"
                onClick={() => setForm({ ...form, goal: goal.value })}
                className={cn(
                  "p-3 rounded-lg border text-sm font-medium transition-colors",
                  form.goal === goal.value
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                {goal.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Dietary Preferences</h2>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Allergies</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_ALLERGIES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleItem(form.allergies, a, "allergies")}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm border transition-colors",
                    form.allergies.includes(a)
                      ? "border-red-400 bg-red-50 text-red-700"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Food Preferences</p>
            <div className="flex flex-wrap gap-2">
              {FOOD_PREFS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => toggleItem(form.foodPreferences, p, "foodPreferences")}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm border transition-colors",
                    form.foodPreferences.includes(p)
                      ? "border-green-400 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions</label>
            <input
              type="text"
              value={form.diseases}
              onChange={(e) => setForm({ ...form, diseases: e.target.value })}
              placeholder="e.g. Diabetes, Hypertension (comma separated)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-600 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {mutation.isPending ? "Saving..." : saved ? "Saved!" : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
