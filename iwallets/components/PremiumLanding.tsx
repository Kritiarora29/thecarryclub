"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
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
import { useState } from "react";
import { addToCart, buyItNow } from "@/lib/cartActions";
import { toggleWishlist } from "@/lib/wishlistActions";
import toast from "react-hot-toast";

export default function PremiumLanding({ products = [], wishlist = [] }: any) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("black");

  const colors = [
    { id: "black", name: "Black", class: "bg-black", img: "/Iwallet - Images/Black wit box.png" },
    { id: "space-grey", name: "Space Grey", class: "bg-gray-600", img: "/Iwallet - Images/Grey with box_.png" },
    { id: "white", name: "White", class: "bg-white border border-gray-200", img: "/Iwallet - Images/White with box_.png" },
  ];

  const currentProductImage = colors.find(c => c.id === selectedColor)?.img || "/Iwallet - Images/Black wit box.png";

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
      <section className="relative w-full aspect-[4/5] md:aspect-auto md:min-h-screen flex items-center justify-start overflow-hidden mt-[120px] md:mt-0">
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
          <div className="order-1 lg:order-2 relative h-[400px] md:h-[600px] bg-white rounded-3xl overflow-hidden shadow-2xl">
            <Image 
              src="/Iwallet - Images/Editorial-desk/1.jpg" 
              alt="Ultra Slim iWallet" 
              fill 
              className="object-cover hidden md:block"
            />
            <Image 
              src="/Iwallet - Images/Editorial-mob/1.jpg" 
              alt="Ultra Slim iWallet" 
              fill 
              className="object-cover block md:hidden"
            />
          </div>
        </div>
      </section>

      {/* 3. FEATURE SECTION 02 - REVERSED SPLIT */}
      <section className="py-24 md:py-40 px-6 md:px-20 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative h-[400px] md:h-[600px] bg-[#111] rounded-3xl overflow-hidden shadow-2xl">
            <Image 
              src="/Iwallet - Images/Editorial-desk/2.jpg" 
              alt="Quick Access Mechanism" 
              fill 
              className="object-cover hidden md:block"
            />
            <Image 
              src="/Iwallet - Images/Editorial-mob/2.jpg" 
              alt="Quick Access Mechanism" 
              fill 
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
      <section className="relative w-full aspect-[1200/982] md:aspect-auto md:h-[600px] overflow-hidden mt-20">
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
                className="relative aspect-square bg-[#f5f5f5] rounded-[2rem] overflow-hidden flex items-center justify-center p-12 group cursor-crosshair"
              >
                  <motion.div
                    key={selectedColor}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, y: -20 }}
                    transition={{ duration: 0.5, ease: "backOut" }}
                    className="relative z-10 w-full h-full flex items-center justify-center p-2 md:p-8"
                  >
                    <Image 
                      src={currentProductImage} 
                      alt="iWallet Premium Product" 
                      fill
                      className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-4 md:p-8"
                    />
                  </motion.div>
                
                {/* Floating tags */}
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg z-10 flex items-center gap-2 transform group-hover:scale-110 transition-transform">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black tracking-widest uppercase">In Stock</span>
                </div>
              </motion.div>
              
              {/* Thumbnails row like in Image 2 */}
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {/* Product Color Variants */}
                {colors.map((color) => (
                  <div 
                    key={color.id} 
                    onClick={() => setSelectedColor(color.id)}
                    className={`min-w-[100px] aspect-square bg-[#f5f5f5] rounded-2xl border-2 ${selectedColor === color.id ? "border-black" : "border-transparent"} overflow-hidden cursor-pointer p-2 transition-all hover:border-gray-200`}
                  >
                    <Image src={color.img} alt={color.name} width={100} height={100} className="object-contain" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Product Info - MATCH IMAGE 1 */}
            <div className="flex flex-col h-full pt-4">
              <div className="flex flex-col gap-4 mb-10">
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black leading-none">
                  {currentProduct?.title || `Premium iWallet – ${selectedTitle}`}
                </h2>
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl md:text-5xl font-black tracking-tighter">₹{currentProduct?.price || "1,599"}</span>
                </div>
                
                {/* Premium Exclusive Coupon UI */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 rounded-3xl opacity-5 group-hover:opacity-10 transition-opacity" />
                  <div className="relative border border-blue-100 bg-white/50 backdrop-blur-sm p-4 md:p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_10px_30px_rgba(37,99,235,0.05)]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-600">Exclusive Flash Deal</span>
                      </div>
                      <p className="text-lg md:text-xl font-black text-black tracking-tight">
                        Unlock for <span className="text-blue-600">₹999</span>
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Available for the next 2 hours</p>
                    </div>

                    <button className="relative group/btn flex items-center gap-3 bg-white border border-blue-100 p-1.5 pl-4 rounded-xl shadow-sm hover:border-blue-400 transition-all overflow-hidden">
                      <div className="flex flex-col items-start mr-3">
                        <span className="text-[7px] text-gray-400 font-black uppercase tracking-tighter">Coupon Code</span>
                        <span className="text-xs font-black text-black">CARRY999</span>
                      </div>
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-black uppercase tracking-widest text-[8px] group-hover/btn:bg-blue-700 transition-colors">
                        Copy
                      </div>
                    </button>
                  </div>
                </motion.div>
              </div>

              <p className="text-gray-500 leading-relaxed mb-10 text-lg font-medium max-w-lg">
                {currentProduct?.description || "Curabitur egestas malesuada volutpat. Nunc vel vestibulum odio, ac pellentesque lacus. Pellentesque dapibus nunc nec est imperdiet."}
              </p>

              {/* Color Swatches like Image 1 */}
              <div className="mb-10">
                <p className="font-black mb-4 uppercase text-xs tracking-widest">Image: <span className="text-gray-400">{selectedColor}</span></p>
                <div className="flex gap-4">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColor(color.id)}
                      className={`relative w-16 h-16 rounded-xl border-2 transition-all overflow-hidden ${selectedColor === color.id ? "border-black scale-105" : "border-gray-100 opacity-60"}`}
                    >
                      <Image src={color.img} alt={color.name} fill className="object-contain p-1" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & CTA - MATCH IMAGE 1 */}
              <div className="flex flex-col gap-5 mb-12">
                <div className="flex gap-3 h-14 md:h-16">
                  <div className="flex items-center border border-gray-100 rounded-2xl px-5 bg-[#f9f9f9] shadow-inner">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-black transition-colors transform hover:scale-120"><Minus size={16} /></button>
                    <span className="mx-5 font-black text-base min-w-[20px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-black transition-colors transform hover:scale-120"><Plus size={16} /></button>
                  </div>
                  <form className="flex-1">
                    <button onClick={handleAddToCart} className="w-full h-full bg-black text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-[#222] transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
                      Add to Cart
                    </button>
                  </form>

                  <form action={toggleWishlist.bind(null, currentSlug)}>
                    <button className="w-14 h-14 md:w-16 md:h-16 border border-gray-100 rounded-2xl flex items-center justify-center hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm bg-white text-gray-400 group">
                      <Heart 
                        size={18} 
                        className={`${isInWishlist ? "fill-rose-600 text-rose-600" : "text-gray-400 group-hover:fill-rose-500 group-hover:text-rose-500"} transition-all`} 
                      />
                    </button>
                  </form>
                </div>
                
                <div className="flex items-center gap-3 mb-1 px-4">
                  <input type="checkbox" id="terms-landing" className="w-5 h-5 rounded-lg border-gray-200 text-blue-600 focus:ring-blue-600 cursor-pointer" />
                  <label htmlFor="terms-landing" className="text-[10px] text-gray-400 font-bold uppercase tracking-widest cursor-pointer">I agree with the <Link href="/terms" className="underline hover:text-black transition-colors">terms and conditions</Link></label>
                </div>

                <form action={buyItNow.bind(null, currentSlug)}>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:from-blue-700 hover:to-blue-600 transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-[0_15px_30px_rgba(37,99,235,0.15)]">
                    Buy It Now
                  </button>
                </form>
              </div>

              {/* Features Grid like Image 1 */}
              <div className="grid grid-cols-2 gap-y-12 border-t border-gray-100 pt-16">
                <div className="flex flex-col gap-3">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black shadow-sm">
                    <RotateCcw size={28} strokeWidth={1} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">30 Days Return</p>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black shadow-sm">
                    <ShieldCheck size={28} strokeWidth={1} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">RFID Protected</p>
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
            {[1, 2, 3, 4].map((i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-lg"
              >
                <Image 
                  src={`/Iwallet - Images/Prod image-desk-grey/${i}.png`} 
                  alt={`Lifestyle ${i}`} 
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { name: "Rahul S.", text: "The best wallet I've ever owned. So slim I forget it's in my pocket.", stars: 5 },
            { name: "Anita M.", text: "Elegant design and the card ejector is so satisfying to use!", stars: 5 },
            { name: "Vikram R.", text: "Premium feel at a great price. Highly recommended.", stars: 5 }
          ].map((review, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 text-left hover:shadow-xl transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(review.stars)].map((_, s) => <Star key={s} size={14} className="fill-black text-black" />)}
              </div>
              <p className="text-lg font-medium text-gray-600 mb-6 italic">"{review.text}"</p>
              <p className="font-black uppercase tracking-widest text-xs">— {review.name}</p>
            </div>
          ))}
        </div>

        <div className="mt-24 flex flex-col items-center">
          <Link href="https://instagram.com" className="flex items-center gap-2 group">
            <Instagram size={32} className="group-hover:text-[#ff3366] transition-colors" />
            <span className="text-xl font-black tracking-tighter uppercase">@theCarryClub</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
