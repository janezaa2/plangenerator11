import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "12");

  await connectDB();

  const query: any = { isActive: true };
  if (category) query.category = category;
  if (search) query.$text = { $search: search };

  const [products, total] = await Promise.all([
    Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ rating: -1 }),
    Product.countDocuments(query),
  ]);

  return NextResponse.json({
    products,
    total,
    pages: Math.ceil(total / limit),
    page,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  await connectDB();

  const product = await Product.create(body);
  return NextResponse.json(product, { status: 201 });
}
