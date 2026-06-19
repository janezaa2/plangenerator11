import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { secret } = await req.json();
  const seedSecret = (process.env.SEED_SECRET || "").replace(/^﻿/, "").trim();
  if (secret !== seedSecret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  const existing = await User.findOne({ email: "admin@nutrition.app" });
  if (existing) {
    return NextResponse.json({ message: "Admin already exists", email: "admin@nutrition.app" });
  }

  const hashed = await bcrypt.hash("Admin123!", 10);
  await User.create({
    name: "Admin",
    email: "admin@nutrition.app",
    password: hashed,
    role: "admin",
  });

  return NextResponse.json({
    message: "Admin account created",
    email: "admin@nutrition.app",
    password: "Admin123!",
  });
}
