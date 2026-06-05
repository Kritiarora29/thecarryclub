"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart } from "@/lib/cartActions";
import { toggleWishlist } from "@/lib/wishlistActions";
import { trackConversion } from "@/lib/analytics";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  Shield, Truck, RotateCcw, Star, ChevronLeft, ChevronRight,
  Check, Heart, ShoppingBag, CreditCard, Tag, ArrowRight,
} from "lucide-react";

// ── Data ───────────────────────────────────────────────────────────────────────

const COLORS = [
  {
    id: "black",
    name: "Midnight Black",
    hex: "#1C1C1C",
    border: "#1C1C1C",
    images: [
      "/Iwallet - Images/Prod image- desk-Black/2-Black.jpg",
      "/Iwallet - Images/Prod image- desk-Black/3-Black.jpg",
      "/Iwallet - Images/Prod image- desk-Black/4-black.jpg",
      "/Iwallet - Images/Prod image- desk-Black/5-black.jpg",
      "/Iwallet - Images/Prod image- desk-Black/6-black.jpg",
      "/Iwallet - Images/Black wit box.png",
    ],
    slug: "premium-iwallet-black",
  },
  {
    id: "space-grey",
    name: "Space Grey",
    hex: "#8E9196",
    border: "#8E9196",
    images: [
      "/Iwallet - Images/Prod image-desk-grey/4.png",
      "/Iwallet - Images/Prod image-desk-grey/1.png",
      "/Iwallet - Images/Prod image-desk-grey/2.png",
      "/Iwallet - Images/Prod image-desk-grey/3.png",
      "/Iwallet - Images/Grey with box_.png",
    ],
    slug: "premium-iwallet-space-grey",
  },
  {
    id: "white",
    name: "Pearl White",
    hex: "#EDE8DF",
    border: "#C8C0B4",
    images: [
      "/Iwallet - Images/Prod image- desk -White/3-white.jpg",
      "/Iwallet - Images/Prod image- desk -White/5-white(1).jpg",
      "/Iwallet - Images/Prod image- desk -White/6-white.jpg",
      "/Iwallet - Images/Prod image- desk -White/1-white.jpg",
      "/Iwallet - Images/White with box_.png",
    ],
    slug: "premium-iwallet-white",
  },
];

const FEATURES = [
  {
    num: "01",
    title: "Holds 8+ Cards",
    desc: "Every card you carry, organized and accessible. No more bulging billfolds.",
  },
  {
    num: "02",
    title: "Ultra Slim — 6mm",
    desc: "Thinner than your smartphone. Slides right into your front pocket.",
  },
  {
    num: "03",
    title: "RFID Blocking",
    desc: "Built-in protection shields your cards from unwanted contactless scanning.",
  },
  {
    num: "04",
    title: "Premium Vegan Leather",
    desc: "Cruelty-free, soft-touch material that develops a beautiful patina over time.",
  },
];

const MARQUEE_ITEMS = [
  "FREE SHIPPING PAN INDIA", "7-DAY EASY RETURNS", "RFID PROTECTION",
  "VEGAN LEATHER", "CASH ON DELIVERY", "100+ HAPPY CUSTOMERS",
  "6MM SLIM PROFILE", "HOLDS 8+ CARDS",
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function PremiumLanding({ products = [], wishlist = [] }: any) {
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [imageIndex, setImageIndex] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ name: "", text: "", stars: 5 });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const avgRating = reviews.length
    ? (reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1)
    : "4.9";

  useEffect(() => {
    fetch("/api/reviews").then(r => r.json()).then(setReviews).catch(() => {});
  }, []);

  useEffect(() => {
    setImageIndex(0);
    const product = products.find((p: any) => p.slug?.current === selectedColor.slug);
    if (product) setIsInWishlist(wishlist.some((w: any) => w.slug === product.slug?.current));
  }, [selectedColor, products, wishlist]);

  const productSlug =
    products.find((p: any) => p.slug?.current?.includes(selectedColor.id))?.slug?.current ||
    selectedColor.slug;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(productSlug);
      trackConversion({ event_name: "add_to_cart", value: 1399, currency: "INR", content_ids: [productSlug] });
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    setIsAddingToCart(true);
    try {
      await addToCart(productSlug);
      trackConversion({ event_name: "add_to_cart", value: 1399, currency: "INR", content_ids: [productSlug] });
      window.location.href = "/cart";
    } catch {
      toast.error("Failed");
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    await toggleWishlist(productSlug);
    setIsInWishlist(!isInWishlist);
    toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    });
    if (res.ok) {
      const added = await res.json();
      setReviews([added, ...reviews]);
      setNewReview({ name: "", text: "", stars: 5 });
      setShowReviewForm(false);
      toast.success("Review submitted!");
    }
  };

  const images = selectedColor.images;
  const prevImage = () => setImageIndex(i => (i - 1 + images.length) % images.length);
  const nextImage = () => setImageIndex(i => (i + 1) % images.length);

  return (
    <div className="tcc-root">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="tcc-hero-section">
        <div className="tcc-container tcc-hero-grid">

          {/* LEFT: Image gallery */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="tcc-gallery"
          >
            {/* Main image */}
            <div className="tcc-main-img-wrap group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${selectedColor.id}-${imageIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  src={images[imageIndex]}
                  alt={`Premium iWallet — ${selectedColor.name}`}
                  className="tcc-main-img"
                />
              </AnimatePresence>

              {/* Badges */}
              <div className="tcc-badge-row">
                <span className="tcc-badge-sale">Best Seller</span>
              </div>

              {/* Arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="tcc-arrow tcc-arrow-left opacity-0 group-hover:opacity-100">
                    <ChevronLeft size={16} strokeWidth={2.5} />
                  </button>
                  <button onClick={nextImage} className="tcc-arrow tcc-arrow-right opacity-0 group-hover:opacity-100">
                    <ChevronRight size={16} strokeWidth={2.5} />
                  </button>
                </>
              )}

              {/* Dot nav */}
              <div className="tcc-dot-nav">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIndex(i)}
                    className={`tcc-dot ${i === imageIndex ? "tcc-dot-active" : ""}`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="tcc-thumbs">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className={`tcc-thumb ${i === imageIndex ? "tcc-thumb-active" : ""}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: Product info */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
            className="tcc-product-info"
          >
            {/* Brand + Stars */}
            <div>
              <p className="tcc-brand-tag">theCarryClub · Premium Collection</p>
              <button
                onClick={() => reviewsRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="tcc-stars-row"
              >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="tcc-review-count">{avgRating} · {reviews.length || "100+"} reviews</span>
              </button>
            </div>

            {/* Title */}
            <div>
              <h1 className="tcc-h1">
                The Wallet<br />
                <span className="tcc-h1-accent">Reimagined.</span>
              </h1>
              <p className="tcc-tagline">
                Ultra-slim vegan leather. 8+ cards. Fits every pocket.
              </p>
            </div>

            {/* Price */}
            <div className="tcc-price-row">
              <span className="tcc-price-current">₹1,399</span>
              <span className="tcc-price-original">₹1,599</span>
              <span className="tcc-price-badge">₹200 off</span>
            </div>

            <div className="tcc-divider" />

            {/* Color picker */}
            <div>
              <p className="tcc-label">
                Colour — <strong className="tcc-label-value">{selectedColor.name}</strong>
              </p>
              <div className="tcc-color-row">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c)}
                    title={c.name}
                    style={{ backgroundColor: c.hex, borderColor: selectedColor.id === c.id ? "#1A1A1A" : c.border }}
                    className={`tcc-color-swatch ${selectedColor.id === c.id ? "tcc-color-active" : ""}`}
                  />
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="tcc-cta-stack">
              <button
                onClick={handleBuyNow}
                disabled={isAddingToCart}
                className="tcc-btn-primary"
              >
                {isAddingToCart ? "Adding to cart…" : "Buy Now — ₹1,399"}
              </button>
              <div className="tcc-cta-row2">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="tcc-btn-secondary"
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>
                <button
                  onClick={handleWishlist}
                  className={`tcc-btn-wish ${isInWishlist ? "tcc-btn-wish-active" : ""}`}
                >
                  <Heart size={17} className={isInWishlist ? "fill-[#E63356]" : ""} />
                </button>
              </div>
            </div>

            {/* Trust grid */}
            <div className="tcc-trust-grid">
              {[
                { icon: <Truck size={14} />,     text: "Free Shipping Pan India" },
                { icon: <RotateCcw size={14} />, text: "7-Day Easy Returns" },
                { icon: <Shield size={14} />,    text: "Razorpay Secure Checkout" },
                { icon: <CreditCard size={14} />, text: "Cash on Delivery" },
              ].map((b, i) => (
                <div key={i} className="tcc-trust-item">
                  <span className="tcc-trust-icon">{b.icon}</span>
                  <span className="tcc-trust-text">{b.text}</span>
                </div>
              ))}
            </div>

            {/* Coupon hint */}
            <div className="tcc-coupon-bar">
              <Tag size={14} className="text-[#B5540F] shrink-0" />
              <p className="tcc-coupon-text">
                Use coupon <strong>SAVE400</strong> at checkout and pay just <strong>₹999</strong>
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────────────── */}
      <div className="tcc-marquee-wrap">
        <div className="tcc-marquee tcc-marquee-run">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
            <span key={i} className="tcc-marquee-item">
              <span className="tcc-marquee-dot">◆</span>{t}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ─────────────────────────────────────────────────────────── */}
      <section className="tcc-section tcc-bg-warm">
        <div className="tcc-container">
          <div className="tcc-section-header">
            <p className="tcc-eyebrow">Why iWallet</p>
            <h2 className="tcc-h2">Designed for how<br />you actually live.</h2>
          </div>
          <div className="tcc-features-grid">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45 }}
                className="tcc-feature-card"
              >
                <span className="tcc-feature-num">{f.num}</span>
                <h3 className="tcc-feature-title">{f.title}</h3>
                <p className="tcc-feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIFESTYLE SPLIT ──────────────────────────────────────────────────── */}
      <section className="tcc-section tcc-bg-white">
        <div className="tcc-container tcc-split-grid">
          {/* Image mosaic */}
          <div className="tcc-mosaic">
            <div className="tcc-mosaic-tall">
              <img src={COLORS[0].images[0]} alt="iWallet Black" className="w-full h-full object-cover" />
            </div>
            <div className="tcc-mosaic-right">
              <div className="tcc-mosaic-sq">
                <img src={COLORS[1].images[0]} alt="iWallet Grey" className="w-full h-full object-cover" />
              </div>
              <div className="tcc-mosaic-sq">
                <img src={COLORS[2].images[0]} alt="iWallet White" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="tcc-split-text">
            <p className="tcc-eyebrow">The iWallet Difference</p>
            <h2 className="tcc-h2">
              Everything you need.<br />
              <span className="tcc-accent">Nothing you don&apos;t.</span>
            </h2>
            <div className="tcc-check-list">
              {[
                "Fits 8+ cards in a 6mm slim silhouette",
                "Premium vegan leather that ages beautifully",
                "RFID blocking built into every wallet",
                "Available in 3 exclusive colourways",
                "Designed in India, made for the world",
              ].map((item, i) => (
                <div key={i} className="tcc-check-item">
                  <span className="tcc-check-icon"><Check size={10} strokeWidth={3} /></span>
                  <span className="tcc-check-text">{item}</span>
                </div>
              ))}
            </div>
            <button onClick={handleBuyNow} disabled={isAddingToCart} className="tcc-btn-primary tcc-btn-inline">
              Shop Now — ₹1,399
            </button>
          </div>
        </div>
      </section>

      {/* ── OFFER BANNER ─────────────────────────────────────────────────────── */}
      <section className="tcc-offer-section">
        <div className="tcc-offer-inner">
          <p className="tcc-offer-eyebrow">Limited Time Offer</p>
          <h2 className="tcc-offer-h2">
            Get it for just <span className="tcc-offer-price">₹999</span>
          </h2>
          <p className="tcc-offer-sub">
            Apply coupon <strong className="tcc-offer-code">SAVE400</strong> at checkout · Save ₹400 instantly
          </p>
          <Link href="/cart" className="tcc-offer-btn">
            Claim Your Discount <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────────────────────────────────── */}
      <section ref={reviewsRef} className="tcc-section tcc-bg-warm">
        <div className="tcc-container">
          <div className="tcc-reviews-header">
            <div>
              <p className="tcc-eyebrow">Customer Reviews</p>
              <h2 className="tcc-h2">What customers say</h2>
              <div className="tcc-avg-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                ))}
                <span className="tcc-avg-text">{avgRating} average · {reviews.length || "100+"} reviews</span>
              </div>
            </div>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="tcc-btn-outline"
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </button>
          </div>

          {/* Review form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleReviewSubmit}
                className="tcc-review-form overflow-hidden"
              >
                <h3 className="tcc-review-form-title">Share your experience</h3>
                <div className="tcc-review-form-row">
                  <input
                    required
                    placeholder="Your name"
                    value={newReview.name}
                    onChange={e => setNewReview({ ...newReview, name: e.target.value })}
                    className="tcc-input"
                  />
                  <div className="tcc-star-picker">
                    <span className="tcc-star-label">Rating:</span>
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" onClick={() => setNewReview({ ...newReview, stars: s })}>
                        <Star size={20} className={s <= newReview.stars ? "fill-amber-400 text-amber-400" : "text-[#DDD8D0]"} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us about your experience…"
                  value={newReview.text}
                  onChange={e => setNewReview({ ...newReview, text: e.target.value })}
                  className="tcc-input tcc-textarea"
                />
                <button type="submit" className="tcc-btn-primary tcc-btn-inline">
                  Submit Review
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Reviews grid */}
          {reviews.length === 0 ? (
            <p className="tcc-no-reviews">No reviews yet — be the first to share your experience!</p>
          ) : (
            <div className="tcc-reviews-grid">
              {reviews.slice(0, 9).map((r: any, i: number) => (
                <motion.div
                  key={r._id || i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="tcc-review-card"
                >
                  <div className="tcc-review-stars">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={12} className={j < r.stars ? "fill-amber-400 text-amber-400" : "text-[#DDD8D0]"} />
                    ))}
                  </div>
                  <p className="tcc-review-text">&ldquo;{r.text}&rdquo;</p>
                  <div className="tcc-review-author">
                    <div className="tcc-review-avatar">
                      {r.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="tcc-review-name">{r.name}</p>
                      <span className="tcc-verified">
                        <Check size={9} strokeWidth={3} /> Verified Purchase
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="tcc-cta-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="tcc-cta-inner"
        >
          <p className="tcc-eyebrow tcc-eyebrow-light">Ready to upgrade?</p>
          <h2 className="tcc-cta-h2">
            Carry less.<br />
            <span className="tcc-cta-accent">Live more.</span>
          </h2>
          <p className="tcc-cta-sub">
            Join 100+ customers who&apos;ve ditched their bulky wallets.
          </p>
          <Link href="/buy" className="tcc-cta-btn">
            Shop the Collection <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ── STYLES ───────────────────────────────────────────────────────────── */}
      <style jsx global>{`
        :root {
          --tcc-bg: #FAF9F7;
          --tcc-warm: #F2EDE6;
          --tcc-white: #FFFFFF;
          --tcc-black: #1A1A1A;
          --tcc-gray: #7A736E;
          --tcc-light: #B0A89F;
          --tcc-border: #E3DDD6;
          --tcc-accent: #B45309;
          --tcc-accent-light: #FEF3C7;
          --tcc-offer-bg: #111111;
          --ff-display: var(--font-display, 'Playfair Display', Georgia, serif);
          --ff-body: var(--font-body, 'Inter', -apple-system, sans-serif);
        }

        .tcc-root { background: var(--tcc-bg); font-family: var(--ff-body); color: var(--tcc-black); }

        /* Layout */
        .tcc-container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
        @media (min-width: 768px) { .tcc-container { padding: 0 3rem; } }

        .tcc-section { padding: 5rem 0; }
        @media (min-width: 768px) { .tcc-section { padding: 7rem 0; } }
        .tcc-bg-warm { background: var(--tcc-warm); }
        .tcc-bg-white { background: var(--tcc-white); }

        /* Hero */
        .tcc-hero-section {
          min-height: 100svh;
          display: flex;
          align-items: center;
          background: var(--tcc-bg);
          padding-top: 5rem;
        }
        .tcc-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          padding-top: 2rem;
          padding-bottom: 3rem;
        }
        @media (min-width: 1024px) {
          .tcc-hero-grid {
            grid-template-columns: 1fr 1fr;
            gap: 5rem;
            padding-top: 2rem;
            padding-bottom: 4rem;
            align-items: center;
          }
        }

        /* Gallery */
        .tcc-gallery { display: flex; flex-direction: column; gap: 0.75rem; }
        .tcc-main-img-wrap {
          position: relative;
          background: var(--tcc-warm);
          border-radius: 1.25rem;
          overflow: hidden;
          aspect-ratio: 4/5;
        }
        .tcc-main-img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .tcc-badge-row { position: absolute; top: 1rem; left: 1rem; display: flex; gap: 0.5rem; }
        .tcc-badge-sale {
          background: var(--tcc-accent);
          color: #fff;
          font-size: 0.625rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
        }

        .tcc-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 2.25rem;
          height: 2.25rem;
          background: #fff;
          border-radius: 50%;
          box-shadow: 0 2px 12px rgba(0,0,0,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          z-index: 10;
        }
        .tcc-arrow:hover { background: var(--tcc-black); color: #fff; }
        .tcc-arrow-left { left: 0.75rem; }
        .tcc-arrow-right { right: 0.75rem; }

        .tcc-dot-nav {
          position: absolute;
          bottom: 0.875rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
          z-index: 10;
        }
        .tcc-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          transition: all 0.2s;
          border: none;
          padding: 0;
        }
        .tcc-dot-active { background: #fff; width: 18px; border-radius: 3px; }

        .tcc-thumbs { display: flex; gap: 0.5rem; }
        .tcc-thumb {
          flex: 1;
          aspect-ratio: 1;
          border-radius: 0.625rem;
          overflow: hidden;
          border: 2px solid transparent;
          transition: all 0.2s;
          opacity: 0.45;
          background: var(--tcc-warm);
        }
        .tcc-thumb:hover { opacity: 0.75; }
        .tcc-thumb-active { border-color: var(--tcc-black); opacity: 1; }

        /* Product info */
        .tcc-product-info { display: flex; flex-direction: column; gap: 1.5rem; }

        .tcc-brand-tag {
          font-size: 0.6875rem;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: var(--tcc-light);
          font-weight: 500;
          margin-bottom: 0.625rem;
        }

        .tcc-stars-row {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }
        .tcc-review-count {
          font-size: 0.8125rem;
          color: var(--tcc-gray);
          transition: color 0.15s;
        }
        .tcc-stars-row:hover .tcc-review-count { color: var(--tcc-black); }

        .tcc-h1 {
          font-family: var(--ff-display);
          font-size: clamp(2.4rem, 5vw, 3.5rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.025em;
          color: var(--tcc-black);
          margin-bottom: 0.75rem;
        }
        .tcc-h1-accent { color: var(--tcc-accent); font-style: italic; }
        .tcc-tagline { font-size: 1rem; color: var(--tcc-gray); line-height: 1.55; }

        .tcc-price-row { display: flex; align-items: baseline; gap: 0.875rem; flex-wrap: wrap; }
        .tcc-price-current { font-size: 1.875rem; font-weight: 600; color: var(--tcc-black); }
        .tcc-price-original { font-size: 1.125rem; color: var(--tcc-light); text-decoration: line-through; }
        .tcc-price-badge {
          font-size: 0.8125rem;
          font-weight: 600;
          background: var(--tcc-accent-light);
          color: var(--tcc-accent);
          padding: 0.25rem 0.625rem;
          border-radius: 999px;
        }

        .tcc-divider { height: 1px; background: var(--tcc-border); }

        .tcc-label { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.18em; color: var(--tcc-light); font-weight: 500; margin-bottom: 0.75rem; }
        .tcc-label-value { color: var(--tcc-black); font-weight: 600; }

        .tcc-color-row { display: flex; gap: 0.75rem; }
        .tcc-color-swatch {
          width: 2.25rem; height: 2.25rem;
          border-radius: 50%;
          border-width: 2px;
          border-style: solid;
          transition: all 0.2s;
          outline: none;
        }
        .tcc-color-active { transform: scale(1.15); box-shadow: 0 0 0 3px #fff, 0 0 0 5px var(--tcc-black); }

        .tcc-cta-stack { display: flex; flex-direction: column; gap: 0.625rem; }
        .tcc-cta-row2 { display: flex; gap: 0.625rem; }

        .tcc-btn-primary {
          width: 100%;
          padding: 1rem 1.5rem;
          background: var(--tcc-black);
          color: #fff;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          border-radius: 0.75rem;
          border: none;
          cursor: pointer;
          transition: background 0.22s;
        }
        .tcc-btn-primary:hover:not(:disabled) { background: var(--tcc-accent); }
        .tcc-btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
        .tcc-btn-inline { width: auto; display: inline-flex; align-items: center; gap: 0.5rem; }

        .tcc-btn-secondary {
          flex: 1;
          padding: 0.875rem 1rem;
          background: transparent;
          border: 1.5px solid var(--tcc-black);
          color: var(--tcc-black);
          font-size: 0.8125rem;
          font-weight: 600;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .tcc-btn-secondary:hover:not(:disabled) { background: var(--tcc-black); color: #fff; }

        .tcc-btn-wish {
          width: 3.25rem;
          height: 3.25rem;
          border-radius: 0.75rem;
          border: 1.5px solid var(--tcc-border);
          background: transparent;
          color: var(--tcc-light);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          shrink: 0;
        }
        .tcc-btn-wish:hover { border-color: var(--tcc-accent); color: var(--tcc-accent); }
        .tcc-btn-wish-active { border-color: var(--tcc-accent); background: var(--tcc-accent-light); color: var(--tcc-accent); }

        .tcc-trust-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.625rem; }
        .tcc-trust-item { display: flex; align-items: center; gap: 0.5rem; }
        .tcc-trust-icon { color: var(--tcc-black); flex-shrink: 0; }
        .tcc-trust-text { font-size: 0.75rem; font-weight: 500; color: var(--tcc-gray); }

        .tcc-coupon-bar {
          display: flex;
          align-items: flex-start;
          gap: 0.625rem;
          background: #FFF8EE;
          border: 1px solid #F5E4C0;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
        }
        .tcc-coupon-text { font-size: 0.8125rem; color: #7A5520; line-height: 1.4; }

        /* Marquee */
        .tcc-marquee-wrap {
          background: var(--tcc-black);
          overflow: hidden;
          padding: 0.875rem 0;
          border-top: 1px solid #2A2A2A;
          border-bottom: 1px solid #2A2A2A;
        }
        .tcc-marquee { display: flex; gap: 3rem; white-space: nowrap; }
        .tcc-marquee-item { color: #F5F3F0; font-size: 0.6875rem; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase; display: flex; align-items: center; gap: 0.875rem; }
        .tcc-marquee-dot { color: var(--tcc-accent); font-size: 0.5rem; }

        /* Section headers */
        .tcc-section-header { max-width: 38rem; margin-bottom: 3.5rem; }
        .tcc-eyebrow {
          font-size: 0.6875rem;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: var(--tcc-light);
          font-weight: 500;
          margin-bottom: 0.875rem;
          display: block;
        }
        .tcc-eyebrow-light { color: rgba(255,255,255,0.45); }
        .tcc-h2 {
          font-family: var(--ff-display);
          font-size: clamp(1.875rem, 4vw, 2.75rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--tcc-black);
        }
        .tcc-accent { color: var(--tcc-accent); }

        /* Features */
        .tcc-features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (min-width: 1024px) { .tcc-features-grid { grid-template-columns: repeat(4, 1fr); } }

        .tcc-feature-card {
          background: var(--tcc-white);
          border: 1px solid var(--tcc-border);
          border-radius: 1rem;
          padding: 1.75rem 1.5rem;
          transition: all 0.2s;
        }
        .tcc-feature-card:hover { border-color: var(--tcc-black); box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
        .tcc-feature-num { font-size: 0.6875rem; font-weight: 600; color: var(--tcc-accent); letter-spacing: 0.1em; display: block; margin-bottom: 1rem; }
        .tcc-feature-title { font-size: 1rem; font-weight: 600; color: var(--tcc-black); margin-bottom: 0.5rem; }
        .tcc-feature-desc { font-size: 0.875rem; color: var(--tcc-gray); line-height: 1.6; }

        /* Lifestyle split */
        .tcc-split-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
        }
        @media (min-width: 1024px) { .tcc-split-grid { grid-template-columns: 1fr 1fr; gap: 5rem; } }

        .tcc-mosaic { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        .tcc-mosaic-tall { border-radius: 1rem; overflow: hidden; aspect-ratio: 2/3; background: var(--tcc-warm); grid-row: span 2; }
        .tcc-mosaic-right { display: flex; flex-direction: column; gap: 0.75rem; }
        .tcc-mosaic-sq { border-radius: 1rem; overflow: hidden; aspect-ratio: 1; background: var(--tcc-warm); }
        .tcc-mosaic-tall img, .tcc-mosaic-sq img { width: 100%; height: 100%; object-fit: cover; }

        .tcc-split-text { display: flex; flex-direction: column; gap: 1.75rem; }
        .tcc-check-list { display: flex; flex-direction: column; gap: 0.875rem; }
        .tcc-check-item { display: flex; align-items: flex-start; gap: 0.75rem; }
        .tcc-check-icon {
          width: 1.25rem; height: 1.25rem;
          border-radius: 50%;
          background: var(--tcc-accent);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 0.125rem;
        }
        .tcc-check-text { font-size: 0.9375rem; color: #4A4440; line-height: 1.5; }

        /* Offer */
        .tcc-offer-section { background: var(--tcc-offer-bg); padding: 5rem 1.5rem; text-align: center; }
        .tcc-offer-inner { max-width: 40rem; margin: 0 auto; }
        .tcc-offer-eyebrow { font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.25em; color: var(--tcc-accent); font-weight: 500; display: block; margin-bottom: 1.25rem; }
        .tcc-offer-h2 {
          font-family: var(--ff-display);
          font-size: clamp(2.25rem, 6vw, 4rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.025em;
          color: #fff;
          margin-bottom: 1rem;
        }
        .tcc-offer-price { color: var(--tcc-accent); }
        .tcc-offer-sub { font-size: 1rem; color: #888; margin-bottom: 2.5rem; }
        .tcc-offer-code { color: #fff; }
        .tcc-offer-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--tcc-accent);
          color: #fff;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-size: 0.9375rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .tcc-offer-btn:hover { background: #fff; color: var(--tcc-black); }
        .tcc-cta-btn:hover { background: #fff; color: var(--tcc-black); }

        /* Reviews */
        .tcc-reviews-header {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }
        @media (min-width: 768px) {
          .tcc-reviews-header { flex-direction: row; align-items: flex-end; justify-content: space-between; }
        }

        .tcc-avg-row { display: flex; align-items: center; gap: 0.375rem; margin-top: 0.75rem; }
        .tcc-avg-text { font-size: 0.875rem; color: var(--tcc-gray); margin-left: 0.25rem; }

        .tcc-btn-outline {
          padding: 0.625rem 1.25rem;
          border: 1.5px solid var(--tcc-black);
          color: var(--tcc-black);
          font-size: 0.8125rem;
          font-weight: 600;
          border-radius: 0.625rem;
          background: transparent;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .tcc-btn-outline:hover { background: var(--tcc-black); color: #fff; }

        .tcc-review-form {
          background: var(--tcc-white);
          border: 1px solid var(--tcc-border);
          border-radius: 1rem;
          padding: 1.75rem;
          margin-bottom: 2.5rem;
        }
        .tcc-review-form-title { font-size: 1.0625rem; font-weight: 600; color: var(--tcc-black); margin-bottom: 1.25rem; }
        .tcc-review-form-row { display: grid; grid-template-columns: 1fr; gap: 0.75rem; margin-bottom: 0.75rem; }
        @media (min-width: 640px) { .tcc-review-form-row { grid-template-columns: 1fr 1fr; } }

        .tcc-input {
          width: 100%;
          background: var(--tcc-warm);
          border: 1px solid var(--tcc-border);
          border-radius: 0.625rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          outline: none;
          color: var(--tcc-black);
          font-family: var(--ff-body);
          transition: border-color 0.15s;
        }
        .tcc-input:focus { border-color: var(--tcc-black); }
        .tcc-textarea { resize: none; min-height: 6rem; }

        .tcc-star-picker {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: var(--tcc-warm);
          border: 1px solid var(--tcc-border);
          border-radius: 0.625rem;
          padding: 0.625rem 1rem;
        }
        .tcc-star-label { font-size: 0.75rem; color: var(--tcc-gray); margin-right: 0.25rem; }

        .tcc-no-reviews { text-align: center; padding: 4rem 0; color: var(--tcc-light); font-size: 0.9375rem; }

        .tcc-reviews-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 640px) { .tcc-reviews-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .tcc-reviews-grid { grid-template-columns: repeat(3, 1fr); } }

        .tcc-review-card {
          background: var(--tcc-white);
          border: 1px solid var(--tcc-border);
          border-radius: 1rem;
          padding: 1.5rem;
          transition: box-shadow 0.2s;
        }
        .tcc-review-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .tcc-review-stars { display: flex; gap: 2px; margin-bottom: 0.875rem; }
        .tcc-review-text {
          font-size: 0.9375rem;
          color: #4A4440;
          line-height: 1.6;
          margin-bottom: 1.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .tcc-review-author { display: flex; align-items: center; gap: 0.75rem; padding-top: 1rem; border-top: 1px solid #F2EDE6; }
        .tcc-review-avatar {
          width: 2rem; height: 2rem;
          border-radius: 50%;
          background: var(--tcc-black);
          color: #fff;
          font-size: 0.75rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .tcc-review-name { font-size: 0.875rem; font-weight: 600; color: var(--tcc-black); }
        .tcc-verified { display: flex; align-items: center; gap: 3px; font-size: 0.6875rem; color: #2D9A5A; font-weight: 500; margin-top: 1px; }

        /* Final CTA */
        .tcc-cta-section { background: var(--tcc-black); padding: 6rem 1.5rem; text-align: center; }
        .tcc-cta-inner { max-width: 36rem; margin: 0 auto; }
        .tcc-cta-h2 {
          font-family: var(--ff-display);
          font-size: clamp(2.25rem, 5.5vw, 3.5rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.025em;
          color: #fff;
          margin: 1.25rem 0;
        }
        .tcc-cta-accent { color: var(--tcc-accent); font-style: italic; }
        .tcc-cta-sub { font-size: 1rem; color: #888; margin-bottom: 2.5rem; }
        .tcc-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--tcc-accent);
          color: #fff;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-size: 0.9375rem;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .tcc-cta-btn:hover { background: #fff; color: var(--tcc-black); }

        /* marquee animation lives in globals.css as .tcc-marquee-run */
      `}</style>
    </div>
  );
}
