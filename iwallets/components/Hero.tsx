"use client"

import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"

const WalletModel = dynamic(() => import("./WalletModel"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full text-gray-400 font-bold uppercase tracking-widest text-xs">
      Loading 3D Experience...
    </div>
  ),
})

const banners = [
  {
    image: "/premium_wallet_lifestyle_1_1778337485615.png",
    title: "Luxury in Your Pocket",
    subtitle: "Precision engineering meets timeless fashion.",
    alt: "Lifestyle shot of iWallet black premium slim wallet",
  },
  {
    image: "/premium_wallet_lifestyle_2_1778337503803.png",
    title: "Minimalism Redefined",
    subtitle: "The only wallet you'll ever need.",
    alt: "Close-up of iWallet minimalist vegan leather design",
  },
];

const benefits = [
  { icon: "🛡️", title: "Secure Payment", desc: "Razorpay Protected" },
  { icon: "✨", title: "Premium Quality", desc: "Vegan Leather" },
  { icon: "🔄", title: "Easy Returns", desc: "7 Days Replacement" },
];

const wallets = [
  {
    id: "black",
    title: "Black",
    desc: "A bold and refined finish designed for timeless elegance and premium durability.",
    img: "/black_wallet.jpeg",
    alt: "iWallet Black – premium slim vegan leather wallet",
    reverse: false,
    bgClass: "bg-black text-white",
    accent: "bg-[#ff3366]",
    titleColor: "text-white",
  },
  {
    id: "space-grey",
    title: "Space Grey",
    desc: "Inspired by modern technology aesthetics. Minimal, sleek, and engineered for everyday performance.",
    img: "/space_grey_wallet.png",
    alt: "iWallet Space Grey – minimalist slim wallet inspired by modern tech",
    reverse: true,
    bgClass: "bg-black text-white",
    accent: "bg-[#ff3366]",
    titleColor: "text-white",
  },
  {
    id: "white",
    title: "White",
    desc: "A clean minimal finish designed for modern lifestyle and effortless elegance.",
    img: "/white_wallet.png",
    alt: "iWallet White – clean minimal finish slim wallet",
    reverse: false,
    bgClass: "bg-black text-white",
    accent: "bg-[#ff3366]",
    titleColor: "text-white",
  },
];

export default function Hero() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white">

      {/* DYNAMIC HERO CAROUSEL */}
      <section aria-label="Hero banner carousel" className="relative h-[50vh] md:h-[90vh] w-full overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: { duration: 1.0, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.6 },
            }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <Image
              src={banners[currentBanner].image}
              alt={banners[currentBanner].alt}
              fill
              priority
              fetchPriority={currentBanner === 0 ? "high" : "low"}
              quality={85}
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 md:px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-4xl"
          >
            <h1 className="text-3xl md:text-8xl font-black text-white tracking-tighter mb-2 md:mb-4 leading-none">
              {banners[currentBanner].title}
            </h1>
            <p className="text-xs md:text-2xl text-white/90 mb-5 md:mb-10 max-w-2xl mx-auto font-medium">
              {banners[currentBanner].subtitle}
            </p>

            <Link
              href="/buy"
              className="inline-block px-5 py-2.5 md:px-12 md:py-5 bg-[#ff3366] text-white font-black rounded-full hover:bg-white hover:text-[#ff3366] transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(255,51,102,0.4)] text-[10px] md:text-lg uppercase tracking-widest"
              aria-label="Explore the iWallet collection"
            >
              Explore Collection
            </Link>
          </motion.div>
        </div>

        {/* Carousel Dots */}
        <div
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2 md:gap-3"
          role="tablist"
          aria-label="Banner navigation"
        >
          {banners.map((banner, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentBanner}
              aria-label={`Go to slide ${i + 1}: ${banner.title}`}
              onClick={() => setCurrentBanner(i)}
              className={`h-1.5 md:h-3 rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                i === currentBanner ? "bg-[#ff3366] w-6 md:w-10" : "bg-white/40 w-1.5 md:w-3"
              }`}
            />
          ))}
        </div>
      </section>

      {/* TRUST BAR */}
      <section aria-label="Trust signals" className="bg-white py-8 md:py-16 border-b border-gray-100 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-rose-100 rounded-full blur-3xl opacity-40" aria-hidden="true" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40" aria-hidden="true" />

        <ul className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-12 relative z-10 list-none m-0 p-0">
          {benefits.map((b, i) => (
            <li key={i} className="flex flex-col items-center text-center group">
              <span className="text-2xl md:text-4xl mb-2 md:mb-4 transform group-hover:scale-125 transition-transform duration-300" aria-hidden="true">
                {b.icon}
              </span>
              <h3 className="font-black text-[9px] md:text-sm text-black uppercase tracking-[0.2em]">{b.title}</h3>
              <p className="text-[9px] md:text-xs text-gray-500 mt-1 font-bold">{b.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* INTERACTIVE 3D EXPERIENCE */}
      <section aria-label="Interactive 3D wallet studio" className="py-10 md:py-24 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <span className="text-[#ff3366] font-black tracking-[0.3em] text-[9px] md:text-xs uppercase">Design Studio</span>
            <h2 className="text-3xl md:text-8xl font-black text-black mt-2 md:mt-6 leading-[0.85] tracking-tighter">
              The <span className="text-[#ff3366]">Perfect</span> <br />
              Fit.
            </h2>
            <p className="mt-3 md:mt-8 text-gray-600 text-xs md:text-xl leading-relaxed max-w-md mx-auto md:mx-0">
              Engineered to be the slimmest wallet in the world.
              Experience the 3D difference before you buy.
            </p>
            <div className="mt-5 md:mt-12">
              <Link
                href="/buy"
                className="inline-block bg-black text-white px-5 py-2.5 md:px-10 md:py-4 rounded-full font-black hover:bg-[#ff3366] transition-all transform hover:-translate-y-1 shadow-xl text-xs md:text-base"
                aria-label="Shop the iWallet interactive experience"
              >
                Shop Interactive
              </Link>
            </div>
          </motion.div>
          <div className="h-[200px] md:h-[650px] w-full relative group mt-4 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff3366]/10 to-blue-500/10 rounded-full blur-[100px] group-hover:opacity-100 transition-opacity duration-1000" aria-hidden="true" />
            <WalletModel />
          </div>
        </div>
      </section>

      {/* EDITORIAL SHOWCASE */}
      <section aria-label="Wallet colour showcase" className="bg-gray-50 py-10 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-20 gap-4 md:gap-8">
            <h2 className="text-4xl md:text-9xl font-black text-black leading-none tracking-tighter">
              Iconic <br className="hidden md:block" /> <span className="text-gray-300">Style.</span>
            </h2>
            <p className="text-gray-500 max-w-sm text-xs md:text-lg md:text-right leading-relaxed">
              Premium materials crafted into a minimal silhouette.
              The ultimate companion for your daily journey.
            </p>
          </div>

          <ul className="space-y-6 md:space-y-16 list-none m-0 p-0">
            {wallets.map((wallet) => (
              <motion.li
                key={wallet.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`${wallet.bgClass} rounded-[2rem] md:rounded-[3rem] p-6 md:p-24 flex flex-col md:flex-row items-center gap-6 md:gap-16 group relative overflow-hidden shadow-xl md:shadow-2xl text-center md:text-left`}
              >
                <div className={`w-full md:w-1/2 ${wallet.reverse ? "order-1 md:order-2" : "order-1"}`}>
                  <div className="relative aspect-square md:aspect-auto h-[250px] md:h-[400px]">
                    <div
                      className={`absolute inset-0 ${wallet.accent} rounded-full blur-[40px] md:blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000`}
                      aria-hidden="true"
                    />
                    <Image
                      src={wallet.img}
                      alt={wallet.alt}
                      fill
                      loading="lazy"
                      className="object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-1000 relative z-10"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
                <div className={`w-full md:w-1/2 ${wallet.reverse ? "order-2 md:order-1" : "order-2"} flex flex-col items-center md:items-start`}>
                  <div className={`w-8 md:w-12 h-1 ${wallet.accent} mb-3 md:mb-8`} aria-hidden="true" />
                  <h3 className={`text-2xl md:text-8xl font-black mb-2 md:mb-8 tracking-tighter whitespace-pre-line leading-tight ${wallet.titleColor}`}>
                    {wallet.title}
                  </h3>
                  <p className="text-xs md:text-2xl mb-2 md:mb-8 leading-relaxed opacity-80 max-w-[280px] md:max-w-none">
                    {wallet.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* FINAL CTA */}
      <section aria-label="Call to action – order your iWallet" className="py-12 md:py-32 bg-black text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff3366] rounded-full blur-[150px] opacity-20 animate-pulse" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[150px] opacity-20 animate-pulse" aria-hidden="true" />

        <div className="max-w-4xl mx-auto px-4 md:px-6 relative z-10">
          <h2 className="text-2xl md:text-8xl font-black text-white mb-3 md:mb-10 tracking-tighter leading-none">
            Ready to <br className="hidden md:block" /> <span className="text-[#ff3366]">Level Up?</span>
          </h2>
          <p className="text-gray-400 text-xs md:text-2xl mb-6 md:mb-16 max-w-2xl mx-auto leading-relaxed">
            Join the thousands who ditched the bulk.
            Secure yours today with a 7-day money-back guarantee.
          </p>
          <Link
            href="/buy"
            className="inline-block bg-[#ff3366] text-white px-5 py-3 md:px-16 md:py-6 rounded-full font-black text-xs md:text-2xl hover:bg-white hover:text-black transition-all shadow-[0_20px_50px_rgba(255,51,102,0.3)] transform hover:scale-110 uppercase tracking-widest"
            aria-label="Order your iWallet now"
          >
            Order Your iWallet
          </Link>
        </div>
      </section>

    </div>
  )
}
