import { NextResponse } from "next/server"
import Order from "@/models/Order"
import mongoose from "mongoose"

export async function POST(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const body = await req.json()
    const { paymentId } = body
    const { orderId } = await params;

    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!)
    }

    const order = await Order.findByIdAndUpdate(orderId, {
      paymentId,
      paymentMethod: "prepaid"
    })

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 })
  }
}
