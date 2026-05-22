"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

export default function ReturnsPage() {
  return (
    <section className="min-h-screen bg-[#fafafa] pt-32 md:pt-48 pb-20 font-sans">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-20 md:mb-32 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px] -z-10"
          />
          <p className="text-emerald-600 font-black tracking-[0.3em] text-[10px] md:text-sm uppercase mb-6">Service Policy</p>
          <h1 className="text-6xl md:text-[100px] font-black text-black leading-none tracking-tighter mb-8">
            Returns & <br /> <span className="text-emerald-600">Refunds.</span>
          </h1>
          <div className="w-24 h-2 bg-black rounded-full" />
        </div>

        {/* Content */}
        <div className="bg-white rounded-[3rem] p-8 md:p-20 shadow-2xl shadow-gray-200/50 border border-gray-100 prose prose-lg max-w-none text-gray-500 font-medium space-y-12">
          <div className="bg-rose-50 border border-rose-100 p-8 md:p-12 rounded-[2rem] mb-12">
             <h2 className="text-rose-600 font-black text-2xl md:text-3xl tracking-tight mb-4 uppercase">Important Notice</h2>
             <p className="text-rose-600 font-bold text-lg md:text-xl leading-relaxed">
               ALL SALES ARE FINAL! Due to the limited nature of our drops and releases, we do not offer standard returns or exchanges unless the product is defective.
             </p>
          </div>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-emerald-600">01.</span> Quality Check
            </h2>
            <p className="leading-relaxed">
              Every single iWallet undergoes a rigorous multi-point quality inspection before it is packed and shipped. We ensure that you receive a product that meets our high standards of craftsmanship.
            </p>
          </section>

          <section className="space-y-6 border-t border-gray-50 pt-12">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-emerald-600">02.</span> Defective Items
            </h2>
            <p className="leading-relaxed">
              In the rare event that you receive a defective item, please contact us at <span className="text-black font-black">info@thecarryclub.in</span> within 5 days of delivery. Include your order number and clear photos of the defect.
            </p>
          </section>

          <section className="space-y-6 border-t border-gray-50 pt-12">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-emerald-600">03.</span> Shipping Damage
            </h2>
            <p className="leading-relaxed">
              If your package arrives visibly damaged, please take photos before opening it and contact us immediately. We will work with our courier partners to resolve the issue for you.
            </p>
          </section>

          <section className="space-y-6 border-t border-gray-50 pt-12">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-emerald-600">04.</span> Refunds
            </h2>
            <p className="leading-relaxed">
              Refunds are only issued for verified defective items that cannot be replaced. Once approved, the refund will be processed to your original payment method within 7-10 business days.
            </p>
          </section>
        </div>

        {/* Support Section */}
        <div className="mt-20 flex flex-col items-center">
           <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <RotateCcw className="text-black" size={32} strokeWidth={1} />
           </div>
           <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Questions? info@thecarryclub.in</p>
        </div>
      </div>
    </section>
  );
}
