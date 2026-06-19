import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "admin";
  subscription: "free" | "basic" | "premium";
  subscriptionId?: string;
  profile: {
    age?: number;
    gender?: "male" | "female" | "other";
    height?: number; // cm
    weight?: number; // kg
    activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
    goal?: "lose_weight" | "maintain" | "gain_muscle" | "improve_health";
    allergies?: string[];
    diseases?: string[];
    foodPreferences?: string[];
    budget?: number; // monthly in USD
    targetWeight?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    image: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    subscription: {
      type: String,
      enum: ["free", "basic", "premium"],
      default: "free",
    },
    subscriptionId: String,
    profile: {
      age: Number,
      gender: { type: String, enum: ["male", "female", "other"] },
      height: Number,
      weight: Number,
      activityLevel: {
        type: String,
        enum: ["sedentary", "light", "moderate", "active", "very_active"],
      },
      goal: {
        type: String,
        enum: ["lose_weight", "maintain", "gain_muscle", "improve_health"],
      },
      allergies: [String],
      diseases: [String],
      foodPreferences: [String],
      budget: Number,
      targetWeight: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
