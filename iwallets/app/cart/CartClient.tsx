"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RazorpayCheckout from "@/components/RazorpayCheckout";
import { updateQty, removeFromCart } from "@/lib/cartActions";
import { trackConversion } from "@/lib/analytics";
import {
  ShoppingBag, Truck, ShieldCheck, Tag,
  CheckCircle2, CreditCard, Banknote, Trash2
} from "lucide-react";
import { Eyebrow, Heading, Card, PriceTag, BackButton } from "@/components/ui/tcc";
import toast from "react-hot-toast";

const PRODUCT_IMAGES: Record<string, string> = {
  "Premium iWallet – White":      "/Iwallet - Images/Prod image- desk -White/1-white.jpg",
  "Premium iWallet – Black":      "/Iwallet - Images/Prod image- desk-Black/1-Black.jpg",
  "Premium iWallet – Space Grey": "/Iwallet - Images/Prod image-desk-grey/1.png",
};

const COUPON_CODE = "SAVE400";
const COUPON_DISCOUNT = 400;

export default function CartClient({ cart = [], products = [] }: any) {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [street, setStreet]     = useState("");
  const [pincode, setPincode]   = useState("");
  const [city, setCity]         = useState("");
  const [state, setState]       = useState("");
  const [landmark, setLandmark] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<"prepaid" | "cod">("prepaid");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder]   = useState(false);
  const [couponInput, setCouponInput]         = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponError, setCouponError]         = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Restore form from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tcc_checkout");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.name)     setName(p.name);
        if (p.email)    setEmail(p.email);
        if (p.phone)    setPhone(p.phone);
        if (p.street)   setStreet(p.street);
        if (p.pincode)  setPincode(p.pincode);
        if (p.city)     setCity(p.city);
        if (p.state)    setState(p.state);
        if (p.landmark) setLandmark(p.landmark);
      }
    } catch { /* ignore */ }
    setIsLoaded(true);
  }, []);

  // Persist form to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("tcc_checkout", JSON.stringify({ name, email, phone, street, pincode, city, state, landmark }));
    } catch { /* ignore */ }
  }, [name, email, phone, street, pincode, city, state, landmark, isLoaded]);

  // ── Cart calculations ────────────────────────────────────────────────────────
  const cartItems = cart
    .map((item: any) => {
      const product = products.find((p: any) => p.slug?.current === item.slug);
      return product ? { ...product, qty: item.qty } : null;
    })
    .filter(Boolean);

  const totalQty      = cartItems.reduce((s: number, i: any) => s + i.qty, 0);
  const subtotal      = totalQty * 1150;
  const couponSaving  = isCouponApplied ? COUPON_DISCOUNT * totalQty : 0;
  const afterCoupon   = Math.max(subtotal - couponSaving, 0);
  const prepaidSaving = paymentMethod === "prepaid" ? Math.round(afterCoupon * 0.05) : 0;
  const finalTotal    = afterCoupon - prepaidSaving;

  const formattedItems = cartItems.map((item: any) => ({
    title: item.title, quantity: item.qty, price: 1150,
  }));

  // ── Coupon apply ─────────────────────────────────────────────────────────────
  const applyCoupon = () => {
    if (couponInput.trim().toUpperCase() === COUPON_CODE) {
      setIsCouponApplied(true);
      setCouponError("");
      toast.success(`Coupon applied! Save ₹${COUPON_DISCOUNT}/item`);
    } else {
      setCouponError("Invalid coupon code");
      toast.error("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setIsCouponApplied(false);
    setCouponInput("");
    setCouponError("");
  };

  // ── Order placement ──────────────────────────────────────────────────────────
  const clearCartCookie = async () => {
    await fetch("/api/cart/clear", { method: "POST" });
  };

  const handleOrderSuccess = async (paymentId: string) => {
    setIsPlacingOrder(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, phone,
          address: { street, city, state, pincode, landmark },
          items: formattedItems,
          amount: finalTotal,
          paymentId,
          paymentMethod: paymentId === "COD" ? "cod" : "prepaid",
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      // Fire purchase conversion
      trackConversion({
        event_name: "purchase",
        email,
        first_name: name.split(" ")[0],
        last_name:  name.split(" ").slice(1).join(" "),
        value:      finalTotal,
        currency:   "INR",
        order_id:   paymentId,
        content_ids: cartItems.map((i: any) => i.slug?.current),
      });

      // Clear form + cart
      localStorage.removeItem("tcc_checkout");
      await clearCartCookie();

      window.location.href = "/success";
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsPlacingOrder(false);
    }
  };

  const isFormValid = name.trim() && email.trim() && phone.trim() &&
                      street.trim() && city.trim() && state.trim() && pincode.trim();

  const openReview = () => {
    if (!isFormValid) {
      toast.error("Please fill in all required fields first");
      return;
    }
    trackConversion({ event_name: "initiate_checkout", value: finalTotal, currency: "INR" });
    setShowReviewModal(true);
  };

  return (
    <section className="relative min-h-screen bg-surface pt-28 md:pt-36 pb-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <Eyebrow className="mb-3">Secure Checkout</Eyebrow>
          <Heading as="h1" className="text-4xl md:text-6xl">
            Review Your <span className="text-brand">Order</span>
          </Heading>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* ── LEFT: Shipping Form ─────────────────────────────────────────── */}
          <Card size="md" className="lg:col-span-3 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                <Truck size={20} className="text-black" />
              </div>
              <h2 className="text-xl font-black uppercase tracking-tighter">Shipping Details</h2>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">Full Name *</label>
                <input
                  type="text" autoComplete="name"
                  placeholder="John Doe"
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="checkout-input"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">Email *</label>
                  <input
                    type="email" autoComplete="email"
                    placeholder="john@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="checkout-input"
                  />
                </div>
                {/* Phone */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">Phone *</label>
                  <input
                    type="tel" autoComplete="tel"
                    placeholder="+91 98765 43210"
                    value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="checkout-input"
                  />
                </div>
              </div>

              {/* Street */}
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">Street Address *</label>
                <input
                  type="text" autoComplete="street-address"
                  placeholder="Flat / Floor / Building / Street"
                  value={street} onChange={(e) => setStreet(e.target.value)}
                  className="checkout-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">City *</label>
                  <input type="text" autoComplete="address-level2" placeholder="Mumbai" value={city} onChange={(e) => setCity(e.target.value)} className="checkout-input" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">State *</label>
                  <input type="text" autoComplete="address-level1" placeholder="Maharashtra" value={state} onChange={(e) => setState(e.target.value)} className="checkout-input" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">Pincode *</label>
                  <input type="text" autoComplete="postal-code" placeholder="400001" value={pincode} onChange={(e) => setPincode(e.target.value)} className="checkout-input" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1.5 ml-1">Landmark</label>
                  <input type="text" placeholder="Near metro station" value={landmark} onChange={(e) => setLandmark(e.target.value)} className="checkout-input" />
                </div>
              </div>
            </div>

            {/* Trust */}
            <div className="mt-8 pt-6 border-t border-border flex items-center gap-3 text-muted-foreground">
              <ShieldCheck size={18} />
              <p className="text-[10px] font-black uppercase tracking-widest">256-bit SSL Encrypted · Razorpay Secured</p>
            </div>
          </Card>

          {/* ── RIGHT: Order Summary ────────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Cart Items */}
            <Card size="md" className="shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                    <ShoppingBag size={18} className="text-primary" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">
                    Order ({totalQty})
                  </h2>
                </div>
                <BackButton href="/buy" label="Add More" />
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-10">
                  <ShoppingBag size={40} className="text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-muted-foreground font-black uppercase tracking-tight">Your cart is empty</p>
                  <BackButton href="/buy" label="Shop Now" className="mt-4" />
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item: any) => (
                    <div key={item.slug?.current} className="flex gap-3 items-center">
                      <div className="w-16 h-16 bg-muted rounded-2xl overflow-hidden shrink-0 border border-border">
                        <img
                          src={PRODUCT_IMAGES[item.title] || item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-sm tracking-tight truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground font-bold">₹1,150 each</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center bg-muted rounded-full border border-border">
                          <form action={updateQty.bind(null, item.slug?.current, item.qty - 1)}>
                            <button className="w-7 h-7 flex items-center justify-center text-sm font-black hover:bg-gray-200 rounded-full transition-colors">−</button>
                          </form>
                          <span className="text-xs font-black w-5 text-center">{item.qty}</span>
                          <form action={updateQty.bind(null, item.slug?.current, item.qty + 1)}>
                            <button className="w-7 h-7 flex items-center justify-center text-sm font-black hover:bg-gray-200 rounded-full transition-colors">+</button>
                          </form>
                        </div>
                        <button
                          onClick={() => { removeFromCart(item.slug?.current); toast.success("Removed"); }}
                          className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-brand transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Coupon */}
            <Card size="sm" className="shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className="text-brand" />
                <p className="text-sm font-black uppercase tracking-widest">Coupon Code</p>
              </div>
              {isCouponApplied ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 size={16} />
                    <span className="text-sm font-black">{COUPON_CODE} — Save ₹{couponSaving}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-gray-400 hover:text-red-500 font-bold transition-colors">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. SAVE400)"
                    value={couponInput}
                    onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    className="flex-1 bg-muted border border-border rounded-2xl px-4 py-2.5 text-sm font-bold outline-none focus:border-primary transition-colors"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-2.5 bg-black text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-brand transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="text-xs text-red-500 font-bold mt-2 ml-1">{couponError}</p>}
            </Card>

            {/* Payment Method */}
            <Card size="sm" className="shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Payment Method</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod("prepaid")}
                  className={`py-3 rounded-2xl font-black text-xs uppercase tracking-widest border-2 flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === "prepaid"
                      ? "border-black bg-black text-white"
                      : "border-border text-muted-foreground hover:border-primary"
                  }`}
                >
                  <CreditCard size={14} /> Prepaid
                </button>
                <button
                  onClick={() => setPaymentMethod("cod")}
                  className={`py-3 rounded-2xl font-black text-xs uppercase tracking-widest border-2 flex items-center justify-center gap-2 transition-all ${
                    paymentMethod === "cod"
                      ? "border-black bg-black text-white"
                      : "border-border text-muted-foreground hover:border-primary"
                  }`}
                >
                  <Banknote size={14} /> Cash / COD
                </button>
              </div>
              <AnimatePresence>
                {paymentMethod === "prepaid" && prepaidSaving > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2.5 text-xs text-emerald-700 font-bold overflow-hidden"
                  >
                    💳 Extra 5% prepaid discount applied — Save ₹{prepaidSaving}!
                  </motion.div>
                )}
                {paymentMethod === "cod" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-2.5 text-xs text-amber-700 font-bold overflow-hidden"
                  >
                    💡 Switch to Prepaid and save an extra 5% (₹{Math.round(afterCoupon * 0.05)})
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            {/* Price Breakdown */}
            <Card size="sm" className="shadow-sm">
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Subtotal ({totalQty} item{totalQty !== 1 ? "s" : ""})</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                {couponSaving > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon ({COUPON_CODE})</span>
                    <span>-₹{couponSaving.toLocaleString("en-IN")}</span>
                  </div>
                )}
                {prepaidSaving > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Prepaid Discount (5%)</span>
                    <span>-₹{prepaidSaving.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
              </div>
              <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
                <span className="font-black text-base uppercase tracking-widest">Total</span>
                <PriceTag amount={finalTotal} size="lg" />
              </div>

              <button
                disabled={!isFormValid || cartItems.length === 0}
                onClick={openReview}
                className="w-full mt-5 py-4 bg-primary hover:bg-brand disabled:bg-muted-foreground disabled:cursor-not-allowed text-primary-foreground font-black text-sm uppercase tracking-[0.2em] rounded-full transition-all shadow-xl shadow-black/10 transform hover:-translate-y-0.5"
              >
                Review & Place Order
              </button>
            </Card>
          </div>
        </div>
      </div>

      {/* ── Order Review Modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 text-center">Confirm Order</h3>

              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-2xl border border-border">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Delivering to</p>
                  <p className="font-black text-black">{name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{phone} · {email}</p>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {street}, {city}, {state} — {pincode}
                    {landmark && <>, near {landmark}</>}
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-2xl border border-border">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Items</p>
                  <ul className="space-y-1">
                    {cartItems.map((item: any, i: number) => (
                      <li key={i} className="flex justify-between text-sm font-bold text-primary">
                        <span className="truncate pr-4">{item.qty}× {item.title}</span>
                        <span>₹{(1150 * item.qty).toLocaleString("en-IN")}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-sm">
                    <span className="font-bold text-gray-400">Payment</span>
                    <span className="font-black uppercase text-brand tracking-widest text-xs">
                      {paymentMethod === "prepaid" ? "Prepaid Online" : "Cash on Delivery"}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between items-center">
                    <span className="font-bold text-gray-400 text-sm">Total</span>
                    <span className="font-black text-xl text-black">₹{finalTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-4 rounded-full font-black text-xs uppercase tracking-widest bg-muted text-primary hover:bg-border transition-colors"
                >
                  Edit Details
                </button>
                <div className="flex-1">
                  {paymentMethod === "prepaid" ? (
                    <RazorpayCheckout
                      amount={finalTotal}
                      loading={isPlacingOrder}
                      prefill={{ name, email, contact: phone }}
                      onSuccess={(paymentId: string) => handleOrderSuccess(paymentId)}
                      className="w-full bg-brand hover:bg-primary text-primary-foreground py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-2"
                    />
                  ) : (
                    <button
                      disabled={isPlacingOrder}
                      onClick={() => handleOrderSuccess("COD")}
                      className="w-full py-4 bg-brand hover:bg-primary disabled:bg-muted-foreground text-primary-foreground rounded-full font-black text-xs uppercase tracking-widest shadow-xl transition-all"
                    >
                      {isPlacingOrder ? "Placing Order…" : "Place COD Order"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .checkout-input {
          width: 100%;
          background: #f9fafb;
          border: 2px solid #f3f4f6;
          padding: 12px 16px;
          border-radius: 1rem;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
          outline: none;
        }
        .checkout-input:focus {
          border-color: #111;
          background: #fff;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }
        .checkout-input::placeholder { color: #d1d5db; font-weight: 500; }
      `}</style>
    </section>
  );
}
