"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart } from "@/lib/cartActions";

import Image from "next/image";

export default function BuyClient({ products }: any) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (selectedProduct) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [selectedProduct]);

  const descriptions: any = {
    "Premium iWallet – White": {
      intro: "Introducing the Premium iWallet – White",
      tagline: "A clean, minimal finish for the modern professional.",
      bullets: ["Premium Vegan Leather", "Ultra-slim Profile", "Embossed CarryClub Logo", "Holds 6–8 Cards"],
    },
    "Premium iWallet – Black": {
      intro: "Introducing the Premium iWallet – Black",
      tagline: "Bold. Matte. Timeless. Redefining your everyday carry.",
      bullets: ["Premium Vegan Leather", "Matte Stealth Finish", "Embossed CarryClub Logo", "Holds 6–8 Cards"],
    },
    "Premium iWallet – Space Grey": {
      intro: "Introducing the Premium iWallet – Space Grey",
      tagline: "Inspired by modern tech. Engineered for real life.",
      bullets: ["Premium Vegan Leather", "Tech-inspired Texture", "Reinforced Core", "Holds 6–8 Cards"],
    },
  };

  return (
    <section className="min-h-screen bg-[#fafafa] pt-28 md:pt-40 pb-16 px-4 md:px-8 flex flex-col">

      <div className="max-w-7xl mx-auto w-full">

        <div className="text-center mb-10 md:mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-black tracking-tighter leading-none"
          >
            Select Your <span className="text-[#ff3366]">Style.</span>
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-gray-500 mt-4 md:mt-6 text-sm md:text-xl font-medium tracking-wide uppercase"
          >
            Minimal • Premium • Engineered to Carry
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-8 max-w-7xl mx-auto">

          {products?.map((product: any, idx: number) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedProduct(product)}
              className="group bg-white rounded-2xl md:rounded-[2.5rem] shadow-xl shadow-gray-200/50 cursor-pointer overflow-hidden border border-gray-100 flex flex-col h-full relative"
            >
              <div className="p-2 md:p-6 aspect-square relative overflow-hidden bg-gray-50 flex items-center justify-center">
                  <Image
                    src={product.imageUrl}
                    className="object-contain transform group-hover:scale-110 transition-transform duration-700 relative z-10"
                    alt={product.title}
                    fill
                    unoptimized={true}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={idx < 4}
                  />
                </div>

                <div className="p-3 md:p-8 pt-0 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                       <span className="w-3 md:w-6 h-0.5 bg-[#ff3366] rounded-full" />
                       <p className="text-[8px] md:text-[9px] text-gray-400 uppercase font-black tracking-widest truncate">Collection 01</p>
                    </div>
                    <h2 className="text-base md:text-xl font-bold md:font-black text-black tracking-tight leading-snug line-clamp-2 min-h-[40px] md:min-h-0">
                      {product.title}
                    </h2>
                  </div>

                  <div className="mt-2 md:mt-6 flex items-center justify-between">
                    <div className="flex flex-col">
                       <span className="text-xs md:text-2xl font-black text-black tracking-tighter">
                        ₹1599
                      </span>
                    </div>
                    
                    <div className="w-6 h-6 md:w-10 md:h-10 bg-black rounded-full flex items-center justify-center text-white group-hover:bg-[#ff3366] transition-colors shadow-lg shrink-0">
                       <span className="text-[10px] md:text-lg leading-none">+</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        <AnimatePresence>
          {selectedProduct && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-6 z-[100]"
              onClick={() => setSelectedProduct(null)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="bg-white rounded-t-3xl md:rounded-[3rem] w-full max-w-4xl max-h-[95vh] overflow-y-auto relative shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute right-3 top-3 md:right-8 md:top-8 text-black bg-gray-100/80 backdrop-blur-md hover:bg-rose-500 hover:text-white transition-all rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center z-[60] font-bold shadow-lg"
                  onClick={() => setSelectedProduct(null)}
                >✕</button>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                   {/* Product Image Panel */}
                   <div className="bg-gray-50 py-4 px-2 md:p-16 flex items-center justify-center relative min-h-[160px] md:min-h-[300px]">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#ff3366]/10 to-transparent" />
                      <div className="w-full max-w-[200px] md:max-w-sm h-32 md:h-64 relative z-10">
                        <Image
                          src={selectedProduct.imageUrl}
                          className="object-contain"
                          alt={selectedProduct.title}
                          fill
                          unoptimized={true}
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                   </div>

                 {/* Content Panel */}
                 <div className="p-4 pt-0 md:p-16 flex flex-col justify-center mt-2 md:mt-0">
                    <span className="text-[#ff3366] font-black tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] uppercase mb-1 md:mb-4">theCarryClub Premium</span>
                    <h2 className="text-2xl md:text-5xl font-black text-black tracking-tighter leading-[1.1] md:leading-none mb-3 md:mb-6">
                      {selectedProduct.title}
                    </h2>

                    <div className="space-y-1.5 md:space-y-4 mb-4 md:mb-8">
                       <p className="text-sm md:text-lg font-black text-gray-900 leading-snug">
                         "We really took the Apple Wallet App Logo and brought it to life!"
                       </p>
                       <p className="text-[9px] md:text-xs font-bold text-gray-400 italic">
                         "Not an official apple product, obviously... "
                       </p>
                    </div>

                    {(() => {
                      const d = descriptions[selectedProduct.title];
                      if (!d) return null;
                      return (
                        <div className="space-y-3 md:space-y-6">
                          <p className="text-xs md:text-base font-bold text-gray-600 leading-snug">{d.tagline}</p>
                          <ul className="space-y-1.5 md:space-y-3">
                            {d.bullets.map((b: string, i: number) => (
                              <li key={i} className="flex items-center gap-2 md:gap-3 text-[10px] md:text-sm font-medium text-gray-500">
                                <span className="w-1.5 h-1.5 bg-[#ff3366] rounded-full" />
                                {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })()}

                    <div className="mt-4 md:mt-12 flex flex-col gap-2 md:gap-6">
                       <div className="flex items-baseline gap-3">
                          <span className="text-lg md:text-4xl font-black tracking-tighter text-black">₹1599</span>
                       </div>

                       <form
                        action={addToCart.bind(null, selectedProduct.slug?.current)}
                        className="w-full"
                      >
                        <button className="w-full py-2 md:py-5 bg-[#ff3366] text-white font-black text-xs md:text-xl rounded-full hover:bg-black transition-all duration-300 shadow-xl shadow-rose-500/20 transform hover:-translate-y-1 tracking-widest">
                          ADD TO CART
                        </button>
                      </form>
                    </div>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}