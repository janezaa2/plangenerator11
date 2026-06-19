import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  category:
    | "protein"
    | "vitamins"
    | "healthy_snacks"
    | "kitchen_equipment"
    | "fitness_accessories"
    | "smart_devices";
  price: number;
  comparePrice?: number;
  images: string[];
  supplierSku: string;
  supplierPrice: number;
  stock: number;
  tags: string[];
  nutritionInfo?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "protein",
        "vitamins",
        "healthy_snacks",
        "kitchen_equipment",
        "fitness_accessories",
        "smart_devices",
      ],
      required: true,
    },
    price: { type: Number, required: true },
    comparePrice: Number,
    images: [String],
    supplierSku: { type: String, required: true },
    supplierPrice: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    tags: [String],
    nutritionInfo: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
    isActive: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1, isActive: 1 });
ProductSchema.index({ tags: 1 });

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
