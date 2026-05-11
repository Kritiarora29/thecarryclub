"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import RazorpayCheckout from "@/components/RazorpayCheckout"
import {
  updateQty,
  removeFromCart,
  clearCart,
} from "@/lib/cartActions"

export default function CartClient({ cart = [], products = [] }: any) {

  // ================= STATE =================
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [street, setStreet] = useState("")
  const [pincode, setPincode] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [landmark, setLandmark] = useState("")

  const [appliedCoupon, setAppliedCoupon] = useState("CARRY999")

  // ================= CART =================
  const cartItems = cart
    .map((item: any) => {
      const product = products.find(
        (p: any) => p.slug?.current === item.slug
      )
      return product ? { ...product, qty: item.qty } : null
    })
    .filter(Boolean)

  const totalQty = cartItems.reduce((s: number, i: any) => s + i.qty, 0)
  const total = totalQty * 1599

  const discount = appliedCoupon === "CARRY999" ? 600 * totalQty : 0
  const finalTotal = Math.max(total - discount, 0)



  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#fafafa] pt-32 md:pt-36 pb-10 px-4 md:px-8 text-black flex flex-col items-center justify-start overflow-hidden"
    >
      <div className="max-w-7xl w-full">

        {/* Tagline Related to Payment */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8 mt-10"
        >
          <p className="text-sm md:text-lg font-black uppercase tracking-[0.5em] text-[#ff3366]">
            SECURE CHECKOUT • JUST ONE STEP AWAY
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 items-stretch">

          {/* LEFT: Shipping Info */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white p-5 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-xl md:shadow-2xl border border-gray-100 flex flex-col h-full"
          >
            <div className="flex items-center gap-3 mb-4 md:mb-8">
              <h2 className="text-xl md:text-4xl font-black tracking-tighter">Shipping Details</h2>
            </div>

            <div className="space-y-3 md:space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <input className="premium-input" placeholder="Full Name *" value={name} onChange={(e) => setName(e.target.value)} />
                <input className="premium-input" placeholder="Email Address *" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <input className="premium-input" placeholder="Phone Number *" value={phone} onChange={(e) => setPhone(e.target.value)} />

              <input
                className="premium-input"
                placeholder="Flat / Floor / Street Address *"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <input
                  className="premium-input"
                  placeholder="City *"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  className="premium-input"
                  placeholder="State *"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <input
                  className="premium-input"
                  placeholder="Pincode *"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
                <input
                  className="premium-input"
                  placeholder="Landmark (Optional)"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </div>


            </div>
          </motion.div>

          {/* RIGHT: Order Summary */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="flex flex-col h-full"
          >
            <div className="bg-white p-5 md:p-10 rounded-2xl md:rounded-[2.5rem] shadow-xl md:shadow-2xl border border-gray-100 flex flex-col h-full mt-2 md:mt-0">

              <div className="flex justify-between items-center mb-4 md:mb-8">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl md:text-4xl font-black tracking-tighter">Your Order</h2>
                </div>
                <Link href="/buy" className="text-[10px] md:text-sm font-bold text-[#ff3366] hover:underline">Add products</Link>
              </div>

              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-10">
                  <p className="text-gray-400 font-medium text-sm">Cart is empty.</p>
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6 flex-1 flex flex-col">
                  <div className="space-y-4 md:space-y-6">
                    {cartItems.map((item: any) => (
                      <div key={item.slug.current} className="flex gap-4 md:gap-6 items-start group">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-50 rounded-xl md:rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 p-2 shadow-sm group-hover:shadow-md transition-shadow">
                          <img src={item.imageUrl} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <p className="font-black text-sm md:text-lg tracking-tight leading-tight mb-1">{item.title}</p>
                          <p className="text-xs md:text-base font-bold text-gray-500 mb-2 md:mb-4">₹1599</p>

                          {/* MODERN QUANTITY ADJUSTER */}
                          <div className="flex items-center gap-3 md:gap-5">
                            <div className="flex items-center bg-gray-50 border border-gray-100 rounded-full px-2 py-1 gap-2 md:gap-4">
                              <form action={updateQty.bind(null, item.slug.current, item.qty - 1)}>
                                <button className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm md:text-lg font-bold hover:bg-white hover:text-[#ff3366] transition-all">−</button>
                              </form>
                              <span className="text-[10px] md:text-sm font-black w-4 text-center">{item.qty}</span>
                              <form action={updateQty.bind(null, item.slug.current, item.qty + 1)}>
                                <button className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm md:text-lg font-bold hover:bg-white hover:text-[#ff3366] transition-all">+</button>
                              </form>
                            </div>

                            <form action={removeFromCart.bind(null, item.slug.current)}>
                              <button className="text-[9px] md:text-xs font-black text-rose-500 hover:text-black uppercase tracking-widest transition-colors ml-2">
                                Remove
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* COUPON SECTION */}
                  {appliedCoupon === "CARRY999" ? (
                    <div className="w-full bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-500 text-xs">✓</span>
                        <p className="text-[9px] md:text-[10px] font-black text-emerald-600 uppercase tracking-widest">CARRY999 Applied — ₹600 off!</p>
                      </div>
                      <button
                        onClick={() => setAppliedCoupon("")}
                        className="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-black hover:bg-red-100 hover:text-red-500 transition-colors"
                      >
                        REMOVE
                      </button>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setAppliedCoupon("CARRY999")}
                      className="w-full bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center justify-between group hover:bg-[#ff3366] transition-all duration-300"
                    >
                      <div className="text-left">
                        <p className="text-[9px] md:text-[10px] font-black text-[#ff3366] group-hover:text-white uppercase tracking-widest mb-0.5">Coupon Unlock ⚡</p>
                        <p className="text-xs font-bold text-gray-800 group-hover:text-white">Apply CARRY999 for ₹999 deal</p>
                      </div>
                      <span className="text-[#ff3366] group-hover:text-white font-black text-[10px] md:text-sm">APPLY</span>
                    </motion.button>
                  )}

                  {/* BREAKDOWN */}
                  <div className="mt-auto pt-4 md:pt-6 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span>₹{total}</span>
                    </div>


                    {appliedCoupon !== "" && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-between items-center text-[#ff3366]"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] md:text-[10px] md:text-xs font-bold uppercase tracking-widest">Applied Code: {appliedCoupon}</span>
                          <button
                            onClick={() => setAppliedCoupon("")}
                            className="text-[9px] md:text-[10px] bg-rose-100 text-[#ff3366] px-2 py-1 md:px-3 md:py-1 rounded-full font-black hover:bg-rose-200"
                          >
                            REMOVE
                          </button>
                        </div>
                        <span className="font-black text-sm md:text-base">-₹{discount}</span>
                      </motion.div>
                    )}

                    <div className="flex justify-between items-end pt-3 md:pt-4">
                      <div>
                        <p className="text-xl md:text-4xl font-black tracking-tighter">₹{finalTotal}</p>
                        <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase">Incl. all taxes</p>
                      </div>
                      <form action={clearCart}>
                        <button className="text-gray-500 hover:text-red-500 text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-colors">Clear Cart</button>
                      </form>
                    </div>
                  </div>

                  <div className="pt-3 md:pt-6">
                    <RazorpayCheckout
                      amount={finalTotal}
                      prefill={{ name, email, contact: phone }}
                      onSuccess={async (paymentId: any) => {
                        await fetch("/api/order", {
                          method: "POST",
                          body: JSON.stringify({ name, email, phone, address: { street, city, state, pincode, landmark }, items: cartItems, amount: finalTotal, paymentId }),
                        })
                        localStorage.removeItem("cart")
                        window.location.href = "/success"
                      }}
                      className="w-full bg-black hover:bg-[#ff3366] text-white py-2.5 md:py-3.5 rounded-full font-black text-xs md:text-sm shadow-lg transition-all transform hover:-translate-y-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .premium-input {
          width: 100%;
          background: #fcfcfc;
          border: 2px solid #f8f8f8;
          padding: 10px 16px;
          border-radius: 0.75rem;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s ease;
          outline: none;
        }
        @media (min-width: 768px) {
          .premium-input {
            padding: 16px 24px;
            border-radius: 1.25rem;
            font-size: 15px;
          }
        }
        .premium-input:focus {
          border-color: #ff3366;
          background: #fff;
          box-shadow: 0 10px 30px rgba(255,51,102,0.05);
        }
      `}</style>
    </motion.section>
  )
}