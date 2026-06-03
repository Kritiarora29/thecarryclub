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

  const [paymentMethod, setPaymentMethod] = useState("prepaid")
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [isCouponApplied, setIsCouponApplied] = useState(false)

  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [isSendingLink, setIsSendingLink] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [verificationExpiry, setVerificationExpiry] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  // Restore form from localStorage & check if already verified
  useEffect(() => {
    const savedForm = localStorage.getItem("checkout_form");
    if (savedForm) {
      try {
        const parsed = JSON.parse(savedForm);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.street) setStreet(parsed.street);
        if (parsed.pincode) setPincode(parsed.pincode);
        if (parsed.city) setCity(parsed.city);
        if (parsed.state) setState(parsed.state);
        if (parsed.landmark) setLandmark(parsed.landmark);
        if (parsed.verificationExpiry) setVerificationExpiry(parsed.verificationExpiry);
        
        // Auto-check if this email is already verified in DB!
        if (parsed.email) {
          fetch(`/api/verify/status?email=${encodeURIComponent(parsed.email.trim())}`)
            .then(res => res.json())
            .then(data => {
              if (data.verified) {
                setIsEmailVerified(true);
                if (!parsed.verificationExpiry) {
                  setVerificationExpiry(Date.now() + 15 * 60 * 1000);
                }
              }
            })
            .catch(console.error);
        }
      } catch (e) {
        console.error("Error loading saved form", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save form to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("checkout_form", JSON.stringify({
        name, email, phone, street, pincode, city, state, landmark, verificationExpiry
      }));
    }
  }, [name, email, phone, street, pincode, city, state, landmark, isLoaded, verificationExpiry]);

  /* 
  // Polling for email verification
  useEffect(() => {
    let interval: any;
    if (verificationSent && !isEmailVerified && email.trim()) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/verify/status?email=${encodeURIComponent(email.trim())}`);
          const data = await res.json();
          if (data.verified) {
            setIsEmailVerified(true);
            setVerificationSent(false);
            setVerificationExpiry(Date.now() + 15 * 60 * 1000);
            toast.success("Email verified successfully!");
          }
        } catch (e) {
          console.error(e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [verificationSent, isEmailVerified, email]);

  // Handle URL param on redirect back
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("verified") === "true") {
        setIsEmailVerified(true);
        setVerificationExpiry(Date.now() + 15 * 60 * 1000);
        toast.success("Email verified successfully!");
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Timer countdown logic
  useEffect(() => {
    let interval: any;
    if (isEmailVerified && verificationExpiry) {
      interval = setInterval(() => {
        const now = Date.now();
        const diff = verificationExpiry - now;
        
        if (diff <= 0) {
          clearInterval(interval);
          setIsEmailVerified(false);
          setVerificationExpiry(null);
          setTimeLeft("");
          toast.error("Verification expired. Please verify your email again.");
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
        }
      }, 1000);
    } else {
      setTimeLeft("");
    }
    return () => clearInterval(interval);
  }, [isEmailVerified, verificationExpiry]);
  */

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
  const total = totalQty * 1399

  const discount = isCouponApplied ? 400 * totalQty : 0
  const baseFinalTotal = Math.max(total - discount, 0)
  
  const prepaidDiscount = paymentMethod === "prepaid" ? Math.round(baseFinalTotal * 0.05) : 0
  const finalTotal = baseFinalTotal - prepaidDiscount

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
              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                  <input type="text" name="name" autoComplete="name" className="premium-input" placeholder="John Doe *" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                  <div className="flex gap-2 items-stretch">
                    <input 
                      type="email"
                      name="email"
                      autoComplete="email"
                      className="premium-input flex-1" 
                      placeholder="john@example.com *" 
                      value={email} 
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }} 
                    />
                    {/*
                    <button
                      type="button"
                      onClick={async () => {
                        if (!email.trim() || !email.includes("@")) {
                          toast.error("Please enter a valid email");
                          return;
                        }
                        setIsSendingLink(true);
                        try {
                          const res = await fetch("/api/verify/send", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: email.trim() }),
                          });
                          if (res.ok) {
                            setVerificationSent(true);
                            toast.success("Verification link sent! Check your inbox.");
                          } else {
                            toast.error("Failed to send link");
                          }
                        } catch (e) {
                          toast.error("Error sending link");
                        } finally {
                          setIsSendingLink(false);
                        }
                      }}
                      disabled={!email.trim() || isEmailVerified || isSendingLink}
                      className={`px-4 md:px-6 rounded-2xl md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase tracking-widest transition-all whitespace-nowrap flex items-center justify-center ${
                        isEmailVerified 
                          ? "bg-green-100 text-green-600 cursor-default" 
                          : verificationSent 
                            ? "bg-rose-100 text-rose-600" 
                            : "bg-black hover:bg-rose-600 disabled:bg-gray-300 text-white shadow-lg"
                      }`}
                    >
                      {isEmailVerified ? "Verified ✅" : isSendingLink ? "..." : verificationSent ? "Sent!" : "Verify"}
                    </button>
                    */}
                  </div>
                  {/*
                  {verificationSent && !isEmailVerified && (
                    <p className="text-[10px] text-rose-600 font-bold ml-4 mt-2">Waiting for verification... Please click the link sent to your email. You can safely open it on your phone.</p>
                  )}
                  {isEmailVerified && (
                    <div className="flex items-center gap-3 ml-4 mt-2">
                      {timeLeft && (
                        <p className="text-[10px] font-bold text-gray-500 uppercase">
                          Expires in: <span className="text-rose-500">{timeLeft}</span>
                        </p>
                      )}
                      <button 
                        type="button" 
                        onClick={() => { 
                          setIsEmailVerified(false); 
                          setVerificationSent(false); 
                          setVerificationExpiry(null); 
                        }} 
                        className="text-[10px] text-gray-400 hover:text-black font-bold underline transition-colors"
                      >
                        Change email
                      </button>
                    </div>
                  )}
                  */}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Phone Number</label>
                <input type="tel" name="phone" autoComplete="tel" className="premium-input" placeholder="+91 00000 00000 *" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Street Address</label>
                <input
                  type="text"
                  name="street-address"
                  autoComplete="street-address"
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
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    className="premium-input"
                    placeholder="City *"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">State</label>
                  <input
                    type="text"
                    name="state"
                    autoComplete="address-level1"
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
                    type="text"
                    name="postal-code"
                    autoComplete="postal-code"
                    className="premium-input"
                    placeholder="Pincode *"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Landmark</label>
                  <input
                    type="text"
                    name="landmark"
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
            <div className="bg-white p-5 md:p-16 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col h-full">

              <div className="flex justify-between items-center mb-8 md:mb-10 gap-2">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                    <ShoppingBag className="text-black w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tighter uppercase">Summary</h2>
                </div>
                <Link href="/buy" className="text-[8px] sm:text-[10px] font-black text-rose-600 hover:underline uppercase tracking-widest flex items-center gap-1.5 md:gap-2 group shrink-0">
                  <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> <span className="hidden sm:inline">Add</span> Products
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
                      <div key={item.slug.current} className="flex gap-4 md:gap-6 items-center group bg-gray-50/50 p-3 md:p-4 rounded-3xl border border-transparent hover:border-gray-100 hover:bg-white transition-all duration-300">
                        <div className="w-16 h-16 md:w-28 md:h-28 bg-white rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100 p-2 shadow-sm group-hover:shadow-md transition-all">
                          <img src={productImages[item.title] || item.imageUrl} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-base md:text-xl tracking-tight leading-none mb-1 md:mb-2 truncate">{item.title}</p>
                          <p className="text-sm md:text-lg font-bold text-gray-400 mb-3 md:mb-4 tracking-tighter">₹1399 <span className="line-through text-xs ml-2">₹1599</span></p>

                          <div className="flex items-center justify-between md:justify-start gap-2 md:gap-5 flex-wrap">
                            <div className="flex items-center bg-white border border-gray-100 rounded-full px-3 py-1.5 md:px-4 md:py-2 gap-4 md:gap-6 shadow-sm">
                              <form action={updateQty.bind(null, item.slug.current, item.qty - 1)}>
                                <button className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-lg font-black hover:bg-rose-600 hover:text-white transition-all">−</button>
                              </form>
                              <span className="text-xs md:text-sm font-black w-4 text-center">{item.qty}</span>
                              <form action={updateQty.bind(null, item.slug.current, item.qty + 1)}>
                                <button className="w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-lg font-black hover:bg-rose-600 hover:text-white transition-all">+</button>
                              </form>
                            </div>

                            <div className="flex ml-auto md:ml-0">
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
                  <div className="bg-rose-50 border border-rose-100 p-3 md:p-5 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="bg-white w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center shrink-0">
                        <span className="text-lg md:text-xl">🎟️</span>
                      </div>
                      <div>
                        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-rose-600">Special Offer</p>
                        <p className="text-xs md:text-sm font-bold text-gray-700 mt-0.5 tracking-tighter">Get it for ₹999 <span className="text-gray-400 font-medium">(Save ₹400/item)</span></p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setIsCouponApplied(!isCouponApplied);
                        if (!isCouponApplied) toast.success("Coupon Applied!");
                      }}
                      className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all shrink-0 ${isCouponApplied ? 'bg-black text-white shadow-lg shadow-black/20' : 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/20'}`}
                    >
                      {isCouponApplied ? 'APPLIED ✅' : 'APPLY'}
                    </button>
                  </div>

                  {/* BREAKDOWN */}
                  <div className="mt-auto pt-8 border-t border-gray-100 space-y-4">
                    <div className="flex justify-between text-gray-400 text-xs font-black uppercase tracking-[0.2em]">
                      <span>Subtotal (₹1399 per item)</span>
                      <span className="line-through">₹{total}</span>
                    </div>

                    <AnimatePresence>
                      {discount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex justify-between items-center text-rose-600 overflow-hidden"
                        >
                          <span className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 pt-2 pb-2">
                            <span className="bg-rose-50 border border-rose-100 text-[#ff3366] text-[8px] md:text-[10px] px-2 py-0.5 rounded-full shadow-sm animate-pulse">🔥 Special Coupon Applied</span>
                          </span>
                          <span className="font-black text-lg md:text-xl tracking-tighter">-₹{discount}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {paymentMethod === "prepaid" && prepaidDiscount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex justify-between items-center text-green-600 overflow-hidden pt-4"
                        >
                          <span className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="bg-green-50 border border-green-100 text-green-600 text-[8px] md:text-[10px] px-2 py-0.5 rounded-full shadow-sm">💳 Extra 5% Prepaid Discount</span>
                          </span>
                          <span className="font-black text-lg md:text-xl tracking-tighter">-₹{prepaidDiscount}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex justify-between items-end pt-6 border-t border-gray-50">
                      <div>
                        <p className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-[#ff3366]">₹{finalTotal}</p>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">All Inclusive • Free Shipping</p>
                      </div>
                      <form action={clearCart}>
                        <button className="text-gray-300 hover:text-rose-600 text-[10px] font-black uppercase tracking-widest transition-colors mb-2">Clear Cart</button>
                      </form>
                    </div>
                  </div>

                  <div className="pt-6 space-y-4">
                    <div className="flex flex-row gap-2 md:gap-4">
                      <button 
                        onClick={() => setPaymentMethod("prepaid")}
                        className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest border-2 transition-all ${paymentMethod === "prepaid" ? "border-rose-600 bg-rose-50 text-rose-600" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}
                      >
                        Prepaid
                      </button>
                      <button 
                        onClick={() => setPaymentMethod("cod")}
                        className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest border-2 transition-all ${paymentMethod === "cod" ? "border-rose-600 bg-rose-50 text-rose-600" : "border-gray-100 text-gray-400 hover:border-gray-200"}`}
                      >
                        Cash on Delivery
                      </button>
                    </div>

                    <AnimatePresence>
                      {paymentMethod === "cod" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-orange-50 border border-orange-200 text-orange-600 p-3 rounded-xl flex items-start gap-3 overflow-hidden mt-4"
                        >
                          <span className="text-xl">💡</span>
                          <div>
                            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest">Missed out on savings!</p>
                            <p className="text-[10px] font-bold mt-1">Switch to Prepaid and get an extra 5% discount (Save ₹{Math.round(baseFinalTotal * 0.05)}) instantly.</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      disabled={!name.trim() || !email.trim() || !phone.trim() || !street.trim() || !city.trim() || !state.trim() || !pincode.trim()}
                      onClick={(e) => { e.preventDefault(); setShowReviewModal(true); }}
                      className="w-full bg-black hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-6 rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-rose-600/10 transition-all transform hover:-translate-y-1"
                    >
                      REVIEW & PLACE ORDER
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* REVIEW MODAL */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 text-center">Review Order</h3>
              
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-3">Shipping Details</h4>
                  <p className="font-bold text-black">{name}</p>
                  <p className="text-sm text-gray-600">{phone} • {email}</p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {street}, {city}, {state} - {pincode}
                    {landmark && <><br/>Landmark: {landmark}</>}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-gray-400 mb-3">Order Items</h4>
                  <ul className="space-y-2">
                    {cartItems.map((item: any, i: number) => (
                      <li key={i} className="flex justify-between text-sm font-bold text-gray-800">
                        <span className="truncate pr-4">{item.qty}x {item.title}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-sm uppercase tracking-widest text-gray-400">Payment</span>
                    <span className="font-black text-rose-600 uppercase text-sm tracking-widest">{paymentMethod === 'prepaid' ? 'Prepaid Online' : 'Cash Delivery'}</span>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="font-bold text-sm uppercase tracking-widest text-gray-400">Total</span>
                    <span className="font-black text-xl text-black">₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3 flex-col sm:flex-row">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-4 rounded-full font-black text-xs uppercase tracking-widest bg-gray-100 text-black hover:bg-gray-200 transition-colors"
                >
                  Edit Details
                </button>
                <div className="flex-1 flex">
                  {paymentMethod === "prepaid" ? (
                    <RazorpayCheckout
                      amount={finalTotal}
                      loading={isPlacingOrder}
                      prefill={{ name, email, contact: phone }}
                      onSuccess={async (paymentId: any) => {
                        setIsPlacingOrder(true);
                        const formattedItems = cartItems.map((item: any) => ({
                          title: item.title,
                          quantity: item.qty,
                          price: 1399
                        }));
                        await fetch("/api/order", {
                          method: "POST",
                          body: JSON.stringify({ name, email, phone, address: { street, city, state, pincode, landmark }, items: formattedItems, amount: finalTotal, paymentId, paymentMethod: "prepaid" }),
                        })
                        localStorage.removeItem("cart")
                        window.location.href = "/success"
                      }}
                      className="w-full bg-[#ff3366] hover:bg-black text-white py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl transition-all"
                    />
                  ) : (
                    <button
                      disabled={isPlacingOrder}
                      onClick={async () => {
                        setIsPlacingOrder(true);
                        const formattedItems = cartItems.map((item: any) => ({
                          title: item.title,
                          quantity: item.qty,
                          price: 1399
                        }));
                        await fetch("/api/order", {
                          method: "POST",
                          body: JSON.stringify({ name, email, phone, address: { street, city, state, pincode, landmark }, items: formattedItems, amount: finalTotal, paymentId: "COD", paymentMethod: "cod" }),
                        })
                        localStorage.removeItem("cart")
                        window.location.href = "/success"
                      }}
                      className="w-full bg-[#ff3366] hover:bg-black disabled:bg-gray-300 text-white py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      {isPlacingOrder ? "PROCESSING..." : "PLACE ORDER"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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