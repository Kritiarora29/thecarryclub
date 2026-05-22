"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <section className="min-h-screen bg-[#fafafa] pt-32 md:pt-48 pb-20 font-sans">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-20 md:mb-32 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-rose-600/10 rounded-full blur-[100px] -z-10"
          />
          <p className="text-rose-600 font-black tracking-[0.3em] text-[10px] md:text-sm uppercase mb-6">Legal Documentation</p>
          <h1 className="text-6xl md:text-[100px] font-black text-black leading-none tracking-tighter mb-8">
            Terms of <br /> <span className="text-rose-600">Service.</span>
          </h1>
          <div className="w-24 h-2 bg-black rounded-full" />
        </div>

        {/* Content */}
        <div className="bg-white rounded-[3rem] p-8 md:p-20 shadow-2xl shadow-gray-200/50 border border-gray-100 prose prose-lg max-w-none text-gray-500 font-medium space-y-12">
          <p className="text-xl md:text-2xl text-black font-bold leading-relaxed mb-12">
            By using our website and purchasing our products, you agree to the following terms and conditions. Please read them carefully.
          </p>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-rose-600">01.</span> General
            </h2>
            <p className="leading-relaxed">
              theCarryClub reserves the right to update these terms at any time. Your continued use of the site constitutes acceptance of any changes. We may modify, suspend or discontinue any part of the service at any time.
            </p>
          </section>

          <section className="space-y-6 border-t border-gray-50 pt-12">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-rose-600">02.</span> Product Availability
            </h2>
            <p className="leading-relaxed">
              While we strive for accuracy, we cannot guarantee that all items will always be in stock. Prices are subject to change without notice. All descriptions of products or product pricing are subject to change at any time without notice.
            </p>
          </section>

          <section className="space-y-6 border-t border-gray-50 pt-12">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-rose-600">03.</span> Intellectual Property
            </h2>
            <p className="leading-relaxed">
              All content on this site, including images, text, and logos, is the property of theCarryClub and is protected by copyright laws. You may not use our intellectual property without express written permission.
            </p>
          </section>

          <section className="space-y-6 border-t border-gray-50 pt-12">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-rose-600">04.</span> Liability
            </h2>
            <p className="leading-relaxed">
              theCarryClub is not liable for any indirect, incidental, or consequential damages arising from the use of our products. Our total liability to you for any losses shall not exceed the amount paid by you for the product.
            </p>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-20 text-center">
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Last updated: May 2026</p>
        </div>
      </div>
    </section>
  );
}
