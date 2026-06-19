import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { fetchAllShopifyProducts } from "@/lib/shopify";

export async function POST() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: "SHOPIFY_STOREFRONT_ACCESS_TOKEN not configured" },
      { status: 503 }
    );
  }

  await connectDB();

  const shopifyProducts = await fetchAllShopifyProducts();

  let created = 0;
  let updated = 0;

  for (const p of shopifyProducts) {
    const existing = await Product.findOne({ supplierSku: p.supplierSku });
    if (existing) {
      await Product.updateOne(
        { _id: existing._id },
        {
          $set: {
            name: p.name,
            description: p.description,
            category: p.category,
            price: p.price,
            comparePrice: p.comparePrice,
            images: p.images,
            stock: p.stock,
            tags: p.tags,
            nutritionInfo: p.nutritionInfo,
            isActive: p.isActive,
          },
        }
      );
      updated++;
    } else {
      await Product.create(p);
      created++;
    }
  }

  return NextResponse.json({
    success: true,
    synced: shopifyProducts.length,
    created,
    updated,
  });
}
