"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export default function ProductView({ product }: any) {
  if (!product || !product.colors || product.colors.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading product…</p>
      </div>
    )
  }

  const [color, setColor] = useState(product.colors[0])

  return (
    <section className="min-h-screen flex items-center justify-center px-8">
      <div className="grid md:grid-cols-2 gap-16 max-w-6xl w-full">

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-neutral-900 rounded-xl h-[400px]"
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-semibold">
            {product.title}
          </h1>

          <p className="text-gray-400 mt-4">
            {product.description}
          </p>

          <div className="mt-6 flex items-baseline gap-4">
            <span className="text-xl font-bold text-amber-700">₹ 1399</span>
            <span className="text-lg line-through text-gray-500">₹ 1599</span>
          </div>
          <p className="text-sm font-bold text-amber-700 mt-2">🔥 ₹ 999 WITH COUPON</p>

          <div className="flex gap-4 mt-8">
            {product.colors.map((c: string) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`px-4 py-2 rounded-full border ${
                  color === c ? "border-white" : "border-white/30"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button className="mt-10 px-6 py-3 bg-white text-black rounded-full">
            Buy Now
          </button>
        </motion.div>
      </div>
    </section>
  )
}
