"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart } from "@/lib/cartActions";
import { toggleWishlist } from "@/lib/wishlistActions";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";
import { useSearchParams } from "next/navigation";

import Image from "next/image";

function BuyClientContent({ products = [], wishlist = [] }: any) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  const handleAddToCart = async (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    await addToCart(slug);
    toast.success("Successfully added to cart");
  };

  useEffect(() => {
    if (productSlug && products) {
      const product = products.find((p: any) => p.slug?.current === productSlug);
      if (product) setSelectedProduct(product);
    }
  }, [productSlug, products]);

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

  const productImages: any = {
    "Premium iWallet – White": {
      desktop: [
        "/Iwallet - Images/Prod image- desk -White/1-white.jpg",
        "/Iwallet - Images/Prod image- desk -White/3-white.jpg",
        "/Iwallet - Images/Prod image- desk -White/4-white.jpg",
        "/Iwallet - Images/Prod image- desk -White/5-white(1).jpg",
        "/Iwallet - Images/Prod image- desk -White/5-white.jpg",
        "/Iwallet - Images/Prod image- desk -White/6-white.jpg"
      ],
      mobile: [
        "/Iwallet - Images/Prod image- mob-white/1-white.jpg",
        "/Iwallet - Images/Prod image- mob-white/2-white.jpg",
        "/Iwallet - Images/Prod image- mob-white/3-white.jpg",
        "/Iwallet - Images/Prod image- mob-white/4-white.jpg",
        "/Iwallet - Images/Prod image- mob-white/5-white.jpg"
      ]
    },
    "Premium iWallet – Black": {
      desktop: [
        "/Iwallet - Images/Prod image- desk-Black/1-Black.jpg",
        "/Iwallet - Images/Prod image- desk-Black/2-Black.jpg",
        "/Iwallet - Images/Prod image- desk-Black/3-Black.jpg",
        "/Iwallet - Images/Prod image- desk-Black/4-black.jpg",
        "/Iwallet - Images/Prod image- desk-Black/5-black.jpg",
        "/Iwallet - Images/Prod image- desk-Black/6-black.jpg"
      ],
      mobile: [
        "/Iwallet - Images/Prod image- mob-Black/1-Black.jpg",
        "/Iwallet - Images/Prod image- mob-Black/2-Black.jpg",
        "/Iwallet - Images/Prod image- mob-Black/3-Black.jpg",
        "/Iwallet - Images/Prod image- mob-Black/4-black.jpg",
        "/Iwallet - Images/Prod image- mob-Black/5-black.jpg",
        "/Iwallet - Images/Prod image- mob-Black/6-black.jpg"
      ]
    },
    "Premium iWallet – Space Grey": {
      desktop: [
        "/Iwallet - Images/Prod image-desk-grey/1.png",
        "/Iwallet - Images/Prod image-desk-grey/2.png",
        "/Iwallet - Images/Prod image-desk-grey/3.png",
        "/Iwallet - Images/Prod image-desk-grey/4.png"
      ],
      mobile: [
        "/Iwallet - Images/Prod images- grey- mob/1.png",
        "/Iwallet - Images/Prod images- grey- mob/2.png",
        "/Iwallet - Images/Prod images- grey- mob/3.png",
        "/Iwallet - Images/Prod images- grey- mob/4.png"
      ]
    }
  };

  return (
    <section className="min-h-screen bg-[#fafafa] pt-28 md:pt-40 pb-16 px-4 md:px-8 flex flex-col">

      <div className="max-w-7xl mx-auto w-full">

        <div className="text-center mb-10 md:mb-16">
            <h1 className="text-5xl md:text-8xl font-extrabold text-black tracking-tighter leading-none mb-6">
              Select Your <span className="text-rose-600">Style.</span>
            </h1>
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
              {/* WISHLIST BUTTON */}
              <div className="absolute top-3 right-3 md:top-6 md:right-6 z-20">
                <form action={toggleWishlist.bind(null, product.slug?.current)}>
                  <button 
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 md:p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-rose-600 group/heart transition-all duration-300"
                  >
                    <Heart 
                      size={16} 
                      className={`${wishlist.some((w: any) => w.slug === product.slug?.current) ? "fill-rose-600 stroke-rose-600" : "text-gray-400"} group-hover/heart:text-white group-hover/heart:fill-white transition-colors`} 
                      strokeWidth={3} 
                    />
                  </button>
                </form>
              </div>

              {/* IMAGE SCROLL CONTAINER */}
              <div className="p-2 md:p-6 relative bg-gray-50">
                <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full relative group/scroll">
                  {(productImages[product.title]?.desktop || []).map((desktopImg: string, i: number) => {
                    const mobileArr = productImages[product.title]?.mobile || [];
                    const mobileImg = mobileArr[i] || desktopImg;
                    return (
                      <div key={i} className="min-w-full aspect-square relative flex items-center justify-center snap-center shrink-0 group">
                        {/* Desktop Image */}
                        <Image
                          src={desktopImg}
                          className="object-contain transform group-hover:scale-105 transition-transform duration-700 relative z-10 hidden md:block"
                          alt={`${product.title} ${i + 1}`}
                          fill
                          unoptimized={true}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={idx < 4 && i === 0}
                        />
                        {/* Mobile Image */}
                        <Image
                          src={mobileImg}
                          className="object-contain transform group-hover:scale-105 transition-transform duration-700 relative z-10 block md:hidden"
                          alt={`${product.title} ${i + 1}`}
                          fill
                          unoptimized={true}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={idx < 4 && i === 0}
                        />
                      </div>
                    );
                  })}
                </div>
                {/* Visual Cue for scroll */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                   {(productImages[product.title]?.desktop || []).map((_: any, i: number) => (
                     <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                   ))}
                </div>
              </div>

                <div className="p-3 md:p-8 pt-0 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                       <span className="w-3 md:w-6 h-0.5 bg-rose-600 rounded-full" />
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
                    
                    <div className="w-6 h-6 md:w-10 md:h-10 bg-black rounded-full flex items-center justify-center text-white group-hover:bg-rose-600 transition-colors shadow-lg shrink-0">
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
                   <div className="bg-gray-50 relative min-h-[250px] md:min-h-[500px] flex items-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-600/10 to-transparent" />
                      
                      <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-full relative z-10 group/scroll items-center">
                        {(productImages[selectedProduct.title]?.desktop || []).map((desktopImg: string, i: number) => {
                          const mobileArr = productImages[selectedProduct.title]?.mobile || [];
                          const mobileImg = mobileArr[i] || desktopImg;
                          return (
                            <div key={i} className="min-w-full h-full p-8 md:p-16 relative flex items-center justify-center snap-center shrink-0">
                              <div className="w-full max-w-[250px] md:max-w-sm h-48 md:h-[400px] relative">
                                {/* Desktop Image */}
                                <Image
                                  src={desktopImg}
                                  className="object-contain hidden md:block"
                                  alt={`${selectedProduct.title} ${i + 1}`}
                                  fill
                                  unoptimized={true}
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                {/* Mobile Image */}
                                <Image
                                  src={mobileImg}
                                  className="object-contain block md:hidden"
                                  alt={`${selectedProduct.title} ${i + 1}`}
                                  fill
                                  unoptimized={true}
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Visual Cue for scroll */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                         {(productImages[selectedProduct.title]?.desktop || []).map((_: any, i: number) => (
                           <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                         ))}
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

                       <form className="w-full">
                         <button onClick={(e) => handleAddToCart(e, selectedProduct.slug?.current)} className="w-full py-2 md:py-5 bg-rose-600 text-white font-black text-xs md:text-xl rounded-full hover:bg-black transition-all duration-300 shadow-xl shadow-rose-500/20 transform hover:-translate-y-1 tracking-widest uppercase">
                          ADD TO CART
                        </button>
                      </form>

                      <form action={toggleWishlist.bind(null, selectedProduct.slug?.current)}>
                        <button className="w-full py-2 md:py-4 border-2 border-gray-100 text-black font-black text-[10px] md:text-sm rounded-full hover:bg-gray-50 transition-all flex items-center justify-center gap-2 tracking-widest uppercase">
                          <Heart size={16} className={wishlist.some((w: any) => w.slug === selectedProduct.slug?.current) ? "fill-rose-600 stroke-rose-600" : ""} />
                          {wishlist.some((w: any) => w.slug === selectedProduct.slug?.current) ? "In Wishlist" : "Add to Wishlist"}
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

export default function BuyClient(props: any) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuyClientContent {...props} />
    </Suspense>
  );
}