"use client"

import Script from "next/script"

declare global {
  interface Window {
    Razorpay: any
  }
}

interface RazorpayCheckoutProps {
  amount: number
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  onSuccess?: (paymentId: string) => void
  className?: string
  disabled?: boolean
  loading?: boolean
}

export default function RazorpayCheckout({
  amount,
  prefill,
  onSuccess,
  className,
  disabled,
  loading,
}: RazorpayCheckoutProps) {

  const handlePayment = async () => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: amount * 100,
      currency: "INR",

      name: "theCarryClub",
      description: "Order Payment",
      magic: true, // ✅ Enables Magic Checkout for fraud prevention

      handler: function (response: any) {
        if (onSuccess) {
          onSuccess(response.razorpay_payment_id)
        }
      },

      prefill: {
        name: prefill?.name || "",
        email: prefill?.email || "",
        contact: prefill?.contact || "",
      },

      theme: {
        color: "#000",
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <button
        disabled={disabled || loading}
        onClick={handlePayment}
        className={`w-full bg-black text-white py-3 md:py-4 rounded-full text-sm md:text-base font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
          (disabled || loading)
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-zinc-800 active:scale-[0.95]"
        } ${className || ""}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
        {loading ? "PROCESSING..." : disabled ? "Enter Details to Pay" : `Pay ₹${amount} Securely`}
      </button>
    </>
  )
}