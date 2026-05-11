"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Instagram, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-[#fafafa] px-6 pt-32 md:pt-40 pb-20 overflow-hidden">
      <div className="max-w-6xl mx-auto">

        {/* Hero Section */}
        <div className="text-center mb-24 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#ff3366]/10 rounded-full blur-[100px] -z-10"
          />
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-6xl font-black text-black tracking-tighter leading-none"
          >
            OUR <span className="text-[#ff3366]">STORY.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-8 text-lg md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto uppercase tracking-wide"
          >
            Minimal design. <span className="text-black">Exceptional</span> carry.
          </motion.p>
        </div>

        {/* Content Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col justify-center"
          >
            <h2 className="text-2xl md:text-4xl font-black text-black tracking-tight mb-6 md:mb-8">
              The Vision
            </h2>

            <div className="space-y-6 text-base md:text-lg text-gray-600 leading-relaxed font-medium">
              <p>
                We believe everyday essentials should feel <span className="text-black font-black">intentional</span>.
              </p>

              <p>
                Our wallets are designed for people who prefer less — less bulk,
                less noise, less distraction. <span className="text-[#ff3366]">Clean lines, premium materials,
                and practical engineering.</span>
              </p>

              <p>
                This isn’t just about carrying cards. It’s about <span className="text-black font-black">confidence</span>
                in the details you carry every single day.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-black rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 shadow-2xl text-white flex flex-col justify-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff3366]/20 rounded-full blur-[60px]" />
            
            <h2 className="text-2xl md:text-4xl font-black tracking-tight mb-6 md:mb-8">
              Why theCarryClub?
            </h2>

            <ul className="space-y-8">
              {[
                "Premium vegan leather, crafted for longevity.",
                "Ultra-slim profile with zero unnecessary bulk.",
                "Built for daily use, engineered to stay sharp.",
                "Minimal design that fits every modern style."
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4 items-start group">
                  <div className="mt-1 w-6 h-6 rounded-full bg-[#ff3366] flex-shrink-0 flex items-center justify-center text-[10px] font-black">
                    {idx + 1}
                  </div>
                  <p className="text-gray-300 font-bold group-hover:text-white transition-colors">
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-40 text-center"
        >
          <div className="inline-block px-4 py-2 bg-rose-50 rounded-full mb-4 md:mb-8">
            <p className="text-[#ff3366] font-black text-[10px] md:text-xs uppercase tracking-widest">Connect with us</p>
          </div>
          
          <h2 className="text-3xl md:text-6xl font-black text-black tracking-tighter mb-6 md:mb-10">
            Let's Start a <br className="md:hidden" /><span className="text-[#ff3366]">Conversation.</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-12 mx-auto">
            <a
              href="mailto:info@thecarryclub.in"
              className="group flex items-center justify-center gap-3 md:gap-4 bg-white px-6 md:px-8 py-3 md:py-4 rounded-full shadow-xl hover:shadow-[#ff3366]/10 transition-all border border-gray-100"
            >
              <div className="bg-[#ff3366] text-white p-2 md:p-3 rounded-full group-hover:rotate-12 transition-transform">
                <Mail size={16} className="md:w-5 md:h-5" />
              </div>
              <span className="text-sm md:text-lg font-black tracking-tight">Email Us</span>
            </a>

            <Link
              href="https://instagram.com/thecarryclub.in"
              target="_blank"
              className="group flex items-center justify-center gap-3 md:gap-4 bg-white px-6 md:px-8 py-3 md:py-4 rounded-full shadow-xl hover:shadow-[#ff3366]/10 transition-all border border-gray-100"
            >
              <div className="bg-black text-white p-2 md:p-3 rounded-full group-hover:rotate-12 transition-transform">
                <Instagram size={16} className="md:w-5 md:h-5" />
              </div>
              <span className="text-sm md:text-lg font-black tracking-tight">Instagram</span>
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
