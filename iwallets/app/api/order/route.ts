import { connectDB } from "@/lib/mongodb"
import Order from "@/models/Order"
import { sendOrderEmail } from "@/lib/sendMail"

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()

    const order = await Order.create(body)

    // Send confirmation email
    try {
      await sendOrderEmail(order)
    } catch (emailErr) {
      console.error("Email failed:", emailErr)
    }

    return Response.json({ success: true, order })
  } catch (err) {
    console.error("Order creation failed:", err)
    return Response.json({ success: false })
  }
}