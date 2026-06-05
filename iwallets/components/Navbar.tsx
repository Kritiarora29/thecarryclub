"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminLoginModal from "@/components/AdminLoginModal";
import { Menu, X, ShoppingBag, User, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TAPES = [
  "FREE SHIPPING PAN INDIA · ALL ORDERS",
  "USE CODE SAVE400 · PAY JUST ₹999",
  "7-DAY EASY RETURNS · NO QUESTIONS ASKED",
  "CASH ON DELIVERY AVAILABLE",
];

export default function Navbar() {
  const [isAdmin, setIsAdmin]             = useState(false);
  const [showModal, setShowModal]         = useState(false);
  const [isOpen, setIsOpen]               = useState(false);
  const [cartCount, setCartCount]         = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [scrolled, setScrolled]           = useState(false);
  const [tapeIdx, setTapeIdx]             = useState(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setTapeIdx(p => (p + 1) % TAPES.length), 4000);
    return () => clearInterval(id);
  }, []);

  const updateCart = async () => {
    try { const d = await fetch("/api/cart-count").then(r => r.json()); setCartCount(d.count); }
    catch { setCartCount(0); }
  };
  const updateWishlist = () => {
    try {
      const m = document.cookie.split("; ").find(r => r.startsWith("wishlist="));
      setWishlistCount(m ? JSON.parse(decodeURIComponent(m.split("=")[1])).length : 0);
    } catch { setWishlistCount(0); }
  };

  useEffect(() => {
    fetch("/api/admin-check").then(r => r.json()).then(d => setIsAdmin(d.authenticated));
    updateCart(); updateWishlist();
    const id = setInterval(() => { updateCart(); updateWishlist(); }, 3000);
    return () => clearInterval(id);
  }, []);

  const logout = async () => {
    await fetch("/api/admin-logout", { method: "POST" });
    setIsAdmin(false);
  };

  const NAV = [
    { label: "Home",  href: "/" },
    { label: "Shop",  href: "/buy" },
    { label: "About", href: "/about" },
    { label: "FAQs",  href: "/faqs" },
  ];

  return (
    <>
      <header className="nb-root">

        {/* ── Announcement tape ─────────────────────────────────── */}
        <div className="nb-tape">
          <AnimatePresence mode="wait">
            <motion.span
              key={tapeIdx}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="nb-tape-text"
            >
              {TAPES[tapeIdx]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* ── Main bar ──────────────────────────────────────────── */}
        <nav className={`nb-nav ${scrolled ? "nb-nav--scrolled" : ""}`}>
          <div className="nb-inner">

            {/* Left: nav links */}
            <div className="nb-left">
              {NAV.map(n => (
                <Link key={n.label} href={n.href} className="nb-link">{n.label}</Link>
              ))}
            </div>

            {/* Center: logo */}
            <Link href="/" className="nb-logo">
              theCarryClub<span className="nb-logo-dot">.</span>
            </Link>

            {/* Right: icons */}
            <div className="nb-right">
              <button className="nb-icon" onClick={isAdmin ? logout : () => setShowModal(true)} title={isAdmin ? "Logout" : "Login"}>
                <User size={18} strokeWidth={1.5} />
              </button>

              <Link href="/wishlist" className="nb-icon nb-icon--desktop">
                <Heart size={18} strokeWidth={1.5} />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="nb-badge">
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <Link href="/cart" className="nb-icon nb-cart">
                <ShoppingBag size={18} strokeWidth={1.5} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="nb-badge">
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <button className="nb-icon nb-ham" onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
                {isOpen ? <X size={21} strokeWidth={1.5} /> : <Menu size={21} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Mobile menu ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="nb-drawer"
          >
            {NAV.map((n, i) => (
              <motion.div key={n.label} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={n.href} onClick={() => setIsOpen(false)} className="nb-drawer-link">{n.label}</Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Link href="/wishlist" onClick={() => setIsOpen(false)} className="nb-drawer-link nb-drawer-accent">Wishlist</Link>
            </motion.div>
            <p className="nb-drawer-sub">Free shipping · 7-day returns · COD available</p>
          </motion.div>
        )}
      </AnimatePresence>

      {showModal && <AdminLoginModal onClose={() => setShowModal(false)} onSuccess={() => setIsAdmin(true)} />}

      <style jsx global>{`
        :root {
          --nb-tape-h: 34px;
          --nb-bar-h:  68px;
          --nb-h:      calc(var(--nb-tape-h) + var(--nb-bar-h));
          --ff:        "Replica", ui-sans-serif, system-ui, sans-serif;
        }

        /* ── Tape ───────────────────────────────────────────────── */
        .nb-root {
          position: fixed;
          top: 0; left: 0;
          width: 100%;
          z-index: 100;
        }

        .nb-tape {
          height: var(--nb-tape-h);
          background: #111111;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        .nb-tape-text {
          font-family: var(--ff);
          font-size: 0.625rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #E0DDD8;
          text-transform: uppercase;
          position: absolute;
          white-space: nowrap;
        }

        /* ── Nav bar ─────────────────────────────────────────────── */
        .nb-nav {
          height: var(--nb-bar-h);
          background: #FFFFFF;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .nb-nav--scrolled {
          border-bottom-color: #E5E2DC;
          box-shadow: 0 1px 16px rgba(0,0,0,0.06);
        }

        .nb-inner {
          max-width: 1280px;
          margin: 0 auto;
          height: 100%;
          padding: 0 1.5rem;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 1rem;
        }
        @media (min-width: 768px)  { .nb-inner { padding: 0 2.5rem; } }
        @media (min-width: 1280px) { .nb-inner { padding: 0 3rem; } }

        /* Left nav */
        .nb-left {
          display: none;
          align-items: center;
          gap: 2rem;
          justify-self: start;
        }
        @media (min-width: 768px) { .nb-left { display: flex; } }

        .nb-link {
          font-family: var(--ff);
          font-size: 0.8125rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: #5A534E;
          text-decoration: none;
          transition: color 0.15s;
          position: relative;
        }
        .nb-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          height: 1.5px; width: 0;
          background: #B45309;
          transition: width 0.2s;
        }
        .nb-link:hover { color: #1A1A1A; }
        .nb-link:hover::after { width: 100%; }

        /* Center logo */
        .nb-logo {
          font-family: var(--ff);
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #1A1A1A;
          text-decoration: none;
          justify-self: center;
          white-space: nowrap;
        }
        @media (min-width: 768px) { .nb-logo { font-size: 1.4rem; } }
        .nb-logo-dot { color: #B45309; }

        /* Right icons */
        .nb-right {
          display: flex;
          align-items: center;
          gap: 1.125rem;
          justify-self: end;
        }
        @media (min-width: 768px) { .nb-right { gap: 1.375rem; } }

        .nb-icon {
          position: relative;
          display: flex;
          align-items: center;
          color: #5A534E;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          text-decoration: none;
          transition: color 0.15s;
        }
        .nb-icon:hover { color: #1A1A1A; }

        .nb-icon--desktop { display: none; }
        @media (min-width: 768px) { .nb-icon--desktop { display: flex; } }

        .nb-badge {
          position: absolute;
          top: -5px; right: -5px;
          width: 14px; height: 14px;
          background: #B45309;
          color: #fff;
          font-size: 7.5px;
          font-weight: 700;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--ff);
        }

        .nb-ham {
          display: flex;
        }
        @media (min-width: 768px) { .nb-ham { display: none; } }

        /* ── Mobile drawer ─────────────────────────────────────── */
        .nb-drawer {
          position: fixed;
          inset: 0;
          top: var(--nb-h);
          background: #FFFFFF;
          z-index: 99;
          padding: 2rem 2rem 3rem;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .nb-drawer-link {
          display: block;
          padding: 1.125rem 0;
          font-family: var(--ff);
          font-size: 1.5rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: #1A1A1A;
          text-decoration: none;
          border-bottom: 1px solid #EEEBE5;
          transition: color 0.15s;
        }
        .nb-drawer-link:hover { color: #B45309; }
        .nb-drawer-accent { color: #B45309; }

        .nb-drawer-sub {
          margin-top: auto;
          padding-top: 2rem;
          font-family: var(--ff);
          font-size: 0.75rem;
          color: #ADA49B;
          letter-spacing: 0.04em;
        }
      `}</style>
    </>
  );
}
