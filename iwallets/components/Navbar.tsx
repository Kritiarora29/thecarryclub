"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLoginModal from "@/components/AdminLoginModal";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
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
    <span key="1">FLASH SALE GOING ON 🔥</span>,
    <span key="2">Use code <span className="text-black bg-white px-1.5 py-0.5 md:px-2 md:py-1 rounded mx-2 tracking-normal">CARRY999</span> for ₹999 deal!</span>
  ];

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.qty, 0));
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetch("/api/admin-check")
      .then((res) => res.json())
      .then((data) => setIsAdmin(data.authenticated));

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    const interval = setInterval(updateCartCount, 2000);

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
    { name: "About", href: "/about" },
    { name: "FAQs", href: "/faqs" },
    { name: "Shop", href: "/buy" },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[100] flex flex-col">
        {/* COUPON BAR */}
        <div className="bg-[#ff3366] text-white text-center h-8 md:h-10 flex items-center justify-center text-[8px] md:text-[11px] font-black tracking-[0.2em] uppercase shadow-md overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={bannerIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute w-full flex items-center justify-center"
            >
              {banners[bannerIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* NAVBAR */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`w-full transition-all duration-500 bg-[#111] backdrop-blur-xl border-b border-white/5 ${scrolled ? "py-2 md:py-3" : "py-3 md:py-4"
            }`}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">

            <Link href="/" className="group flex items-center gap-1">
              <span className="text-xl md:text-2xl font-black text-white tracking-tighter uppercase italic">
                theCarry<span className="text-[#ff3366]">Club</span>
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs font-black uppercase tracking-[0.2em] transition-all text-gray-400 hover:text-white"
                >
                  {link.name}
                </Link>
              ))}

              <Link href="/cart" className="relative text-gray-400 hover:text-white transition-colors">
                <ShoppingCart size={22} strokeWidth={2.5} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-[#ff3366] text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-lg shadow-rose-500/40"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {isAdmin ? (
                <button
                  onClick={logout}
                  className="text-rose-400 hover:text-white transition-colors p-1"
                  title="Admin Logout"
                >
                  <User size={22} strokeWidth={2.5} className="fill-rose-400/20" />
                </button>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                  title="Admin Login"
                >
                  <User size={22} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* MOBILE TOGGLE */}
            <div className="flex items-center gap-6 md:hidden">
              <Link href="/cart" className="relative text-white">
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#ff3366] text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <button
                className="text-white relative w-7 h-7 flex items-center justify-center"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X size={28} className="absolute" />
                ) : (
                  <Menu size={28} className="absolute" />
                )}
              </button>
            </div>
          </div>
        </motion.nav>
      </div>

      {/* MOBILE NAV OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 bg-black/95 backdrop-blur-3xl z-[90] pt-[120px] pb-12 px-8"
          >
            <div className="flex flex-col gap-8 items-center h-full relative justify-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-black uppercase tracking-widest text-white hover:text-[#ff3366]"
                >
                  {link.name}
                </Link>
              ))}

              <hr className="w-12 border-white/10 my-4" />

              {isAdmin ? (
                <button onClick={() => { logout(); setIsOpen(false); }} className="text-rose-400 text-base font-black uppercase tracking-widest">Logout</button>
              ) : (
                <button onClick={() => { setShowModal(true); setIsOpen(false); }} className="text-gray-500 text-base font-black uppercase tracking-widest">Admin Login</button>
              )}
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