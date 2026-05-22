"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import RazorpayCheckout from "@/components/RazorpayCheckout"
import {
  updateQty,
  removeFromCart,
  clearCart,
} from "@/lib/cartActions"
import { ShoppingBag, Truck, ShieldCheck, ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"

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

  const productImages: any = {
    "Premium iWallet – White": "/Iwallet - Images/Prod image- desk -White/1-white.jpg",
    "Premium iWallet – Black": "/Iwallet - Images/Prod image- desk-Black/1-Black.jpg",
    "Premium iWallet – Space Grey": "/Iwallet - Images/Prod image-desk-grey/1.png"
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen w-full max-w-[100vw] bg-[#fafafa] pt-32 md:pt-48 pb-20 px-4 md:px-8 text-black flex flex-col items-center justify-start overflow-hidden font-sans"
    >
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/5 blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] -z-10" />

      <div className="max-w-7xl w-full relative z-10 mx-auto">

        {/* Tagline Related to Payment */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] md:tracking-[0.5em] text-rose-600 mb-4">
            SECURE CHECKOUT • JUST ONE STEP AWAY
          </p>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter">
            Review Your <span className="text-rose-600">Order.</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">

          {/* LEFT: Shipping Info */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="bg-white p-6 md:p-16 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col h-full"
          >
            <div className="flex items-center gap-4 mb-10">
               <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                  <Truck size={24} className="text-black" />
               </div>
               <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase">Shipping</h2>
            </div>

            <div className="space-y-4 md:space-y-6 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                  <input className="premium-input" placeholder="John Doe *" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                  <input className="premium-input" placeholder="john@example.com *" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Phone Number</label>
                <input className="premium-input" placeholder="+91 00000 00000 *" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Street Address</label>
                <input
                  className="premium-input"
                  placeholder="Flat / Floor / Street Address *"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">City</label>
                  <input
                    className="premium-input"
                    placeholder="City *"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">State</label>
                  <input
                    className="premium-input"
                    placeholder="State *"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Pincode</label>
                  <input
                    className="premium-input"
                    placeholder="Pincode *"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Landmark</label>
                  <input
                    className="premium-input"
                    placeholder="Landmark (Optional)"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-10 border-t border-gray-50 flex items-center gap-4 text-gray-400">
               <ShieldCheck size={20} />
               <p className="text-[10px] font-black uppercase tracking-widest">Encrypted & Secure Transaction</p>
            </div>
          </motion.div>

          {/* RIGHT: Order Summary */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="flex flex-col h-full"
          >
            <div className="bg-white p-6 md:p-16 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col h-full">

              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <ShoppingBag size={24} className="text-black" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase">Summary</h2>
                </div>
                <Link href="/buy" className="text-[10px] font-black text-rose-600 hover:underline uppercase tracking-widest flex items-center gap-2 group">
                  <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Add products
                </Link>
              </div>

              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={40} className="text-gray-200" />
                  </div>
                  <p className="text-gray-400 font-black text-lg uppercase tracking-tighter">Your cart is empty.</p>
                  <Link href="/buy" className="mt-6 text-rose-600 font-black uppercase tracking-widest text-xs border-b-2 border-rose-600 pb-1">Shop Collection</Link>
                </div>
              ) : (
                <div className="space-y-8 flex-1 flex flex-col">
                  <div className="space-y-6 flex-1">
                    {cartItems.map((item: any) => (
                      <div key={item.slug.current} className="flex gap-6 items-center group bg-gray-50/50 p-4 rounded-3xl border border-transparent hover:border-gray-100 hover:bg-white transition-all duration-300">
                        <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 p-2 shadow-sm group-hover:shadow-md transition-all">
                          <img src={productImages[item.title] || item.imageUrl} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-lg md:text-xl tracking-tight leading-none mb-2">{item.title}</p>
                          <p className="text-sm md:text-lg font-bold text-gray-400 mb-4 tracking-tighter">₹1599</p>

                          <div className="flex items-center gap-5">
                            <div className="flex items-center bg-white border border-gray-100 rounded-full px-4 py-2 gap-6 shadow-sm">
                              <form action={updateQty.bind(null, item.slug.current, item.qty - 1)}>
                                <button className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-black hover:bg-rose-600 hover:text-white transition-all">−</button>
                              </form>
                              <span className="text-sm font-black w-4 text-center">{item.qty}</span>
                              <form action={updateQty.bind(null, item.slug.current, item.qty + 1)}>
                                <button className="w-8 h-8 rounded-full flex items-center justify-center text-lg font-black hover:bg-rose-600 hover:text-white transition-all">+</button>
                              </form>
                            </div>

                            <div className="flex">
                               <button 
                                 onClick={async (e) => {
                                   e.preventDefault();
                                   await removeFromCart(item.slug.current);
                                   toast.success("Removed item");
                                 }}
                                 className="text-[10px] font-black text-gray-300 hover:text-rose-600 uppercase tracking-widest transition-colors"
                               >
                                 Remove
                               </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* COUPON SECTION */}
                  <div className="pt-8">
                    {appliedCoupon === "CARRY999" ? (
                      <div className="w-full bg-emerald-50 border border-emerald-100 p-5 rounded-[2rem] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-black">✓</div>
                          <div>
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-0.5">CARRY999 Applied</p>
                            <p className="text-xs font-bold text-emerald-800">₹600 discount per item unlocked!</p>
                          </div>
                        </div>
                        <button onClick={() => setAppliedCoupon("")} className="text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-widest">Remove</button>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setAppliedCoupon("CARRY999")}
                        className="w-full bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex items-center justify-between group hover:bg-rose-600 transition-all duration-500 shadow-lg shadow-rose-600/5"
                      >
                        <div className="text-left">
                          <p className="text-[10px] font-black text-rose-600 group-hover:text-white uppercase tracking-[0.2em] mb-1">Exclusive Offer ⚡</p>
                          <p className="text-sm md:text-lg font-black text-black group-hover:text-white tracking-tighter">Apply CARRY999 for ₹999 deal</p>
                        </div>
                        <div className="bg-rose-600 group-hover:bg-white text-white group-hover:text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                          Apply
                        </div>
                      </motion.button>
                    )}
                  </div>

                  {/* BREAKDOWN */}
                  <div className="mt-auto pt-10 border-t border-gray-100 space-y-4">
                    <div className="flex justify-between text-gray-400 text-xs font-black uppercase tracking-[0.2em]">
                      <span>Subtotal</span>
                      <span>₹{total}</span>
                    </div>

                    {appliedCoupon !== "" && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-between items-center text-rose-600"
                      >
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Discount Unlocked</span>
                        <span className="font-black text-lg md:text-xl tracking-tighter">-₹{discount}</span>
                      </motion.div>
                    )}

                    <div className="flex justify-between items-end pt-6 border-t border-gray-50">
                      <div>
                        <p className="text-4xl md:text-6xl font-black tracking-tighter leading-none">₹{finalTotal}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">All Inclusive • Free Shipping</p>
                      </div>
                      <form action={clearCart}>
                        <button className="text-gray-300 hover:text-rose-600 text-[10px] font-black uppercase tracking-widest transition-colors mb-2">Clear Cart</button>
                      </form>
                    </div>
                  </div>

                  <div className="pt-6">
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
                      className="w-full bg-black hover:bg-rose-600 text-white py-6 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-rose-600/10 transition-all transform hover:-translate-y-1"
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
          background: #f9f9f9;
          border: 2px solid #f3f3f3;
          padding: 14px 20px;
          border-radius: 1.5rem;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
        }
        @media (min-width: 768px) {
          .premium-input {
            padding: 20px 28px;
            border-radius: 2rem;
            font-size: 16px;
          }
        }
        .premium-input:focus {
          border-color: #ff3366;
          background: #fff;
          box-shadow: 0 20px 40px rgba(255,51,102,0.08);
          transform: translateY(-2px);
        }
        .premium-input::placeholder {
          color: #ccc;
          font-weight: 500;
        }
      `}</style>
    </motion.section>
  )
}