"use client";

import { motion } from "framer-motion";

export default function ReturnsPage() {
  return (
    <section className="min-h-screen bg-[#fafafa] px-6 pt-32 md:pt-40 pb-20">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-black tracking-tighter mb-12"
        >
          RETURNS <span className="text-[#ff3366]">& EXCHANGE.</span>
        </motion.h1>

        <div className="prose prose-lg max-w-none text-gray-600 font-medium space-y-8">
          <p>
            We want you to love your iWallet. If you're not satisfied, we offer a straightforward returns process.
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">1. 7-Day Window</h2>
            <p>
              You can return or exchange any unused item in its original packaging within 7 days of delivery.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">2. Conditions</h2>
            <p>
              Items must be in pristine condition with no signs of wear or use. Original packaging and tags must be intact.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">3. Process</h2>
            <p>
              To initiate a return, please email us at <span className="text-[#ff3366] font-bold">info@thecarryclub.in</span> with your order number and reason for return.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">4. Refunds</h2>
            <p>
              Once we receive and inspect the item, we will process your refund back to your original payment method within 5-7 business days.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
