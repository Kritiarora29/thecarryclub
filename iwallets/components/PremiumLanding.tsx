"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Leaf, 
  Zap, 
  ArrowRight, 
  Star, 
  Heart, 
  Minus, 
  Plus, 
  Shield, 
  Package, 
  RotateCcw,
  Instagram,
  Search,
  ShoppingCart,
  User,
  Heart as HeartIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { addToCart, buyItNow } from "@/lib/cartActions";
import { toggleWishlist } from "@/lib/wishlistActions";
import toast from "react-hot-toast";

export default function PremiumLanding({ products = [], wishlist = [] }: any) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ name: "", text: "", stars: 5 });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(6);

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
      } finally {
        setIsLoadingReviews(false);
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
          setShowReviewForm(false);
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

  const colors = [
    { id: "black", name: "Black", class: "bg-black", img: "/Iwallet - Images/Prod image- desk-Black/2-Black.jpg" },
    { id: "space-grey", name: "Space Grey", class: "bg-gray-600", img: "/Iwallet - Images/Prod image-desk-grey/2.png" },
    { id: "white", name: "White", class: "bg-white border border-gray-200", img: "/Iwallet - Images/Prod image- desk -White/3-white.jpg" },
  ];

  const productImagesByColor: Record<string, string[]> = {
    black: [
      "/Iwallet - Images/Prod image- desk-Black/2-Black.jpg",
      "/Iwallet - Images/Prod image- desk-Black/3-Black.jpg",
      "/Iwallet - Images/Prod image- desk-Black/4-black.jpg",
      "/Iwallet - Images/Prod image- desk-Black/5-black.jpg",
      "/Iwallet - Images/Prod image- desk-Black/6-black.jpg",
      "/Iwallet - Images/Black wit box.png",
      "/Iwallet - Images/Prod image- desk-Black/1-Black.jpg"
    ],
    "space-grey": [
      "/Iwallet - Images/Prod image-desk-grey/2.png",
      "/Iwallet - Images/Prod image-desk-grey/3.png",
      "/Iwallet - Images/Prod image-desk-grey/4.png",
      "/Iwallet - Images/Grey with box_.png",
      "/Iwallet - Images/Prod image-desk-grey/1.png"
    ],
    white: [
      "/Iwallet - Images/Prod image- desk -White/3-white.jpg",
      "/Iwallet - Images/Prod image- desk -White/4-white.jpg",
      "/Iwallet - Images/Prod image- desk -White/5-white(1).jpg",
      "/Iwallet - Images/Prod image- desk -White/5-white.jpg",
      "/Iwallet - Images/Prod image- desk -White/6-white.jpg",
      "/Iwallet - Images/White with box_.png",
      "/Iwallet - Images/Prod image- desk -White/1-white.jpg"
    ]
  };

  const lifestyleImages = [
    "/Iwallet - Images/Prod image- desk-Black/4-black.jpg",
    "/Iwallet - Images/Prod image- desk-Black/6-black.jpg",
    "/Iwallet - Images/Prod image- desk -White/5-white.jpg",
    "/Iwallet - Images/Prod image-desk-grey/3.png"
  ];

  const handleColorChange = (colorId: string) => {
    setSelectedColor(colorId);
    setSelectedImageIndex(0);
  };

  const currentImages = productImagesByColor[selectedColor] || [];
  const currentProductImage = currentImages[selectedImageIndex] || colors.find(c => c.id === selectedColor)?.img || "/Iwallet - Images/Black wit box.png";
  const isBoxImage = currentProductImage.toLowerCase().includes("box");

  // Auto-slide effect for product images
  useEffect(() => {
    if (currentImages.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImageIndex((prevIndex) => (prevIndex + 1) % currentImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentImages.length, selectedColor, selectedImageIndex]);

  const selectedTitle = colors.find(c => c.id === selectedColor)?.name;
  const currentProduct = products.find((p: any) => p.title.toLowerCase().includes(selectedTitle?.toLowerCase() || ""));
  const currentSlug = currentProduct?.slug?.current;
  const isInWishlist = wishlist.some((w: any) => w.slug === currentSlug);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentSlug) {
      await addToCart(currentSlug);
      toast.success("Successfully added to cart");
    }
  };

  return (
    <div className="bg-[#fafafa] text-black overflow-hidden font-sans">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full aspect-[4/5] md:aspect-auto md:min-h-[calc(100vh-136px)] flex items-center justify-start overflow-hidden mt-[120px] md:mt-[136px]">
        <div className="absolute inset-0 w-full h-full">
          <Image 
            src="/Iwallet - Images/Home-Hero banner-desk.jpg" 
            alt="iWallet Premium Lifestyle" 
            fill 
            className="object-cover object-center hidden md:block"
            priority
          />
          <Image 
            src="/Iwallet - Images/Home-Hero banner-mob.jpg" 
            alt="iWallet Premium Lifestyle" 
            fill 
            className="object-cover object-center block md:hidden"
            priority
          />
        </div>
      </section>

      {/* 2. FEATURE SECTION 01 - SPLIT LAYOUT */}
      <section className="py-24 md:py-40 px-6 md:px-20 max-w-[1440px] mx-auto border-b border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[120px] md:text-[200px] font-black text-transparent stroke-gray-200 leading-none select-none opacity-50 block mb-[-40px] md:mb-[-80px]"
              style={{ WebkitTextStroke: '2px #e5e7eb' }}
            >
              01
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">
              Ultra Slim <br /> Engineering
            </h2>
            <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-md mb-10 font-medium">
              Designed to vanish in your pocket. Our proprietary construction ensures a razor-thin profile without compromising on durability or capacity.
            </p>
          </div>
          <div className="order-1 lg:order-2 relative aspect-square md:aspect-auto md:h-[600px] bg-white rounded-3xl overflow-hidden shadow-2xl">
            <Image 
              src="/Iwallet - Images/Editorial-desk/1.jpg" 
              alt="Ultra Slim iWallet" 
              fill 
              unoptimized={true}
              className="object-cover hidden md:block"
            />
            <Image 
              src="/Iwallet - Images/Editorial-mob/1.jpg" 
              alt="Ultra Slim iWallet" 
              fill 
              unoptimized={true}
              className="object-cover block md:hidden"
            />
          </div>
        </div>
      </section>

      {/* 3. FEATURE SECTION 02 - REVERSED SPLIT */}
      <section className="py-24 md:py-40 px-6 md:px-20 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-square md:aspect-auto md:h-[600px] bg-[#111] rounded-3xl overflow-hidden shadow-2xl">
            <Image 
              src="/Iwallet - Images/Editorial-desk/2.jpg" 
              alt="Quick Access Mechanism" 
              fill 
              unoptimized={true}
              className="object-cover hidden md:block"
            />
            <Image 
              src="/Iwallet - Images/Editorial-mob/2.jpg" 
              alt="Quick Access Mechanism" 
              fill 
              unoptimized={true}
              className="object-cover block md:hidden"
            />
          </div>
          <div>
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[120px] md:text-[200px] font-black text-transparent stroke-gray-200 leading-none select-none opacity-50 block mb-[-40px] md:mb-[-80px]"
              style={{ WebkitTextStroke: '2px #e5e7eb' }}
            >
              02
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-right lg:text-left">
              One-Handed <br /> Access
            </h2>
            <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-md mb-10 font-medium ml-auto lg:ml-0 text-right lg:text-left">
              The world's smoothest card ejection mechanism. One flick of the thumb and your cards are presented in an elegant fan for instant use.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PROMO SECTION */}
      <section className="relative w-full aspect-square md:aspect-auto md:h-[800px] overflow-hidden">
        <Image 
          src="/Iwallet - Images/High energy sale - desk.jpg" 
          alt="Discover the future of carry" 
          fill 
          className="object-cover object-center hidden md:block"
        />
        <Image 
          src="/Iwallet - Images/High energy sale - mob.jpg" 
          alt="Discover the future of carry" 
          fill 
          className="object-cover object-center block md:hidden"
        />
      </section>

      {/* 4.5. SLEEK MINIMAL BANNER SECTION */}
      <section className="relative w-full aspect-[1600/682] md:aspect-auto md:h-[600px] overflow-hidden mt-20">
        <Image 
          src="/Iwallet - Images/sleek-minimal-banner.jpg" 
          alt="Sleek Minimal Essential" 
          fill 
          className="object-cover object-center"
        />
      </section>

      {/* 5. MOMENT SECTION - UPDATED TO MATCH IMAGE 3 */}
      <section className="py-32 md:py-48 bg-white border-t border-gray-50">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 text-center">
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">Designed for every moment</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-24 text-lg md:text-xl font-medium">
            Whether you're commuting, traveling, or just going about your day, our wallets fit your lifestyle seamlessly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
            <motion.div whileHover={{ y: -10 }} className="flex flex-col items-center">
              <div className="relative w-40 h-40 md:w-56 md:h-56 bg-gray-100 rounded-full overflow-hidden mb-10 transition-transform hover:scale-105">
                <Image 
                  src="/Iwallet - Images/icons- desk/For Travellers.jpg" 
                  alt="For Travelers" 
                  fill 
                  className="object-cover hidden md:block" 
                />
                <Image 
                  src="/Iwallet - Images/icons-mob/1.jpg" 
                  alt="For Travelers" 
                  fill 
                  className="object-cover block md:hidden" 
                />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">For Travelers</h3>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">
                Carry your essentials securely across borders with ease.
              </p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="flex flex-col items-center">
              <div className="relative w-40 h-40 md:w-56 md:h-56 bg-gray-100 rounded-full overflow-hidden mb-10 transition-transform hover:scale-105">
                <Image 
                  src="/Iwallet - Images/icons- desk/For Hustlers.jpg" 
                  alt="For Hustlers" 
                  fill 
                  className="object-cover hidden md:block" 
                />
                <Image 
                  src="/Iwallet - Images/icons-mob/2.jpg" 
                  alt="For Hustlers" 
                  fill 
                  className="object-cover block md:hidden" 
                />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">For Hustlers</h3>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">
                Quick access to your cards for on-the-go moments.
              </p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="flex flex-col items-center">
              <div className="relative w-40 h-40 md:w-56 md:h-56 bg-gray-100 rounded-full overflow-hidden mb-10 transition-transform hover:scale-105">
                <Image 
                  src="/Iwallet - Images/icons- desk/For Everyone.jpg" 
                  alt="For Everyone" 
                  fill 
                  className="object-cover hidden md:block" 
                />
                <Image 
                  src="/Iwallet - Images/icons-mob/3.jpg" 
                  alt="For Everyone" 
                  fill 
                  className="object-cover block md:hidden" 
                />
              </div>
              <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">For Everyone</h3>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">
                Timeless design that complements any style or outfit.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. PRODUCT SELECTION SECTION - UPDATED TO MATCH IMAGE 1 & 2 */}
      <section className="py-24 md:py-40 bg-white relative overflow-hidden border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Left: Product Images & Thumbnails */}
            <div className="space-y-6">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className={`relative aspect-square bg-[#f5f5f5] rounded-[2rem] overflow-hidden flex items-center justify-center transition-all duration-500 group cursor-crosshair ${isBoxImage ? "p-0 md:p-12" : "p-0"}`}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={`${selectedColor}-${selectedImageIndex}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isBoxImage ? "p-0 md:p-8" : "p-0"}`}
                  >
                    <Image 
                      src={currentProductImage} 
                      alt="iWallet Premium Product" 
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={`transition-all duration-500 ${
                        isBoxImage 
                          ? "object-cover p-0 md:object-contain md:p-8 md:drop-shadow-[0_30px_60px_rgba(0,0,0,0.12)]" 
                          : "object-cover p-0"
                      }`}
                    />
                  </motion.div>
                </AnimatePresence>
                
                {/* Floating tags */}
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg z-10 flex items-center gap-2 transform group-hover:scale-110 transition-transform">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black tracking-widest uppercase">In Stock</span>
                </div>
              </motion.div>
              
              {/* Thumbnails row like in Image 2 */}
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {/* Product Card Images for Selected Color */}
                {currentImages.map((imgUrl, idx) => {
                  const isBox = imgUrl.toLowerCase().includes("box");
                  return (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`min-w-[100px] aspect-square bg-[#f5f5f5] rounded-2xl border-2 ${
                        selectedImageIndex === idx ? "border-black" : "border-transparent"
                      } overflow-hidden cursor-pointer transition-all hover:border-gray-200 relative ${
                        isBox ? "p-0 md:p-2" : "p-0"
                      }`}
                    >
                      <Image 
                        src={imgUrl} 
                        alt={`${selectedColor} wallet angle ${idx + 1}`} 
                        fill
                        priority
                        unoptimized={true}
                        sizes="100px"
                        className={isBox ? "object-cover md:object-contain md:p-1" : "object-cover"} 
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Product Info - MATCH IMAGE 1 */}
            <div className="flex flex-col h-full pt-4">
              <div className="flex flex-col gap-4 mb-10">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black leading-none">
                  {currentProduct?.title || `Premium iWallet – ${selectedTitle}`}
                </h2>
                <div className="flex flex-col gap-2">
                  <div className="flex items-baseline gap-4">
                    <span className="text-3xl md:text-5xl font-black tracking-tighter text-[#ff3366]">₹{(currentProduct?.price || 1599) - 200}</span>
                    <span className="text-xl md:text-3xl font-black tracking-tighter text-gray-400 line-through">₹{currentProduct?.price || 1599}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-50 border border-rose-100 text-[#ff3366] text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm animate-pulse">🔥 ₹999 WITH COUPON</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 leading-relaxed mb-10 text-lg font-medium max-w-lg">
                {currentProduct?.description || "Curabitur egestas malesuada volutpat. Nunc vel vestibulum odio, ac pellentesque lacus. Pellentesque dapibus nunc nec est imperdiet."}
              </p>

              {/* Color Swatches like Image 1 */}
              <div className="mb-10">
                <p className="font-black mb-4 uppercase text-xs tracking-widest">Color: <span className="text-gray-400">{selectedTitle}</span></p>
                <div className="flex gap-4">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorChange(color.id)}
                      className={`relative w-16 h-16 rounded-xl border-2 transition-all overflow-hidden ${selectedColor === color.id ? "border-black scale-105" : "border-gray-100 opacity-60"}`}
                    >
                      <Image src={color.img} alt={color.name} fill unoptimized={true} className="object-contain p-1" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & CTA - MATCH IMAGE 1 */}
              <div className="flex flex-col gap-3 md:gap-5 mb-12">
                <div className="flex flex-col md:flex-row gap-3 md:h-16">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-100 rounded-2xl px-6 py-3 md:py-0 bg-[#f9f9f9] shadow-inner shrink-0 w-full md:w-auto justify-between md:justify-center">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black transition-colors p-2"><Minus size={18} /></button>
                    <span className="mx-5 font-black text-lg min-w-[30px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-black transition-colors p-2"><Plus size={18} /></button>
                  </div>
                  
                  <div className="flex flex-row gap-3 w-full md:flex-1 h-14 md:h-full">
                    <form className="flex-1 h-full">
                      <button onClick={handleAddToCart} className="w-full h-full bg-[#ff3366] text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] md:text-xs hover:bg-black transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_10px_20px_rgba(255,51,102,0.15)] flex items-center justify-center text-center px-2">
                        Add to Cart
                      </button>
                    </form>
                    
                    <form action={buyItNow.bind(null, currentSlug)} className="flex-1 h-full">
                      <button className="w-full h-full bg-black text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] md:text-xs hover:bg-[#ff3366] transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_10px_20px_rgba(0,0,0,0.1)] flex items-center justify-center text-center px-2">
                        Buy It Now
                      </button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Features Grid like Image 1 */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 border-t border-gray-100 pt-16">
                <div className="flex flex-col gap-3">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black shadow-sm">
                    <RotateCcw size={28} strokeWidth={1} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">5 Days Return</p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black shadow-sm">
                    <Leaf size={28} strokeWidth={1} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">100% Vegan Leather</p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black shadow-sm">
                    <Zap size={28} strokeWidth={1} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Lifetime Warranty</p>
                </div>
              </div>
              
              <Link href="/buy" className="mt-12 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group border-b border-black w-fit pb-1">
                View full details <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>



      {/* 8. LIFESTYLE GALLERY */}
      <section className="py-32 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 md:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {lifestyleImages.map((imgUrl, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-lg"
              >
                <Image 
                  src={imgUrl} 
                  alt={`Lifestyle ${idx + 1}`} 
                  fill 
                  className="object-cover hover:scale-110 transition-transform duration-1000"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. REVIEWS & SOCIAL */}
      <section className="py-32 px-6 md:px-20 max-w-[1440px] mx-auto text-center border-t border-gray-100">
        <h2 className="text-4xl md:text-6xl font-black mb-16 tracking-tighter">Join the Carry Club</h2>
        
        <div className="flex justify-center mb-12">
          <button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
          >
            {showReviewForm ? "Cancel" : "Write a Review"}
          </button>
        </div>

        <AnimatePresence>
          {showReviewForm && (
            <motion.form 
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: "auto", overflow: 'visible' }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              onSubmit={handleReviewSubmit}
              className="max-w-2xl mx-auto mb-16 text-left bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
            >
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                <input 
                  type="text" 
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition-shadow"
                  placeholder="Your Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button"
                      onClick={() => setNewReview({...newReview, stars: star})}
                      className="focus:outline-none"
                    >
                      <Star 
                        size={28} 
                        className={`transition-colors ${star <= newReview.stars ? "fill-black text-black" : "text-gray-200 hover:text-gray-400"}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">Review</label>
                <textarea 
                  required
                  value={newReview.text}
                  onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition-shadow h-32 resize-none"
                  placeholder="Share your experience..."
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
              >
                Submit Review
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {reviews.slice(0, visibleReviewsCount).map((review, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 text-left hover:shadow-xl transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(review.stars)].map((_, s) => <Star key={s} size={14} className="fill-black text-black" />)}
              </div>
              <p className="text-lg font-medium text-gray-600 mb-6 italic">"{review.text}"</p>
              <p className="font-black uppercase tracking-widest text-xs">— {review.name}</p>
            </div>
          ))}
        </div>

        {reviews.length > visibleReviewsCount && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setVisibleReviewsCount(prev => prev + 6)}
              className="border-2 border-black text-black px-8 py-3 rounded-full font-bold hover:bg-black hover:text-white transition-colors"
            >
              View More Reviews
            </button>
          </div>
        )}


        <div className="mt-24 flex flex-col items-center">
          <Link href="https://instagram.com" className="flex items-center gap-2 group">
            <Instagram size={32} className="group-hover:text-[#ff3366] transition-colors" />
            <span className="text-xl font-black tracking-tighter uppercase">@TheCarryClub.in_</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
