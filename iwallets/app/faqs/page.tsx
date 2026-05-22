"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "What is iWallet?",
    answer: "iWallet is a minimal, premium wallet designed for everyday use. It combines durability, clean design, and practicality."
  },
  {
    question: "What materials are used in iWallet?",
    answer: "iWallet is made from high-quality premium vegan leather with reinforced stitching for long-lasting use."
  },
  {
    question: "Do you ship across India?",
    answer: "Yes, we ship across all major cities and towns in India with premium courier partners."
  },
  {
    question: "How long does delivery take?",
    answer: "Orders are usually delivered within 5-7 business days, depending on your location."
  },
  {
    question: "Can I return or replace my iWallet?",
    answer: "ALL SALES ARE FINAL!\nAll items are inspected for quality before shipping out. If anything is wrong with the item feel free to email info@thecarryclub.in with your order within 5 days. Due to limited releases, most sales are final, unless the item is defective."
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
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="min-h-screen bg-[#fafafa] pt-32 md:pt-48 pb-20 overflow-hidden font-sans">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Hero Section */}
        <div className="text-center mb-24 md:mb-40 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -z-10"
          />
          
          <p className="text-blue-600 font-black tracking-[0.3em] text-[10px] md:text-sm uppercase mb-6">Support Center</p>
          <h1 className="text-6xl md:text-[120px] font-black text-black leading-[0.85] tracking-tighter mb-10">
            Got <br /> 
            <span className="text-blue-600">Questions?</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-2xl max-w-2xl mx-auto font-medium">
            Everything you need to know about theCarryClub products and services.
          </p>
        </div>

        {/* FAQ LIST */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden transition-all duration-500 border-2 ${
                  isOpen ? "border-blue-600 shadow-2xl shadow-blue-600/10" : "border-gray-50 shadow-xl shadow-gray-200/50 hover:border-blue-100"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-8 md:px-12 py-8 md:py-10 flex justify-between items-center text-left"
                >
                  <span className={`text-xl md:text-2xl font-black tracking-tight pr-8 transition-colors duration-300 ${
                    isOpen ? "text-blue-600" : "text-black group-hover:text-blue-600"
                  }`}>
                    {faq.question}
                  </span>
                  
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                    isOpen ? "bg-blue-600 text-white rotate-180 shadow-lg" : "bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600"
                  }`}>
                    {isOpen ? <Minus size={24} strokeWidth={3} /> : <Plus size={24} strokeWidth={3} />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "circOut" }}
                    >
                      <div className="px-8 md:px-12 pb-10 md:pb-12 text-gray-500 font-medium leading-relaxed text-base md:text-lg whitespace-pre-line border-t border-gray-50 pt-8">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {/* Still Need Help */}
        <div className="mt-32 md:mt-48 text-center bg-white rounded-[3rem] p-10 md:p-20 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[80px]" />
           <HelpCircle className="w-16 h-16 text-blue-600 mx-auto mb-8" strokeWidth={1} />
           <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6">Still Need Help?</h2>
           <p className="text-gray-400 font-medium text-lg mb-10">Our team is here to assist you with anything you need.</p>
           <a href="mailto:info@thecarryclub.in" className="inline-block bg-black text-white px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl shadow-blue-600/10 transform hover:-translate-y-1">
             Contact Support
           </a>
        </div>
      </div>
    </section>
  )
}
