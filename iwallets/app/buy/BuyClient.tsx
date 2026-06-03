"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart } from "@/lib/cartActions";
import { toggleWishlist } from "@/lib/wishlistActions";
import toast from "react-hot-toast";
import { Heart, ArrowLeft, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";

import Image from "next/image";

function BuyClientContent({ products = [], wishlist = [] }: any) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const searchParams = useSearchParams();
  const productSlug = searchParams.get("product");

  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ name: "", text: "", stars: 5 });
  const [showTopReviewForm, setShowTopReviewForm] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const data = await res.json();
          setReviews(data);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.name && newReview.text) {
      try {
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newReview),
        });

        if (res.ok) {
          const addedReview = await res.json();
          setReviews([addedReview, ...reviews]);
          setNewReview({ name: "", text: "", stars: 5 });
          setShowTopReviewForm(false);
          toast.success("Review submitted successfully!");
        } else {
          toast.error("Failed to submit review.");
        }
      } catch (error) {
        console.error("Failed to submit review:", error);
        toast.error("An error occurred.");
      }
    }
  };

  const averageRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.stars, 0) / reviews.length).toFixed(1) : "5.0";
  const totalReviews = reviews.length;

  const handleAddToCart = async (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    await addToCart(slug);
    toast.success("Successfully added to cart");
  };

  const handleBuyNow = async (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    await addToCart(slug);
    window.location.href = "/cart";
  };

  useEffect(() => {
    if (productSlug && products) {
      const product = products.find((p: any) => p.slug?.current === productSlug);
      if (product) setSelectedProduct(product);
    }
  }, [productSlug, products]);

  useEffect(() => {
    // Scroll to top when product is selected
    if (selectedProduct) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
        "/Iwallet - Images/Prod image- desk -White/3-white.jpg",
        // "/Iwallet - Images/Prod image- desk -White/4-white.jpg",
        "/Iwallet - Images/Prod image- desk -White/5-white(1).jpg",
        // "/Iwallet - Images/Prod image- desk -White/5-white.jpg",
        "/Iwallet - Images/Prod image- desk -White/6-white.jpg",
        "/Iwallet - Images/Prod image- desk -White/1-white.jpg",
        "/Iwallet - Images/White with box_.png"
      ],
      mobile: [
        "/Iwallet - Images/Prod image- mob-white/2-white.jpg",
        "/Iwallet - Images/Prod image- mob-white/3-white.jpg",
        "/Iwallet - Images/Prod image- mob-white/4-white.jpg",
        // "/Iwallet - Images/Prod image- mob-white/5-white.jpg",
        "/Iwallet - Images/Prod image- mob-white/1-white.jpg",
        "/Iwallet - Images/White with box_.png"
      ]
    },
    "Premium iWallet – Black": {
      desktop: [
        "/Iwallet - Images/Prod image- desk-Black/2-Black.jpg",
        "/Iwallet - Images/Prod image- desk-Black/3-Black.jpg",
        // "/Iwallet - Images/Prod image- desk-Black/4-black.jpg",
        "/Iwallet - Images/Prod image- desk-Black/5-black.jpg",
        // "/Iwallet - Images/Prod image- desk-Black/6-black.jpg",
        "/Iwallet - Images/Prod image- desk-Black/1-Black.jpg",
        "/Iwallet - Images/Black wit box.png"
      ],
      mobile: [
        "/Iwallet - Images/Prod image- mob-Black/2-Black.jpg",
        "/Iwallet - Images/Prod image- mob-Black/3-Black.jpg",
        // "/Iwallet - Images/Prod image- mob-Black/4-black.jpg",
        "/Iwallet - Images/Prod image- mob-Black/5-black.jpg",
        // "/Iwallet - Images/Prod image- mob-Black/6-black.jpg",
        "/Iwallet - Images/Prod image- mob-Black/1-Black.jpg",
        "/Iwallet - Images/Black wit box.png"
      ]
    },
    "Premium iWallet – Space Grey": {
      desktop: [
        "/Iwallet - Images/Prod image-desk-grey/4.png",
        "/Iwallet - Images/Prod image-desk-grey/1.png",
        "/Iwallet - Images/Prod image-desk-grey/2.png",
        "/Iwallet - Images/Prod image-desk-grey/3.png",
        "/Iwallet - Images/Grey with box_.png"     
      ],
      mobile: [
        "/Iwallet - Images/Prod images- grey- mob/4.png",
        "/Iwallet - Images/Prod images- grey- mob/1.png",
        "/Iwallet - Images/Prod images- grey- mob/2.png",
        "/Iwallet - Images/Prod images- grey- mob/3.png",
        "/Iwallet - Images/Grey with box_.png"
      ]
    }
  };

  const getProductMedia = (product: any) => {
    let desktopImgs: string[] = [];
    let mobileImgs: string[] = [];

    if (productImages[product.title]) {
      desktopImgs = productImages[product.title].desktop || [];
      mobileImgs = productImages[product.title].mobile || [];
    } else {
      const imgs = product.images && product.images.length > 0
        ? product.images
        : (product.imageUrl ? [product.imageUrl] : []);
      desktopImgs = imgs;
      mobileImgs = imgs;
    }

    const mediaList = desktopImgs.map((img: string, i: number) => ({
      type: "image",
      desktop: img,
      mobile: mobileImgs[i] || img
    }));

    if (product.videoUrl) {
      mediaList.push({
        type: "video",
        desktop: product.videoUrl,
        mobile: product.videoUrl
      });
    }

    return mediaList;
  };

  return (
    <section className="min-h-screen bg-[#fafafa] pt-28 md:pt-40 pb-16 px-4 md:px-8 flex flex-col">

      <AnimatePresence mode="wait">
        {!selectedProduct ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto w-full"
          >

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
              <div className="relative bg-gray-50 aspect-square overflow-hidden">
                <div className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar w-full relative group/scroll">
                  {getProductMedia(product).map((media: any, i: number) => {
                    return (
                      <div key={i} className="min-w-full h-full relative flex items-center justify-center snap-center shrink-0 group">
                        {media.type === "video" ? (
                          <video
                            src={media.desktop}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="object-cover w-full h-full relative z-10"
                          />
                        ) : (
                          <>
                            {/* Desktop Image */}
                            <Image
                              src={media.desktop}
                              className="object-cover transform group-hover:scale-105 transition-transform duration-700 relative z-10 hidden md:block"
                              alt={`${product.title} ${i + 1}`}
                              fill
                              unoptimized={true}
                              sizes="(max-width: 768px) 100vw, 33vw"
                              priority={idx < 4 && i === 0}
                            />
                            {/* Mobile Image */}
                            <Image
                              src={media.mobile}
                              className="object-cover transform group-hover:scale-105 transition-transform duration-700 relative z-10 block md:hidden"
                              alt={`${product.title} ${i + 1}`}
                              fill
                              unoptimized={true}
                              sizes="(max-width: 768px) 100vw, 33vw"
                              priority={idx < 4 && i === 0}
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Visual Cue for scroll */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                   {getProductMedia(product).map((_: any, i: number) => (
                     <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                   ))}
                </div>
              </div>

                <div className="p-3 md:p-8 pt-0 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
                       <span className="w-3 md:w-6 h-0.5 bg-rose-600 rounded-full" />
                       <p className="text-[8px] md:text-[9px] text-gray-400 uppercase font-black tracking-widest truncate">{product.collectionName}</p>
                    </div>
                    <h2 className="text-base md:text-xl font-bold md:font-black text-black tracking-tight leading-snug line-clamp-2 min-h-[40px] md:min-h-0">
                      {product.title}
                    </h2>
                    <div className="flex items-center gap-1 mt-1 md:mt-2 bg-gray-50/80 w-fit px-2 py-1 rounded-full border border-gray-100">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={12} className={star <= Math.round(Number(averageRating)) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                        ))}
                      </div>
                      <span className="text-[10px] md:text-xs font-black text-black ml-1">{averageRating} ({totalReviews})</span>
                    </div>
                  </div>

                  <div className="mt-2 md:mt-6 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                       <div className="flex items-baseline gap-2">
                          <span className="text-lg md:text-3xl font-black text-[#ff3366] tracking-tighter">
                            ₹{(product.price || 1599) - 200}
                          </span>
                          <span className="text-xs md:text-sm font-black text-gray-400 line-through tracking-tighter">
                            ₹{product.price || 1599}
                          </span>
                        </div>
                        <span className="text-[8px] md:text-[9px] font-black text-[#ff3366] uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-full w-fit animate-pulse">🔥 ₹999 WITH COUPON</span>
                    </div>
                    
                    <div className="w-6 h-6 md:w-10 md:h-10 bg-black rounded-full flex items-center justify-center text-white group-hover:bg-rose-600 transition-colors shadow-lg shrink-0">
                       <span className="text-[10px] md:text-lg leading-none">+</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>
        ) : (
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full max-w-5xl mx-auto"
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="mt-4 md:mt-0 mb-6 md:mb-8 inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-black hover:shadow-md hover:border-gray-300 transition-all font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs transform hover:-translate-y-0.5"
            >
              <ArrowLeft size={14} strokeWidth={2.5} />
              Back to Products
            </button>
            <div className="bg-white rounded-3xl md:rounded-[3rem] w-full shadow-2xl overflow-hidden">

                <div className="grid grid-cols-1 lg:grid-cols-2">
                   {/* Product Image Panel */}
                   <div className="bg-gray-50 relative min-h-[360px] md:min-h-[460px] flex items-center overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-600/10 to-transparent" />
                      
                      <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar w-full h-full relative z-10 group/scroll items-center">
                        {getProductMedia(selectedProduct).map((media: any, i: number) => {
                          return (
                            <div key={i} className="min-w-full h-full p-0 md:p-8 relative flex items-center justify-center snap-center shrink-0">
                              <div className="w-full max-w-[360px] md:max-w-lg h-80 md:h-[400px] relative flex items-center justify-center">
                                {media.type === "video" ? (
                                  <video
                                    src={media.desktop}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    controls
                                    className="object-contain w-full h-full rounded-2xl"
                                  />
                                ) : (
                                  <>
                                    {/* Desktop Image */}
                                    <Image
                                      src={media.desktop}
                                      className="object-contain hidden md:block"
                                      alt={`${selectedProduct.title} ${i + 1}`}
                                      fill
                                      unoptimized={true}
                                      sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    {/* Mobile Image */}
                                    <Image
                                      src={media.mobile}
                                      className="object-contain block md:hidden"
                                      alt={`${selectedProduct.title} ${i + 1}`}
                                      fill
                                      unoptimized={true}
                                      sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Visual Cue for scroll */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                         {getProductMedia(selectedProduct).map((_: any, i: number) => (
                           <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                         ))}
                      </div>
                   </div>

                 {/* Content Panel */}
                 <div className="p-4 pt-0 md:p-8 md:py-6 flex flex-col justify-center mt-2 md:mt-0">
                    <span className="text-[#ff3366] font-black tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] uppercase mb-0.5 md:mb-2">{selectedProduct.brand || "theCarryClub Premium"}</span>
                    <h2 className="text-2xl md:text-4xl font-black text-black tracking-tighter leading-[1.1] md:leading-none mb-2 md:mb-3">
                      {selectedProduct.title}
                    </h2>

                    {/* Average Rating & Review Action */}
                    <div className="flex items-center gap-2 mb-4 md:mb-6 bg-gray-50 w-fit px-3 py-2 rounded-full border border-gray-100 shadow-sm">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={18} className={star <= Math.round(Number(averageRating)) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                        ))}
                      </div>
                      <span className="text-sm font-black text-black ml-1">{averageRating} ({totalReviews} Reviews)</span>
                      <div className="w-px h-4 bg-gray-300 mx-2"></div>
                      <button 
                        onClick={() => setShowTopReviewForm(!showTopReviewForm)}
                        className="text-[10px] md:text-xs font-black text-[#ff3366] hover:text-black uppercase tracking-widest transition-colors"
                      >
                        {showTopReviewForm ? "Cancel" : "Write Review"}
                      </button>
                    </div>

                    <AnimatePresence>
                      {showTopReviewForm && (
                        <motion.form 
                          initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          animate={{ opacity: 1, height: "auto", overflow: 'visible' }}
                          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          onSubmit={handleReviewSubmit}
                          className="bg-white p-4 rounded-2xl border border-gray-100 shadow-lg mb-4"
                        >
                          <div className="mb-3">
                            <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wider">Name</label>
                            <input 
                              type="text" 
                              required
                              value={newReview.name}
                              onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-xs transition-shadow"
                              placeholder="Your Name"
                            />
                          </div>
                          <div className="mb-3">
                            <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wider">Rating</label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button 
                                  key={star} 
                                  type="button"
                                  onClick={() => setNewReview({...newReview, stars: star})}
                                  className="focus:outline-none"
                                >
                                  <Star 
                                    size={20} 
                                    className={`transition-colors ${star <= newReview.stars ? "fill-black text-black" : "text-gray-200 hover:text-gray-400"}`} 
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="block text-[10px] font-bold text-gray-700 mb-1 uppercase tracking-wider">Review</label>
                            <textarea 
                              required
                              value={newReview.text}
                              onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black h-20 resize-none text-xs transition-shadow"
                              placeholder="Share your experience..."
                            />
                          </div>
                          <button 
                            type="submit"
                            className="w-full bg-black text-white py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md"
                          >
                            Submit Review
                          </button>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {((selectedProduct.quote) || (selectedProduct.subQuote)) ? (
                      <div className="space-y-1 md:space-y-2 mb-2 md:mb-4">
                         {selectedProduct.quote && (
                           <p className="text-sm md:text-base font-black text-gray-900 leading-snug">
                             "{selectedProduct.quote}"
                           </p>
                         )}
                         {selectedProduct.subQuote && (
                           <p className="text-[9px] md:text-xs font-bold text-gray-400 italic">
                             "{selectedProduct.subQuote}"
                           </p>
                         )}
                      </div>
                    ) : (
                      <div className="space-y-1 md:space-y-2 mb-2 md:mb-4">
                         <p className="text-sm md:text-base font-black text-gray-900 leading-snug">
                           "We really took the Apple Wallet App Logo and brought it to life!"
                         </p>
                         {/* <p className="text-[9px] md:text-xs font-bold text-gray-400 italic">
                           "Not an official apple product, obviously... "
                         </p> */}
                      </div>
                    )}

                    {(() => {
                      const tagline = selectedProduct.tagline || descriptions[selectedProduct.title]?.tagline;
                      const bullets = (selectedProduct.bullets && selectedProduct.bullets.length > 0)
                        ? selectedProduct.bullets
                        : (descriptions[selectedProduct.title]?.bullets || []);
                      
                      if (!tagline && bullets.length === 0) return null;
                      return (
                        <div className="space-y-2 md:space-y-4">
                          {tagline && <p className="text-xs md:text-sm font-bold text-gray-600 leading-snug">{tagline}</p>}
                          {bullets.length > 0 && (
                            <ul className="space-y-1 md:space-y-2">
                              {bullets.map((b: string, i: number) => (
                                <li key={i} className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs font-medium text-gray-500">
                                  <span className="w-1.5 h-1.5 bg-[#ff3366] rounded-full" />
                                  {b}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })()}

                    <div className="mt-3 md:mt-6 flex flex-col gap-2 md:gap-4">
                       <div className="flex flex-col gap-2">
                          <div className="flex items-baseline gap-4">
                             <span className="text-3xl md:text-5xl font-black tracking-tighter text-[#ff3366]">₹{(selectedProduct.price || 1599) - 200}</span>
                             <span className="text-xl md:text-3xl font-black tracking-tighter text-gray-400 line-through">₹{selectedProduct.price || 1599}</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="bg-rose-50 border border-rose-100 text-[#ff3366] text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm animate-pulse">🔥 ₹999 WITH COUPON</span>
                          </div>
                       </div>

                        <div className="flex gap-3 md:gap-4 w-full">
                          <form className="flex-1">
                            <button onClick={(e) => handleAddToCart(e, selectedProduct.slug?.current)} className="w-full py-2.5 md:py-3.5 bg-rose-600 text-white font-black text-xs md:text-base rounded-full hover:bg-black transition-all duration-300 shadow-xl shadow-rose-500/20 transform hover:-translate-y-0.5 tracking-widest uppercase text-center">
                              ADD TO CART
                            </button>
                          </form>
                          <form className="flex-1">
                            <button onClick={(e) => handleBuyNow(e, selectedProduct.slug?.current)} className="w-full py-2.5 md:py-3.5 bg-black text-white font-black text-xs md:text-base rounded-full hover:bg-rose-600 transition-all duration-300 shadow-xl shadow-gray-200/50 transform hover:-translate-y-0.5 tracking-widest uppercase text-center">
                              BUY NOW
                            </button>
                          </form>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
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