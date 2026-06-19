import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: (process.env.ANTHROPIC_API_KEY || "").replace(/^﻿/, "").trim(),
});

export interface UserProfile {
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  activityLevel?: string;
  goal?: string;
  allergies?: string[];
  diseases?: string[];
  foodPreferences?: string[];
  budget?: number;
  targetCalories?: number;
}

export function calculateBMR(profile: UserProfile): number {
  if (!profile.weight || !profile.height || !profile.age) return 2000;

  if (profile.gender === "male") {
    return 88.362 + 13.397 * profile.weight + 4.799 * profile.height - 5.677 * profile.age;
  } else {
    return 447.593 + 9.247 * profile.weight + 3.098 * profile.height - 4.330 * profile.age;
  }
}

export function calculateTDEE(bmr: number, activityLevel?: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return Math.round(bmr * (multipliers[activityLevel || "moderate"] || 1.55));
}

export function calculateTargetCalories(tdee: number, goal?: string): number {
  switch (goal) {
    case "lose_weight":
      return Math.round(tdee - 500);
    case "gain_muscle":
      return Math.round(tdee + 300);
    default:
      return tdee;
  }
}

export async function generateMealPlan(profile: UserProfile) {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const targetCalories = profile.targetCalories || calculateTargetCalories(tdee, profile.goal);

  const prompt = `Generate a detailed 7-day meal plan for a person with the following profile:
- Age: ${profile.age || "unknown"}
- Gender: ${profile.gender || "unknown"}
- Height: ${profile.height || "unknown"} cm
- Weight: ${profile.weight || "unknown"} kg
- Activity Level: ${profile.activityLevel || "moderate"}
- Goal: ${profile.goal || "maintain"}
- Allergies: ${profile.allergies?.join(", ") || "none"}
- Medical conditions: ${profile.diseases?.join(", ") || "none"}
- Food preferences: ${profile.foodPreferences?.join(", ") || "none"}
- Daily budget: $${(profile.budget ? profile.budget / 30 : 20).toFixed(2)}
- Target calories: ${targetCalories} per day

Return ONLY valid JSON matching this exact structure:
{
  "targetCalories": number,
  "targetProtein": number,
  "targetCarbs": number,
  "targetFat": number,
  "days": [
    {
      "day": "Monday",
      "breakfast": {
        "name": string,
        "description": string,
        "ingredients": [{"name": string, "amount": string, "unit": string, "calories": number}],
        "instructions": [string],
        "prepTime": number,
        "cookTime": number,
        "servings": number,
        "calories": number,
        "protein": number,
        "carbs": number,
        "fat": number
      },
      "lunch": { same structure },
      "dinner": { same structure },
      "snacks": [{ same structure }],
      "totalCalories": number,
      "totalProtein": number,
      "totalCarbs": number,
      "totalFat": number
    }
  ],
  "shoppingList": [
    {
      "category": string,
      "items": [{"name": string, "amount": string, "unit": string}]
    }
  ]
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");

  return JSON.parse(jsonMatch[0]);
}

export async function chat(
  messages: { role: "user" | "assistant"; content: string }[],
  profile: UserProfile
) {
  const systemPrompt = `You are a knowledgeable and empathetic AI nutrition assistant.
You help users with personalized nutrition advice, meal planning, healthy recipes, and fitness goals.

User profile:
- Goal: ${profile.goal || "improve health"}
- Allergies: ${profile.allergies?.join(", ") || "none"}
- Dietary preferences: ${profile.foodPreferences?.join(", ") || "none"}
- Medical conditions: ${profile.diseases?.join(", ") || "none"}

Always give practical, evidence-based advice. Be encouraging and supportive.
Keep responses concise but helpful. Format with markdown when appropriate.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: systemPrompt,
    messages,
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");
  return content.text;
}

export async function recommendProducts(
  profile: UserProfile,
  productCategories: string[]
) {
  const prompt = `Based on this user's profile, recommend specific product types from each category:
- Goal: ${profile.goal}
- Age: ${profile.age}
- Allergies: ${profile.allergies?.join(", ") || "none"}
- Medical conditions: ${profile.diseases?.join(", ") || "none"}

Available categories: ${productCategories.join(", ")}

Return ONLY valid JSON:
{
  "recommendations": [
    {
      "category": string,
      "reason": string,
      "productTypes": [string]
    }
  ]
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");

  return JSON.parse(jsonMatch[0]);
}
