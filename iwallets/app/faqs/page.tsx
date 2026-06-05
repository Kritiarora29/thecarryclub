"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus, HelpCircle } from "lucide-react"
import { PageShell, Eyebrow, Heading, Card, Button } from "@/components/ui/tcc"

const faqs = [
  { question: "What is iWallet?", answer: "iWallet is a minimal, premium wallet designed for everyday use. It combines durability, clean design, and practicality." },
  { question: "What materials are used in iWallet?", answer: "iWallet is made from high-quality premium vegan leather with reinforced stitching for long-lasting use." },
  { question: "Do you ship across India?", answer: "Yes, we ship across all major cities and towns in India with premium courier partners." },
  { question: "How long does delivery take?", answer: "Orders are usually delivered within 5-7 business days, depending on your location." },
  { question: "Can I return or replace my iWallet?", answer: "ALL SALES ARE FINAL!\nAll items are inspected for quality before shipping out. If anything is wrong with the item feel free to email info@thecarryclub.in with your order within 5 days. Due to limited releases, most sales are final, unless the item is defective." },
  { question: "How can I contact support?", answer: "You can reach us at info@thecarryclub.in for any queries or assistance." },
  { question: "Is this a real Apple product?", answer: "Carry Club is a fully in-house art and design studio. We've been creating boundary-pushing custom work that blends streetwear, luxury aesthetics, and original artistic direction.\nWe specialize in reimagining brand aesthetics, twisting familiar visuals into something new, and building a style that's uniquely ours." },
]

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <PageShell spacing="lg" className="overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">

        {/* Hero */}
        <div className="text-center mb-24 md:mb-40 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand/10 rounded-full blur-[120px] -z-10"
          />
          <Eyebrow className="mb-6">Support Center</Eyebrow>
          <Heading as="h1" className="text-6xl md:text-[120px] mb-10">
            Got <br /><span className="text-brand italic">Questions?</span>
          </Heading>
          <p className="text-muted-foreground text-lg md:text-2xl max-w-2xl mx-auto font-medium">
            Everything you need to know about theCarryClub products and services.
          </p>
        </div>

        {/* FAQ List */}
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
                className={`group bg-surface-card rounded-4xl md:rounded-[2.5rem] overflow-hidden transition-all duration-500 border-2 ${
                  isOpen ? "border-brand shadow-2xl shadow-brand/10" : "border-border shadow-xl hover:border-brand/30"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-8 md:px-12 py-8 md:py-10 flex justify-between items-center text-left"
                >
                  <span className={`text-xl md:text-2xl font-black tracking-tight pr-8 transition-colors duration-300 ${isOpen ? "text-brand" : "text-primary group-hover:text-brand"}`}>
                    {faq.question}
                  </span>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isOpen ? "bg-brand text-white rotate-180 shadow-lg" : "bg-muted text-muted-foreground group-hover:bg-brand/10 group-hover:text-brand"}`}>
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
                      <div className="px-8 md:px-12 pb-10 md:pb-12 text-muted-foreground font-medium leading-relaxed text-base md:text-lg whitespace-pre-line border-t border-border pt-8">
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
        <div className="mt-32 md:mt-48">
          <Card size="xl" className="text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-[80px]" />
            <HelpCircle className="w-16 h-16 text-brand mx-auto mb-8" strokeWidth={1} />
            <Heading as="h2" className="text-3xl md:text-5xl mb-6">Still Need Help?</Heading>
            <p className="text-muted-foreground font-medium text-lg mb-10">Our team is here to assist you with anything you need.</p>
            <Button href="mailto:info@thecarryclub.in" size="lg">Contact Support</Button>
          </Card>
        </div>

      </div>
    </PageShell>
  )
}
