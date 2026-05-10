import Razorpay from "razorpay"
import { NextResponse } from "next/server"

type Body = {
  amount: number
  email?: string
  phone?: string
  items: any[]
}

export async function POST(req: Request) {
  const { amount, email, phone, items } = (await req.json()) as Body

  const rzp = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })

  const order = await rzp.orders.create({
    amount: amount * 100, // paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
    notes: {
      email: email ?? "",
      phone: phone ?? "",
      items: JSON.stringify(items),
    },
  })

  return NextResponse.json(order)
}
