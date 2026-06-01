import Order from "@/models/Order"
import mongoose from "mongoose"
import PayClient from "./PayClient"

export default async function PayPage({ params }: { params: { orderId: string } }) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!)
    }
    const order = await Order.findById(params.orderId).lean()
    
    if (!order) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] mt-24">
          <h1 className="text-3xl font-black mb-4">Order Not Found</h1>
        </div>
      )
    }
    
    if (order.paymentId !== "COD") {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] mt-24">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mb-6">✓</div>
          <h1 className="text-3xl font-black mb-4 tracking-tighter">Order Already Paid</h1>
          <p className="text-gray-500 font-medium">This order has already been paid for online.</p>
        </div>
      )
    }
    
    return <PayClient order={JSON.parse(JSON.stringify(order))} />
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] mt-24">
        <h1 className="text-2xl font-black mb-4">Error loading order</h1>
      </div>
    )
  }
}
