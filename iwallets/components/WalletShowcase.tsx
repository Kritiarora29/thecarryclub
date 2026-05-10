"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const images = [
  "/space_grey_wallet.png",
  "/white_wallet.png",
  "/black_wallet.jpeg",
]

export default function WalletShowcase() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-32 bg-white flex justify-center px-6 overflow-hidden">
      <div className="relative w-full max-w-xl h-[360px] overflow-hidden">

        <AnimatePresence initial={false}>
          <motion.img
            key={index}
            src={images[index]}
            alt="iWallet"
            className="absolute inset-0 w-full h-full object-contain"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              duration: 0.8,
            }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 25px 60px rgba(0,0,0,0.25)",
            }}
          />
        </AnimatePresence>

      </div>
    </section>
  )
}
