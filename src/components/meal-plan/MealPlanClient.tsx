"use client";

import { useState } from "react";
import axios from "axios";
import { UtensilsCrossed, RefreshCw, Clock, Users, ShoppingCart, ChevronDown, ChevronUp, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface Props {
  initialPlan: any;
}

export default function MealPlanClient({ initialPlan }: Props) {
  const [plan, setPlan] = useState(initialPlan);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [tab, setTab] = useState<"meals" | "shopping">("meals");

  const generatePlan = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/meal-plan/generate");
      setPlan(data);
    } catch (e) {
      alert("Failed to generate meal plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Weekly Meal Plan", 20, 20);
    let y = 40;
    plan.days?.forEach((day: any) => {
      doc.setFontSize(14);
      doc.text(day.day, 20, y);
      y += 8;
      doc.setFontSize(10);
      ["breakfast", "lunch", "dinner"].forEach((meal) => {
        if (day[meal]) {
          doc.text(`${meal.charAt(0).toUpperCase() + meal.slice(1)}: ${day[meal].name} (${day[meal].calories} kcal)`, 30, y);
          y += 6;
        }
      });
      y += 4;
      if (y > 270) { doc.addPage(); y = 20; }
    });
    doc.save("meal-plan.pdf");
  };

  const currentDay = plan?.days?.[activeDay];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Weekly Meal Plan</h1>
          <p className="text-gray-500 mt-1">AI-generated meals tailored to your goals</p>
        </div>
        <div className="flex gap-2">
          {plan && (
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          )}
          <button
            onClick={generatePlan}
            disabled={loading}
            className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            {loading ? "Generating..." : plan ? "Regenerate" : "Generate Plan"}
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">AI is creating your personalized meal plan...</p>
          <p className="text-gray-400 text-sm mt-1">This may take up to 30 seconds</p>
        </div>
      )}

      {!loading && !plan && (
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
          <UtensilsCrossed className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Meal Plan Yet</h2>
          <p className="text-gray-500 mb-6">Generate your first AI-powered weekly meal plan</p>
          <button
            onClick={generatePlan}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600"
          >
            Generate Meal Plan
          </button>
        </div>
      )}

      {plan && !loading && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              {[
                { label: "Target Calories", value: `${plan.targetCalories} kcal` },
                { label: "Protein", value: `${plan.targetProtein}g` },
                { label: "Carbs", value: `${plan.targetCarbs}g` },
                { label: "Fat", value: `${plan.targetFat}g` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-lg font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
            {DAYS.map((day, i) => (
              <button
                key={day}
                onClick={() => setActiveDay(i)}
                className={cn(
                  "flex-1 min-w-fit px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  activeDay === i
                    ? "bg-white text-green-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>

          <div className="flex gap-2 border-b border-gray-200 pb-0">
            {(["meals", "shopping"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "pb-3 px-1 text-sm font-medium border-b-2 transition-colors capitalize",
                  tab === t
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                {t === "shopping" ? "Shopping List" : "Meals"}
              </button>
            ))}
          </div>

          {tab === "meals" && currentDay && (
            <div className="space-y-4">
              {["breakfast", "lunch", "dinner", "snacks"].map((mealType) => {
                const meals = mealType === "snacks" ? currentDay.snacks : [currentDay[mealType]];
                if (!meals || meals.length === 0 || !meals[0]) return null;

                return meals.map((meal: any, idx: number) => {
                  const key = `${mealType}-${idx}`;
                  const isExpanded = expandedMeal === key;
                  return (
                    <div key={key} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => setExpandedMeal(isExpanded ? null : key)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <UtensilsCrossed className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">{mealType}</p>
                            <p className="font-semibold text-gray-900">{meal.name}</p>
                            <p className="text-sm text-gray-500">{meal.calories} kcal · P: {meal.protein}g · C: {meal.carbs}g · F: {meal.fat}g</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-400">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="w-4 h-4" />
                            {(meal.prepTime || 0) + (meal.cookTime || 0)} min
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="w-4 h-4" />
                            {meal.servings}
                          </div>
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-gray-100 p-5 space-y-4">
                          <p className="text-gray-600">{meal.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Ingredients</h4>
                              <ul className="space-y-1">
                                {meal.ingredients?.map((ing: any, i: number) => (
                                  <li key={i} className="text-sm text-gray-600 flex justify-between">
                                    <span>{ing.name}</span>
                                    <span className="text-gray-400">{ing.amount} {ing.unit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Instructions</h4>
                              <ol className="space-y-2">
                                {meal.instructions?.map((step: string, i: number) => (
                                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                                    <span className="font-medium text-green-600 min-w-fit">{i + 1}.</span>
                                    {step}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                });
              })}
            </div>
          )}

          {tab === "shopping" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-600" />
                <h2 className="font-semibold text-gray-900">Weekly Shopping List</h2>
              </div>
              {plan.shoppingList?.map((cat: any) => (
                <div key={cat.category}>
                  <h3 className="font-medium text-gray-700 mb-2 capitalize">{cat.category}</h3>
                  <ul className="space-y-1">
                    {cat.items?.map((item: any, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600 py-1 border-b border-gray-50">
                        <input type="checkbox" className="rounded text-green-500" />
                        <span className="flex-1">{item.name}</span>
                        <span className="text-gray-400">{item.amount} {item.unit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
