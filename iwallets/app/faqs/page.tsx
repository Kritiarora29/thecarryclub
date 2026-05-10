"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

const faqs = [
  {
    question: "What is iWallet?",
    answer: "iWallet is a minimal, premium wallet designed for everyday use. It combines durability, clean design, and practicality."
  },
  {
    question: "What materials are used in iWallet?",
    answer: "iWallet is made from high-quality vegan leather with reinforced stitching for long-lasting use."
  },
  {
    question: "Do you ship across India?",
    answer: "Yes, we ship across all major cities and towns in India."
  },
  {
    question: "How long does delivery take?",
    answer: "Orders are usually delivered within 5-7 business days, depending on your location."
  },
  {
    question: "Can I return or replace my iWallet?",
    answer: "ALL SALE ARE FINAL!\nAll items are inspected for quality before shipping out. If anything is wrong with the item feel free to email info@thecarryclub.in with your order within 5 days. Due to limited releases, most sales are final. Unless item is defective."
  },
  {
    question: "How can I contact support?",
    answer: "You can reach us at info@thecarryclub.in for any queries or assistance."
  },
  {
    question: "Is this a real Apple product?",
    answer: "Carry Club is a fully in-house art and design studio. We’ve been creating boundary-pushing custom work that blends streetwear, luxury aesthetics, and original artistic direction.\nWe specialize in reimagining brand aesthetics, twisting familiar visuals into something new, and building a style that’s uniquely ours."
  }
]

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="min-h-screen bg-[#fafafa] px-6 pt-24 md:pt-40 pb-20 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-20 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#ff3366]/10 rounded-full blur-[100px] -z-10"
          />
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl md:text-6xl font-black text-black tracking-tighter leading-none"
          >
            YOU <span className="text-[#ff3366]">ASKED.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-6 text-lg md:text-xl text-gray-500 font-medium uppercase tracking-wide"
          >
            Everything you need to know
          </motion.p>
        </div>

        {/* FAQ LIST */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`bg-white border transition-colors duration-300 rounded-[2rem] overflow-hidden shadow-lg ${
                  isOpen ? "border-[#ff3366]/30 shadow-[#ff3366]/5" : "border-gray-100 shadow-gray-200/50"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 md:px-8 py-5 md:py-8 flex justify-between items-center text-left group"
                >
                  <span className={`text-base md:text-xl font-black tracking-tight pr-6 md:pr-8 transition-colors ${
                    isOpen ? "text-[#ff3366]" : "text-black group-hover:text-[#ff3366]"
                  }`}>
                    {faq.question}
                  </span>
                  
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    isOpen ? "bg-[#ff3366] text-white" : "bg-gray-100 text-black group-hover:bg-[#ff3366] group-hover:text-white"
                  }`}>
                    {isOpen ? <Minus size={20} strokeWidth={3} /> : <Plus size={20} strokeWidth={3} />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 md:px-8 pb-6 md:pb-8 text-gray-600 font-medium leading-relaxed text-sm md:text-base whitespace-pre-line">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
