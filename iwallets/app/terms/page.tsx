"use client";

import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <section className="min-h-screen bg-[#fafafa] px-6 pt-32 md:pt-40 pb-20">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black text-black tracking-tighter mb-12"
        >
          TERMS of <span className="text-[#ff3366]">SERVICE.</span>
        </motion.h1>

        <div className="prose prose-lg max-w-none text-gray-600 font-medium space-y-8">
          <p>
            By using our website and purchasing our products, you agree to the following terms and conditions.
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">1. General</h2>
            <p>
              theCarryClub reserves the right to update these terms at any time. Your continued use of the site constitutes acceptance of any changes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">2. Product Availability</h2>
            <p>
              While we strive for accuracy, we cannot guarantee that all items will always be in stock. Prices are subject to change without notice.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">3. Intellectual Property</h2>
            <p>
              All content on this site, including images, text, and logos, is the property of theCarryClub and is protected by copyright laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">4. Liability</h2>
            <p>
              theCarryClub is not liable for any indirect, incidental, or consequential damages arising from the use of our products.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
