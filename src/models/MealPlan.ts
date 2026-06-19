import mongoose, { Schema, Document } from "mongoose";

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
  calories: number;
}

interface Recipe {
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image?: string;
}

interface DayPlan {
  day: string;
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
  snacks: Recipe[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface IMealPlan extends Document {
  userId: mongoose.Types.ObjectId;
  weekStart: Date;
  days: DayPlan[];
  shoppingList: {
    category: string;
    items: { name: string; amount: string; unit: string; checked: boolean }[];
  }[];
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  createdAt: Date;
}

const IngredientSchema = new Schema({
  name: String,
  amount: String,
  unit: String,
  calories: Number,
});

const RecipeSchema = new Schema({
  name: String,
  description: String,
  ingredients: [IngredientSchema],
  instructions: [String],
  prepTime: Number,
  cookTime: Number,
  servings: Number,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  image: String,
});

const DayPlanSchema = new Schema({
  day: String,
  breakfast: RecipeSchema,
  lunch: RecipeSchema,
  dinner: RecipeSchema,
  snacks: [RecipeSchema],
  totalCalories: Number,
  totalProtein: Number,
  totalCarbs: Number,
  totalFat: Number,
});

const MealPlanSchema = new Schema<IMealPlan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    weekStart: Date,
    days: [DayPlanSchema],
    shoppingList: [
      {
        category: String,
        items: [
          {
            name: String,
            amount: String,
            unit: String,
            checked: { type: Boolean, default: false },
          },
        ],
      },
    ],
    targetCalories: Number,
    targetProtein: Number,
    targetCarbs: Number,
    targetFat: Number,
  },
  { timestamps: true }
);

export default mongoose.models.MealPlan ||
  mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);
