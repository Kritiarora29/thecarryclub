"use client";

import { motion } from "framer-motion";

export default function PrivacyPage() {
  return (
    <section className="min-h-screen bg-[#fafafa] px-6 pt-32 md:pt-40 pb-20">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-black tracking-tighter mb-12"
        >
          PRIVACY <span className="text-[#ff3366]">POLICY.</span>
        </motion.h1>

        <div className="prose prose-lg max-w-none text-gray-600 font-medium space-y-8">
          <p>
            At theCarryClub, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">1. Information Collection</h2>
            <p>
              We collect information you provide directly to us when you make a purchase, including your name, email address, shipping address, and phone number.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">2. Use of Information</h2>
            <p>
              Your information is used solely to process your orders, communicate about your purchase, and improve our services. We do not sell your data to third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">3. Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information. All payments are processed through secure, encrypted gateways (Razorpay).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">4. Cookies</h2>
            <p>
              We use cookies to enhance your browsing experience and analyze site traffic. You can manage your cookie preferences through your browser settings.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
