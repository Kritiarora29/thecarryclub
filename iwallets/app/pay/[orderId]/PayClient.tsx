"use client"

import RazorpayCheckout from "@/components/RazorpayCheckout"
import { useState } from "react"
import { ShoppingBag } from "lucide-react"
import { Card, Heading, PriceTag, Eyebrow } from "@/components/ui/tcc"

export default function PayClient({ order }: { order: any }) {
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-surface mt-24">
      <div className="max-w-md w-full">
        <Card size="lg" className="text-center flex flex-col items-center">

          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6">
            <ShoppingBag size={28} className="text-primary" />
          </div>

          <Heading as="h1" className="text-2xl md:text-2xl mb-2">Complete Payment</Heading>
          <p className="text-muted-foreground font-medium mb-8 text-sm leading-relaxed">
            Convert your Cash on Delivery order to Prepaid for a seamless, contactless delivery experience.
          </p>

          <div className="w-full bg-muted rounded-2xl p-6 mb-8 border border-border">
            <Eyebrow color="muted" className="mb-2">Amount Due</Eyebrow>
            <PriceTag amount={order.amount} size="xl" />
          </div>

          <div className="w-full">
            {loading ? (
              <div className="w-full py-4 bg-muted text-muted-foreground font-black rounded-full text-xs uppercase tracking-widest text-center animate-pulse">
                Processing...
              </div>
            ) : (
              <RazorpayCheckout
                amount={order.amount}
                disabled={loading}
                prefill={{ name: order.name, email: order.email, contact: order.phone }}
                onSuccess={async (paymentId: string) => {
                  setLoading(true)
                  try {
                    await fetch(`/api/order/${order._id}/pay`, {
                      method: "POST",
                      body: JSON.stringify({ paymentId }),
                    })
                    window.location.href = "/success"
                  } catch (e) {
                    console.error(e)
                    setLoading(false)
                  }
                }}
                className="w-full bg-primary hover:bg-brand text-primary-foreground py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
              />
            )}
          </div>

        </Card>
      </div>
    </div>
  )
}
