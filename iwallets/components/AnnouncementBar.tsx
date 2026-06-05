"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

const messages = [
  { text: "⚡ FLASH SALE IS LIVE! GET ₹600 OFF", highlight: "₹600 OFF" },
  { text: "🔥 LIMITED TIME OFFER — USE CODE: IWALLETS600", highlight: "IWALLETS600" },
  { text: "✨ UPGRADE YOUR CARRY. SHOP NOW.", highlight: "SHOP NOW" }
]

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-black text-white h-10 md:h-12 overflow-hidden relative border-b border-white/5">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex items-center gap-3 text-center"
          >
            <p className="text-[10px] md:text-sm font-bold tracking-[0.1em] uppercase">
              {messages[index].text.split(messages[index].highlight)[0]}
              <span className="text-[#B45309]">{messages[index].highlight}</span>
              {messages[index].text.split(messages[index].highlight)[1]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle background glow that follows the theme */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#B45309]/5 to-transparent pointer-events-none" />
    </div>
  )
}
