import crypto from "crypto"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = req.headers.get("x-razorpay-signature") || ""

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex")

  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const event = JSON.parse(rawBody)

  if (event.event === "payment.captured") {
    // const p = event.payload.payment.entity
    // const notes = p.notes || {}

    // SAVE ORDER (example)
    // You can implement MongoDB/Mongoose order saving here if needed
  }

  return NextResponse.json({ ok: true })
}
