"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLoginModal from "@/components/AdminLoginModal";
import { Menu, X, ShoppingCart, User, Search, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % 2);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const banners = [
    <span key="1">PREMIUM SLIM WALLETS – FREE SHIPPING PAN INDIA 🔥</span>,
    <span key="2">USE CODE <span className="text-black bg-white px-2 py-0.5 rounded mx-2 font-black">CARRY999</span> FOR ₹999 DEAL!</span>
  ];

  const updateCartCount = async () => {
    try {
      const res = await fetch("/api/cart-count");
      const data = await res.json();
      setCartCount(data.count);
    } catch {
      setCartCount(0);
    }
  };

  const updateWishlistCount = () => {
    try {
      const wishlistMatch = document.cookie
        .split("; ")
        .find((row) => row.startsWith("wishlist="));
      const wishlist = wishlistMatch ? JSON.parse(decodeURIComponent(wishlistMatch.split("=")[1])) : [];
      setWishlistCount(wishlist.length);
    } catch {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    fetch("/api/admin-check")
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.authenticated));

    updateCartCount();
    updateWishlistCount();
    window.addEventListener("storage", updateCartCount);
    const interval = setInterval(() => {
      updateCartCount();
      updateWishlistCount();
    }, 2000);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      clearInterval(interval);
    };
  }, []);

  const logout = async () => {
    await fetch("/api/admin-logout", { method: "POST" });
    setIsAdmin(false);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/buy" },
    { name: "About", href: "/about" },
    { name: "FAQs", href: "/faqs" },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[100] flex flex-col font-sans">
        {/* PROMO BAR */}
        <div className="bg-[#111] text-white text-center h-10 flex items-center justify-center text-[10px] font-black tracking-[0.2em] uppercase overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={bannerIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute w-full flex items-center justify-center px-4"
            >
              {banners[bannerIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* MAIN NAV */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`w-full transition-all duration-500 ${scrolled 
            ? "bg-white/90 backdrop-blur-md py-3 shadow-lg" 
            : "bg-white/50 backdrop-blur-sm py-6"
          }`}
        >
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 grid grid-cols-2 md:grid-cols-3 items-center">
            
            {/* Logo - Left */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl md:text-4xl font-black text-black tracking-tighter">
                theCarryClub<span className="text-blue-600">.</span>
              </span>
            </Link>

            {/* Links - Center (Desktop) */}
            <div className="hidden md:flex items-center justify-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Icons - Right */}
            <div className="flex items-center justify-end gap-6 md:gap-8">
              
              {isAdmin ? (
                <button onClick={logout} className="text-blue-600 hover:scale-110 transition-transform">
                  <User size={22} strokeWidth={2.5} />
                </button>
              ) : (
                <button onClick={() => setShowModal(true)} className="text-black hover:scale-110 transition-transform">
                  <User size={22} strokeWidth={2.5} />
                </button>
              )}

              <Link href="/wishlist" className="hidden md:block relative text-black hover:scale-110 transition-transform">
                <Heart size={22} strokeWidth={2.5} />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-rose-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <Link href="/cart" className="relative text-black hover:scale-110 transition-transform">
                <ShoppingCart size={22} strokeWidth={2.5} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-blue-600 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <button
                className="md:hidden text-black"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

          </div>
        </motion.nav>
      </div>

      {/* MOBILE NAV */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 bg-white z-[95] pt-[120px] px-10"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-4xl font-black uppercase tracking-tighter text-black"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/wishlist"
                onClick={() => setIsOpen(false)}
                className="text-4xl font-black uppercase tracking-tighter text-rose-600"
              >
                Wishlist
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showModal && (
        <AdminLoginModal
          onClose={() => setShowModal(false)}
          onSuccess={() => setIsAdmin(true)}
        />
      )}
    </>
  );
}