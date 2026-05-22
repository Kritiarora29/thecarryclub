"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function SuccessPage() {
  const hasShownToast = useRef(false);
  
  useEffect(() => {
    // Clear cart on client side as well just in case
    localStorage.removeItem("cart");
    
    if (!hasShownToast.current) {
      toast.success("Order Placed");
      hasShownToast.current = true;
    }
  }, []);

  return (
    <section className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 font-sans overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-[3rem] p-10 md:p-20 shadow-2xl shadow-gray-200/50 border border-gray-100 text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 md:w-32 md:h-32 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10"
        >
          <CheckCircle2 size={64} strokeWidth={1.5} />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-7xl font-black tracking-tighter mb-6"
        >
          Order <span className="text-emerald-600">Confirmed.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-gray-500 text-lg md:text-xl font-medium mb-12 leading-relaxed"
        >
          Thank you for choosing theCarryClub. Your premium iWallet is being prepared for dispatch. We'll send you a tracking link shortly.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link 
            href="/buy" 
            className="w-full sm:w-auto px-10 py-5 bg-black text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-600/10 transform hover:-translate-y-1 flex items-center justify-center gap-3"
          >
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
          <Link 
            href="/" 
            className="w-full sm:w-auto px-10 py-5 bg-gray-50 text-gray-500 rounded-full font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
          >
            Home <ArrowRight size={18} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}