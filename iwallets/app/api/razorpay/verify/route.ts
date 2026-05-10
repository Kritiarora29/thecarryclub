import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: Request) {
  const body = await req.json();

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    name,
    email,
    phone,
    address,
    items,
    amount,
  } = body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  await connectDB();

  // Prevent duplicate orders
  const existing = await Order.findOne({ paymentId: razorpay_payment_id });

  if (existing) {
    return NextResponse.json({ success: true });
  }

  await Order.create({
    name,
    email,
    phone,
    address,
    items,
    amount,
    paymentId: razorpay_payment_id,
  });

  return NextResponse.json({ success: true });
}