"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLoginModal from "@/components/AdminLoginModal";
import { Menu, X, ShoppingBag, User, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BANNERS = [
  "Premium Slim Wallets · Free Shipping Pan India",
  "🔥 ₹999 with coupon SAVE400 — limited time offer",
];

export default function Navbar() {
  const [isAdmin, setIsAdmin]         = useState(false);
  const [showModal, setShowModal]     = useState(false);
  const [isOpen, setIsOpen]           = useState(false);
  const [cartCount, setCartCount]     = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [scrolled, setScrolled]       = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setBannerIndex(p => (p + 1) % BANNERS.length), 4000);
    return () => clearInterval(id);
  }, []);

  const updateCart = async () => {
    try {
      const res = await fetch("/api/cart-count");
      const data = await res.json();
      setCartCount(data.count);
    } catch { setCartCount(0); }
  };

  const updateWishlist = () => {
    try {
      const m = document.cookie.split("; ").find(r => r.startsWith("wishlist="));
      const w = m ? JSON.parse(decodeURIComponent(m.split("=")[1])) : [];
      setWishlistCount(w.length);
    } catch { setWishlistCount(0); }
  };

  useEffect(() => {
    fetch("/api/admin-check").then(r => r.json()).then(d => setIsAdmin(d.authenticated));
    updateCart();
    updateWishlist();
    const id = setInterval(() => { updateCart(); updateWishlist(); }, 3000);
    return () => clearInterval(id);
  }, []);

  const logout = async () => {
    await fetch("/api/admin-logout", { method: "POST" });
    setIsAdmin(false);
  };

  const navLinks = [
    { name: "Home",  href: "/" },
    { name: "Shop",  href: "/buy" },
    { name: "About", href: "/about" },
    { name: "FAQs",  href: "/faqs" },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[100] flex flex-col">

        {/* ── Promo bar ───────────────────────────────────────── */}
        <div className="bg-[#1A1A1A] text-white h-9 flex items-center justify-center overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.p
              key={bannerIndex}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0,  opacity: 1 }}
              exit={{   y: -14, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute text-[11px] font-medium tracking-[0.06em] text-center px-4"
              style={{ fontFamily: "var(--font-body, sans-serif)" }}
            >
              {BANNERS[bannerIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* ── Main navbar ─────────────────────────────────────── */}
        <nav
          className={`w-full transition-all duration-300 ${
            scrolled
              ? "bg-white shadow-[0_1px_0_0_#E3DDD6] py-3"
              : "bg-white/95 backdrop-blur-sm py-4"
          }`}
        >
          <div className="max-w-[1280px] mx-auto px-6 md:px-10 flex items-center justify-between gap-6">

            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <span
                className="text-[1.45rem] md:text-[1.65rem] font-bold tracking-tight text-[#1A1A1A]"
                style={{ fontFamily: "var(--font-display, Georgia, serif)", letterSpacing: "-0.03em" }}
              >
                theCarryClub<span style={{ color: "var(--brand)" }}>.</span>
              </span>
            </Link>

            {/* Nav links — desktop */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[13px] font-medium text-[#5A534E] hover:text-[#1A1A1A] transition-colors tracking-wide"
                  style={{ fontFamily: "var(--font-body, sans-serif)" }}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-5 md:gap-6">
              <button
                onClick={isAdmin ? logout : () => setShowModal(true)}
                className="text-[#5A534E] hover:text-[#1A1A1A] transition-colors"
                title={isAdmin ? "Logout" : "Login"}
              >
                <User size={20} strokeWidth={1.75} />
              </button>

              <Link href="/wishlist" className="hidden md:flex relative text-[#5A534E] hover:text-[#1A1A1A] transition-colors">
                <Heart size={20} strokeWidth={1.75} />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 text-white text-[9px] font-semibold w-[15px] h-[15px] flex items-center justify-center rounded-full"
                      style={{ background: "var(--brand)" }}
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <Link href="/cart" className="relative flex items-center gap-1.5 text-[#5A534E] hover:text-[#1A1A1A] transition-colors">
                <ShoppingBag size={20} strokeWidth={1.75} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 text-white text-[9px] font-semibold w-[15px] h-[15px] flex items-center justify-center rounded-full"
                      style={{ background: "var(--brand)" }}
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              {/* Hamburger */}
              <button
                className="md:hidden text-[#1A1A1A] p-1"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Menu"
              >
                {isOpen ? <X size={24} strokeWidth={1.75} /> : <Menu size={24} strokeWidth={1.75} />}
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* ── Mobile drawer ───────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.28 }}
            className="fixed inset-0 bg-white z-[99] flex flex-col pt-[88px] px-8 pb-10"
          >
            <nav className="flex flex-col gap-1 mt-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-4 text-2xl font-semibold text-[#1A1A1A] border-b border-[#F0EBE3] tracking-tight"
                    style={{ fontFamily: "var(--font-display, Georgia, serif)" }}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.24 }}>
                <Link
                  href="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="block py-4 text-2xl font-semibold border-b border-[#F0EBE3] tracking-tight"
                  style={{ fontFamily: "var(--font-display, Georgia, serif)", color: "var(--brand)" }}
                >
                  Wishlist
                </Link>
              </motion.div>
            </nav>
            <div className="mt-auto">
              <p className="text-xs text-[#B0A89F]" style={{ fontFamily: "var(--font-body, sans-serif)" }}>
                Free shipping · 7-day returns · COD available
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showModal && (
        <AdminLoginModal onClose={() => setShowModal(false)} onSuccess={() => setIsAdmin(true)} />
      )}
    </>
  );
}
