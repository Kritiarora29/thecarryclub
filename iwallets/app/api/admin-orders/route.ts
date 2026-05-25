import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("MongoDB Connection/Fetch Error:", error);
    return NextResponse.json({ error: "Database connection failed. Please check your MONGODB_URI password." }, { status: 500 });
  }
}