"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"

const walletImages = [
  { src: "/black_wallet.jpeg", alt: "iWallet Black – premium slim vegan leather wallet" },
  { src: "/space_grey_wallet.png", alt: "iWallet Space Grey – minimalist slim wallet" },
  { src: "/white_wallet.png", alt: "iWallet White – clean minimal slim wallet" },
]

export default function WalletModel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % walletImages.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-[300px] md:h-[450px] flex items-center justify-center">

      {/* Background Aura Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute w-64 h-64 bg-[#B45309] rounded-full blur-[100px] -z-10"
        aria-hidden="true"
      />

      {/* Floating Card Stack */}
      <div className="relative w-full max-w-[280px] md:max-w-[350px] aspect-[4/3]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 100, rotateY: 45, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, rotateY: -10, scale: 1 }}
            exit={{ opacity: 0, x: -100, rotateY: -45, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              opacity: { duration: 0.4 },
            }}
            style={{ perspective: 1000 }}
            className="absolute inset-0 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-6 flex items-center justify-center overflow-hidden group"
          >
            {/* Subtle inner reflection */}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"
              aria-hidden="true"
            />

            <div className="relative w-full h-full">
              <Image
                src={walletImages[index].src}
                alt={walletImages[index].alt}
                fill
                sizes="(max-width: 768px) 280px, 350px"
                className="object-contain drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Decorative Floating Elements */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-6 -right-4 md:-top-10 md:-right-10 w-16 h-16 md:w-20 md:h-20 bg-black rounded-[1rem] md:rounded-2xl shadow-xl flex items-center justify-center text-white font-black text-[10px] md:text-xs z-10"
          aria-hidden="true"
        >
          <p className="text-center px-1 md:px-2 leading-tight md:leading-normal">SLIM<br />ONLY</p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-8 w-12 h-12 md:w-16 md:h-16 bg-[#B45309] rounded-full shadow-lg flex items-center justify-center text-white z-10"
          aria-hidden="true"
        >
          <span className="text-lg md:text-xl" role="img" aria-label="sparkles">✨</span>
        </motion.div>
      </div>
    </div>
  )
}