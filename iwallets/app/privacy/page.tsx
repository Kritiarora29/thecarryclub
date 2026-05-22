"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <section className="min-h-screen bg-[#fafafa] pt-32 md:pt-48 pb-20 font-sans">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-20 md:mb-32 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -z-10"
          />
          <p className="text-blue-600 font-black tracking-[0.3em] text-[10px] md:text-sm uppercase mb-6">Legal Documentation</p>
          <h1 className="text-6xl md:text-[100px] font-black text-black leading-none tracking-tighter mb-8">
            Privacy <br /> <span className="text-blue-600">Policy.</span>
          </h1>
          <div className="w-24 h-2 bg-black rounded-full" />
        </div>

        {/* Content */}
        <div className="bg-white rounded-[3rem] p-8 md:p-20 shadow-2xl shadow-gray-200/50 border border-gray-100 prose prose-lg max-w-none text-gray-500 font-medium space-y-12">
          <p className="text-xl md:text-2xl text-black font-bold leading-relaxed mb-12">
            Your privacy is of the utmost importance to us. This policy outlines how we collect, use, and protect your personal information.
          </p>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-blue-600">01.</span> Data Collection
            </h2>
            <p className="leading-relaxed">
              We collect information you provide directly to us when you make a purchase, sign up for our newsletter, or contact support. This includes your name, email, phone number, and shipping address.
            </p>
          </section>

          <section className="space-y-6 border-t border-gray-50 pt-12">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-blue-600">02.</span> How We Use Data
            </h2>
            <p className="leading-relaxed">
              We use your information to process orders, provide customer support, and send promotional updates (if you've opted in). We do not sell your personal data to third parties.
            </p>
          </section>

          <section className="space-y-6 border-t border-gray-50 pt-12">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-blue-600">03.</span> Security
            </h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or destruction. All transactions are processed through secure payment gateways.
            </p>
          </section>

          <section className="space-y-6 border-t border-gray-50 pt-12">
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight flex items-center gap-4">
              <span className="text-blue-600">04.</span> Cookies
            </h2>
            <p className="leading-relaxed">
              Our website uses cookies to enhance your browsing experience and analyze site traffic. You can choose to disable cookies through your browser settings, though this may affect site functionality.
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
