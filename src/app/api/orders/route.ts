import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { generateOrderNumber } from "@/lib/utils";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET() {
  const session = await auth();
  const userId = session ? (session.user as any).id || session.user.email : null;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const orders = await Order.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = session ? (session.user as any).id || session.user.email : null;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items, shippingAddress } = await req.json();

  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: "usd",
    metadata: { userId: String(userId) },
  });

  await connectDB();
  const order = await Order.create({
    userId,
    orderNumber: generateOrderNumber(),
    items,
    shippingAddress,
    subtotal,
    shipping,
    tax,
    total,
    stripePaymentIntentId: paymentIntent.id,
  });

  return NextResponse.json({
    order,
    clientSecret: paymentIntent.client_secret,
  });
}
