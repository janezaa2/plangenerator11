import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  orderNumber: string;
  items: {
    productId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  stripePaymentIntentId?: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    subtotal: Number,
    shipping: Number,
    tax: Number,
    total: Number,
    stripePaymentIntentId: String,
    trackingNumber: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);
