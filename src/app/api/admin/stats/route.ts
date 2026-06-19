import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import Product from "@/models/Product";
import MealPlan from "@/models/MealPlan";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  const [totalUsers, totalOrders, totalProducts, totalMealPlans, recentOrders] =
    await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      MealPlan.countDocuments(),
      Order.find().sort({ createdAt: -1 }).limit(5).populate("userId", "name email"),
    ]);

  const revenue = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$total" } } },
  ]);

  return NextResponse.json({
    totalUsers,
    totalOrders,
    totalProducts,
    totalMealPlans,
    totalRevenue: revenue[0]?.total || 0,
    recentOrders,
  });
}
