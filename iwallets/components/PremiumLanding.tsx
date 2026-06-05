"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart } from "@/lib/cartActions";
import { toggleWishlist } from "@/lib/wishlistActions";
import { trackConversion } from "@/lib/analytics";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  Truck, RotateCcw, Star, ChevronLeft, ChevronRight,
  Check, Heart, ShoppingBag, Tag, ArrowRight, Lock, Plus, Minus,
} from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────────────────

const COLORS = [
  {
    id: "black",
    name: "Midnight Black",
    hex: "#1C1C1C",
    border: "#555",
    slug: "premium-iwallet-black",
    images: [
      "/Iwallet - Images/Prod image- desk-Black/2-Black.jpg",
      "/Iwallet - Images/Prod image- desk-Black/3-Black.jpg",
      "/Iwallet - Images/Prod image- desk-Black/4-black.jpg",
      "/Iwallet - Images/Prod image- desk-Black/5-black.jpg",
      "/Iwallet - Images/Prod image- desk-Black/6-black.jpg",
    ],
  },
  {
    id: "space-grey",
    name: "Space Grey",
    hex: "#8E9196",
    border: "#8E9196",
    slug: "premium-iwallet-space-grey",
    images: [
      "/Iwallet - Images/Prod image-desk-grey/4.png",
      "/Iwallet - Images/Prod image-desk-grey/1.png",
      "/Iwallet - Images/Prod image-desk-grey/2.png",
      "/Iwallet - Images/Prod image-desk-grey/3.png",
    ],
  },
  {
    id: "white",
    name: "Pearl White",
    hex: "#EDE8DF",
    border: "#C8C0B4",
    slug: "premium-iwallet-white",
    images: [
      "/Iwallet - Images/Prod image- desk -White/3-white.jpg",
      "/Iwallet - Images/Prod image- desk -White/5-white(1).jpg",
      "/Iwallet - Images/Prod image- desk -White/6-white.jpg",
      "/Iwallet - Images/Prod image- desk -White/1-white.jpg",
    ],
  },
];

const SLIDES = [
  { color: COLORS[0], headline: ["The Smartest", "Wallet."], sub: "Ultra-slim vegan leather. Holds 8+ cards. Fits every pocket.", accent: "#B45309" },
  { color: COLORS[1], headline: ["Minimalist.", "Modern."],  sub: "Precision-crafted for those who carry with purpose.",         accent: "#9E9E9E" },
  { color: COLORS[2], headline: ["Premium Vegan", "Leather."], sub: "Cruelty-free, soft-touch, ages beautifully over time.",      accent: "#C8B89A" },
];

const FEATURES = [
  { num: "01", title: "Holds 8+ Cards",         desc: "Every card organized and accessible. No more bulging billfolds." },
  { num: "02", title: "Ultra Slim — 6mm",        desc: "Thinner than your smartphone. Slides right into your front pocket." },
  { num: "03", title: "RFID Blocking",           desc: "Built-in protection shields your cards from contactless scanning." },
  { num: "04", title: "Premium Vegan Leather",   desc: "Cruelty-free, soft-touch material that develops a beautiful patina." },
];

const MARQUEE = [
  "FREE SHIPPING PAN INDIA", "7-DAY EASY RETURNS", "RFID PROTECTION",
  "VEGAN LEATHER", "CASH ON DELIVERY", "100+ HAPPY CUSTOMERS",
  "6MM SLIM PROFILE", "HOLDS 8+ CARDS",
];

const TRUST = [
  { icon: <Truck size={20} strokeWidth={1.5} />,     title: "Free Shipping",   desc: "Pan India, all orders" },
  { icon: <Lock size={20} strokeWidth={1.5} />,      title: "RFID Blocking",   desc: "Built-in protection" },
  { icon: <RotateCcw size={20} strokeWidth={1.5} />, title: "7-Day Returns",   desc: "Easy & hassle-free" },
  { icon: <Star size={20} strokeWidth={1.5} />,      title: "4.9 / 5 Stars",   desc: "100+ verified reviews" },
];

// ─── Component ─────────────────────────────────────────────────────────────

export default function PremiumLanding({ products = [], wishlist = [] }: any) {
  const [slide, setSlide]               = useState(0);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [imgIdx, setImgIdx]             = useState(0);
  const [reviews, setReviews]           = useState<any[]>([]);
  const [newReview, setNewReview]       = useState({ name: "", text: "", stars: 5 });
  const [showForm, setShowForm]         = useState(false);
  const [busy, setBusy]                 = useState(false);
  const [inWishlist, setInWishlist]     = useState(false);
  const [activeF, setActiveF]           = useState(0);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const avg = reviews.length
    ? (reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1)
    : "4.9";

  // Slide auto-advance
  const resetTimer = useCallback(() => {
    if (slideTimer.current) clearInterval(slideTimer.current);
    slideTimer.current = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5500);
  }, []);

  useEffect(() => { resetTimer(); return () => { if (slideTimer.current) clearInterval(slideTimer.current); }; }, [resetTimer]);

  const goSlide = (n: number) => { setSlide(n); resetTimer(); };
  const prevSlide = () => goSlide((slide - 1 + SLIDES.length) % SLIDES.length);
  const nextSlide = () => goSlide((slide + 1) % SLIDES.length);

  useEffect(() => { fetch("/api/reviews").then(r => r.json()).then(setReviews).catch(() => {}); }, []);

  useEffect(() => {
    setImgIdx(0);
    const p = products.find((p: any) => p.slug?.current === selectedColor.slug);
    if (p) setInWishlist(wishlist.some((w: any) => w.slug === p.slug?.current));
  }, [selectedColor, products, wishlist]);

  const slug = products.find((p: any) => p.slug?.current?.includes(selectedColor.id))?.slug?.current || selectedColor.slug;

  const addCart = async () => {
    setBusy(true);
    try {
      await addToCart(slug);
      trackConversion({ event_name: "add_to_cart", value: 1399, currency: "INR", content_ids: [slug] });
      toast.success("Added to cart!");
    } catch { toast.error("Failed"); }
    finally { setBusy(false); }
  };

  const buyNow = async () => {
    setBusy(true);
    try {
      await addToCart(slug);
      trackConversion({ event_name: "add_to_cart", value: 1399, currency: "INR", content_ids: [slug] });
      window.location.href = "/cart";
    } catch { toast.error("Failed"); setBusy(false); }
  };

  const toggleWish = async () => {
    await toggleWishlist(slug);
    setInWishlist(!inWishlist);
    toast.success(inWishlist ? "Removed from wishlist" : "Saved to wishlist");
  };

  const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newReview.name || !newReview.text) return;
    const res = await fetch("/api/reviews", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    });
    if (res.ok) {
      const r = await res.json();
      setReviews([r, ...reviews]);
      setNewReview({ name: "", text: "", stars: 5 });
      setShowForm(false);
      toast.success("Review submitted!");
    }
  };

  const imgs = selectedColor.images;
  const curSlide = SLIDES[slide];

  return (
    <div className="lp">

      {/* ════════════════════════════════════════════════════════
          HERO — full-bleed image slider (Ekster-style)
      ════════════════════════════════════════════════════════ */}
      <section className="hero">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="hero-slide"
          >
            {/* Background image with dark overlay */}
            <div className="hero-bg">
              <img
                src={curSlide.color.images[0]}
                alt=""
                className="hero-bg-img"
              />
              <div className="hero-bg-overlay" />
            </div>

            {/* Content */}
            <div className="hero-content">
              {/* Left: text */}
              <div className="hero-text">
                <p className="hero-eyebrow">India&apos;s Premium iWallet</p>
                <h1 className="hero-h1">
                  {curSlide.headline[0]}<br />
                  <em className="hero-em" style={{ color: curSlide.accent }}>{curSlide.headline[1]}</em>
                </h1>
                <p className="hero-sub">{curSlide.sub}</p>

                {/* Stars */}
                <div className="hero-stars">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="star-fill" />)}
                  <span className="hero-stars-text">{avg} · {reviews.length || "100+"} reviews</span>
                </div>

                {/* Price */}
                <div className="hero-price-row">
                  <span className="hero-price">₹1,399</span>
                  <span className="hero-mrp">₹1,599</span>
                  <span className="hero-save">Save ₹200</span>
                </div>

                {/* CTAs */}
                <div className="hero-btns">
                  <button onClick={buyNow} disabled={busy} className="btn-white">
                    {busy ? "…" : "Shop Now"}
                  </button>
                  <button onClick={addCart} disabled={busy} className="btn-ghost">
                    <ShoppingBag size={15} /> Add to Cart
                  </button>
                </div>

                {/* Coupon */}
                <div className="hero-coupon">
                  <Tag size={12} /> Apply&nbsp;<strong>SAVE400</strong>&nbsp;— pay just&nbsp;<strong>₹999</strong>
                </div>
              </div>

              {/* Right: product image stack */}
              <div className="hero-product">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${slide}-${imgIdx}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    src={curSlide.color.images[imgIdx]}
                    alt={curSlide.color.name}
                    className="hero-prod-img"
                  />
                </AnimatePresence>
                {/* wishlist */}
                <button onClick={toggleWish} className={`hero-wish ${inWishlist ? "hero-wish--on" : ""}`}>
                  <Heart size={14} className={inWishlist ? "fill-current" : ""} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slider controls */}
        <div className="hero-controls">
          <button onClick={prevSlide} className="hero-arrow"><ChevronLeft size={18} strokeWidth={2} /></button>
          <div className="hero-dots">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goSlide(i)} className={`hero-dot ${i === slide ? "hero-dot--on" : ""}`} />
            ))}
          </div>
          <button onClick={nextSlide} className="hero-arrow"><ChevronRight size={18} strokeWidth={2} /></button>
        </div>

        {/* Colour + thumb strip — bottom */}
        <div className="hero-strip">
          <div className="hero-strip-inner">
            {/* Color picker */}
            <div className="hero-colors">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedColor(c); setImgIdx(0); }}
                  title={c.name}
                  style={{ background: c.hex, borderColor: selectedColor.id === c.id ? "#fff" : "transparent" }}
                  className={`swatch ${selectedColor.id === c.id ? "swatch--on" : ""}`}
                />
              ))}
              <span className="hero-color-name">{selectedColor.name}</span>
            </div>
            {/* Thumbnails */}
            <div className="hero-thumbs">
              {imgs.slice(0, 5).map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)} className={`thumb ${i === imgIdx ? "thumb--on" : ""}`}>
                  <img src={img} alt="" className="thumb-img" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          BESTSELLERS
      ════════════════════════════════════════════════════════ */}
      <section className="sec sec--white">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h2">Bestsellers</h2>
            <Link href="/buy" className="link-arrow">View all products <ArrowRight size={13} /></Link>
          </div>
          <div className="products-grid">
            {COLORS.map((color, i) => (
              <motion.div
                key={color.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="product-card"
              >
                <div className="product-img-wrap">
                  <img src={color.images[0]} alt={color.name} className="product-img" />
                  <span className="product-badge">New</span>
                  <button
                    onClick={() => { setSelectedColor(color); setImgIdx(0); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="product-quick"
                  >
                    Quick view
                  </button>
                </div>
                <div className="product-body">
                  <h3 className="product-name">Premium iWallet</h3>
                  <p className="product-variant">{color.name}</p>
                  <div className="product-swatches">
                    {COLORS.map(c => (
                      <span key={c.id} style={{ background: c.hex, borderColor: c.border }} className="p-swatch" />
                    ))}
                  </div>
                  <div className="product-stars">
                    {[...Array(5)].map((_, j) => <Star key={j} size={11} className="star-fill" />)}
                    <span className="product-rtext">{avg} ({reviews.length || "100+"})</span>
                  </div>
                  <div className="product-price-row">
                    <span className="product-price">₹1,399</span>
                    <span className="product-mrp">₹1,599</span>
                  </div>
                  <button
                    onClick={() => { setSelectedColor(color); buyNow(); }}
                    className="product-cta"
                  >
                    Shop Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TRUST BAR
      ════════════════════════════════════════════════════════ */}
      <div className="trust-bar">
        {TRUST.map((t, i) => (
          <div key={i} className="trust-item">
            <span className="trust-icon">{t.icon}</span>
            <div>
              <strong className="trust-title">{t.title}</strong>
              <span className="trust-desc">{t.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════
          MARQUEE
      ════════════════════════════════════════════════════════ */}
      <div className="marquee-wrap">
        <div className="marquee tcc-marquee-run">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="marquee-item"><span className="marquee-dot">◆</span>{t}</span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          DARK COLLECTION BANNER
      ════════════════════════════════════════════════════════ */}
      <section className="banner-sec">
        <div className="banner-inner">
          <div className="banner-img-side">
            <img src={COLORS[0].images[1] || COLORS[0].images[0]} alt="iWallet" className="banner-img" />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="banner-text"
          >
            <p className="eyebrow-amber">Limited Collection</p>
            <h2 className="banner-h2">Complete Your<br />Everyday Carry.</h2>
            <ul className="banner-list">
              {["Premium vegan leather that ages beautifully", "RFID blocking built into every wallet", "Fits 8+ cards in a 6mm profile", "Available in 3 exclusive colourways"].map((t, i) => (
                <li key={i} className="banner-li"><Check size={13} className="banner-check" />{t}</li>
              ))}
            </ul>
            <button onClick={buyNow} disabled={busy} className="btn-amber">
              Shop the Collection <ArrowRight size={14} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          4 REASONS — dark
      ════════════════════════════════════════════════════════ */}
      <section className="sec sec--dark">
        <div className="wrap">
          <div className="reasons-grid">
            <div className="reasons-img-wrap">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeF}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={COLORS[0].images[activeF % COLORS[0].images.length]}
                  alt="feature"
                  className="reasons-img"
                />
              </AnimatePresence>
            </div>
            <div className="reasons-content">
              <span className="eyebrow-muted">Why iWallet</span>
              <h2 className="h2-light">4 reasons to upgrade</h2>
              <div className="reasons-list">
                {FEATURES.map((f, i) => (
                  <button key={i} onClick={() => setActiveF(i)} className={`reason ${activeF === i ? "reason--on" : ""}`}>
                    <span className="reason-num">{f.num}</span>
                    <div className="reason-body">
                      <p className="reason-title">{f.title}</p>
                      <AnimatePresence>
                        {activeF === i && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="reason-desc"
                          >{f.desc}</motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                    <span className="reason-tog">{activeF === i ? <Minus size={14} /> : <Plus size={14} />}</span>
                  </button>
                ))}
              </div>
              <button onClick={buyNow} disabled={busy} className="btn-amber" style={{ marginTop: "2rem" }}>
                Shop Now — ₹1,399 <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          TESTIMONIAL — dark
      ════════════════════════════════════════════════════════ */}
      <section className="testimonial-sec">
        <div className="testimonial-inner">
          <div className="testimonial-avatar">
            {/* Replace with customer photo: <img src="/customers/arjun.jpg" /> */}
            <span className="testimonial-initials">AS</span>
          </div>
          <div className="testimonial-body">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => <Star key={i} size={15} className="star-fill" />)}
            </div>
            <blockquote className="testimonial-quote">
              &ldquo;Finally a wallet that doesn&apos;t ruin the lines of my outfit. Ultra slim, premium feel — completely worth every rupee.&rdquo;
            </blockquote>
            <p className="testimonial-author">— Arjun S. · Verified Purchase</p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          LIFESTYLE GALLERY — white
      ════════════════════════════════════════════════════════ */}
      <section className="sec sec--white">
        <div className="wrap">
          <div className="sec-head">
            <h2 className="h2">See it in the wild</h2>
            <Link href="/buy" className="link-arrow">Shop now <ArrowRight size={13} /></Link>
          </div>
          <div className="gallery-grid">
            {[
              { label: "At the office",     img: COLORS[0].images[2] },
              { label: "On the go",         img: COLORS[1].images[1] },
              { label: "Night out",         img: COLORS[2].images[0] },
              { label: "Weekend carry",     img: COLORS[0].images[3] },
              { label: "Daily essentials",  img: COLORS[1].images[2] },
              { label: "Gift perfect",      img: COLORS[2].images[1] },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="gallery-card"
              >
                <div className="gallery-img-wrap">
                  <img src={item.img} alt={item.label} className="gallery-img" />
                </div>
                <p className="gallery-label">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          REVIEWS — gray
      ════════════════════════════════════════════════════════ */}
      <section ref={reviewsRef} className="sec sec--gray">
        <div className="wrap">
          <div className="reviews-layout">
            {/* Score panel */}
            <div className="score-panel">
              <div className="score-big">{avg}<span className="score-of">/5</span></div>
              <div className="score-stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={17} className="star-fill" />)}
              </div>
              <p className="score-count">{reviews.length || "100+"} verified reviews</p>
              <button onClick={() => setShowForm(!showForm)} className="btn-outline">
                {showForm ? "Cancel" : "Write a Review"}
              </button>
            </div>

            {/* Reviews */}
            <div className="reviews-body">
              <AnimatePresence>
                {showForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={submitReview}
                    className="review-form"
                  >
                    <p className="form-title">Share your experience</p>
                    <div className="form-row">
                      <input required value={newReview.name} onChange={e => setNewReview({ ...newReview, name: e.target.value })} placeholder="Your name" className="inp" />
                      <div className="star-pick">
                        <span className="star-pick-label">Rating</span>
                        {[1,2,3,4,5].map(s => (
                          <button key={s} type="button" onClick={() => setNewReview({ ...newReview, stars: s })}>
                            <Star size={19} className={s <= newReview.stars ? "star-fill" : "star-empty"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea required rows={3} value={newReview.text} onChange={e => setNewReview({ ...newReview, text: e.target.value })} placeholder="Tell us about your experience…" className="inp inp--ta" />
                    <button type="submit" className="btn-dark">Submit Review</button>
                  </motion.form>
                )}
              </AnimatePresence>

              {reviews.length === 0
                ? <p className="no-reviews">No reviews yet — be the first!</p>
                : (
                  <div className="reviews-grid">
                    {reviews.slice(0, 6).map((r: any, i: number) => (
                      <motion.div
                        key={r._id || i}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="review-card"
                      >
                        <div className="review-stars">
                          {[...Array(5)].map((_, j) => <Star key={j} size={11} className={j < r.stars ? "star-fill" : "star-empty"} />)}
                        </div>
                        <p className="review-text">&ldquo;{r.text}&rdquo;</p>
                        <div className="review-author">
                          <div className="review-avi">{r.name?.[0]?.toUpperCase()}</div>
                          <div>
                            <p className="review-name">{r.name}</p>
                            <span className="verified"><Check size={8} strokeWidth={3} /> Verified</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          OFFER STRIP — amber
      ════════════════════════════════════════════════════════ */}
      <section className="offer-strip">
        <div className="offer-inner">
          <div>
            <p className="eyebrow-amber">Limited Time Offer</p>
            <h2 className="offer-h2">Get it for just <span className="offer-price">₹999</span></h2>
            <p className="offer-sub">Apply coupon <strong>SAVE400</strong> at checkout · Save ₹400</p>
          </div>
          <Link href="/cart" className="btn-amber">Claim Discount <ArrowRight size={14} /></Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FINAL CTA — full-bleed dark
      ════════════════════════════════════════════════════════ */}
      <section className="cta-sec">
        <div className="cta-inner">
          <img src={COLORS[1].images[0]} alt="" className="cta-bg" />
          <div className="cta-overlay" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cta-text"
          >
            <p className="eyebrow-amber">Ready to upgrade?</p>
            <h2 className="cta-h2">Carry less.<br /><em className="cta-em">Live more.</em></h2>
            <p className="cta-sub">Join 100+ customers who&apos;ve ditched their bulky wallets.</p>
            <Link href="/buy" className="btn-amber">Shop the Collection <ArrowRight size={14} /></Link>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          STYLES
      ════════════════════════════════════════════════════════ */}
      <style jsx global>{`
        :root {
          --white:   #FFFFFF;
          --gray:    #F4F3F0;
          --dark:    #111111;
          --darker:  #0C0C0C;
          --ink:     #1A1A1A;
          --mid:     #6B6560;
          --muted:   #A09890;
          --border:  #E5E2DC;
          --accent:  #B45309;
          --amber-l: #FFF8EE;
          --ff:      "Replica", ui-sans-serif, system-ui, sans-serif;
        }

        .lp { font-family: var(--ff); color: var(--ink); background: var(--white); }

        /* ── Sections ──────────────────────────────────────── */
        .sec       { padding: 5rem 0; }
        .sec--white{ background: var(--white); }
        .sec--gray { background: var(--gray); }
        .sec--dark { background: var(--dark); }

        .wrap { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }
        @media (min-width: 768px)  { .wrap { padding: 0 2.5rem; } }
        @media (min-width: 1280px) { .wrap { padding: 0 3rem; } }

        .sec-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 2.5rem;
        }

        .h2 {
          font-size: clamp(1.625rem, 3vw, 2.25rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          color: var(--ink);
        }
        .h2-light {
          font-size: clamp(1.75rem, 3.5vw, 2.5rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          color: #FFFFFF;
          line-height: 1.1;
          margin-bottom: 0.5rem;
        }

        .link-arrow {
          font-size: 0.8125rem; font-weight: 600;
          color: var(--mid); text-decoration: none;
          display: flex; align-items: center; gap: 0.375rem;
          transition: color 0.15s;
        }
        .link-arrow:hover { color: var(--ink); }

        .eyebrow-amber {
          font-size: 0.625rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.2em;
          color: var(--accent); display: block; margin-bottom: 0.75rem;
        }
        .eyebrow-muted {
          font-size: 0.625rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.2em;
          color: rgba(255,255,255,0.35); display: block; margin-bottom: 0.75rem;
        }

        .star-fill  { fill: #FBBF24; color: #FBBF24; }
        .star-empty { color: #DDD8D0; }

        /* ── Buttons ──────────────────────────────────────── */
        .btn-white {
          padding: 0.875rem 2rem;
          background: #FFFFFF; color: var(--ink);
          font-size: 0.875rem; font-weight: 700;
          border-radius: 0.625rem; border: none; cursor: pointer;
          transition: all 0.2s; white-space: nowrap;
          display: inline-flex; align-items: center; gap: 0.5rem;
        }
        .btn-white:hover { background: var(--gray); }
        .btn-white:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-ghost {
          padding: 0.875rem 1.5rem;
          background: transparent; color: rgba(255,255,255,0.85);
          border: 1.5px solid rgba(255,255,255,0.35);
          font-size: 0.875rem; font-weight: 600;
          border-radius: 0.625rem; cursor: pointer;
          transition: all 0.2s; white-space: nowrap;
          display: inline-flex; align-items: center; gap: 0.5rem;
        }
        .btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.6); }
        .btn-ghost:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-amber {
          padding: 0.875rem 1.75rem;
          background: var(--accent); color: #fff;
          font-size: 0.875rem; font-weight: 700;
          border-radius: 0.625rem; border: none; cursor: pointer;
          text-decoration: none; transition: all 0.2s;
          display: inline-flex; align-items: center; gap: 0.5rem;
          white-space: nowrap;
        }
        .btn-amber:hover { background: #92400E; transform: translateY(-1px); }
        .btn-amber:disabled { opacity: 0.5; cursor: not-allowed; }

        .btn-dark {
          padding: 0.75rem 1.5rem;
          background: var(--ink); color: #fff;
          font-size: 0.875rem; font-weight: 600;
          border-radius: 0.625rem; border: none; cursor: pointer;
          transition: background 0.2s; white-space: nowrap;
          display: inline-flex; align-items: center; gap: 0.5rem;
        }
        .btn-dark:hover { background: var(--accent); }

        .btn-outline {
          padding: 0.625rem 1.25rem;
          background: transparent; color: var(--ink);
          border: 1.5px solid var(--ink);
          font-size: 0.8125rem; font-weight: 600;
          border-radius: 0.625rem; cursor: pointer;
          transition: all 0.2s; white-space: nowrap;
        }
        .btn-outline:hover { background: var(--ink); color: #fff; }

        /* ══ HERO ════════════════════════════════════════════ */
        .hero {
          position: relative;
          height: 100svh;
          min-height: 600px;
          overflow: hidden;
        }

        .hero-slide {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
        }

        /* Background */
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .hero-bg-img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .hero-bg-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            110deg,
            rgba(0,0,0,0.82) 0%,
            rgba(0,0,0,0.55) 45%,
            rgba(0,0,0,0.25) 100%
          );
        }

        /* Content grid */
        .hero-content {
          position: relative;
          z-index: 1;
          flex: 1;
          max-width: 1280px;
          width: 100%;
          margin: 0 auto;
          padding: calc(var(--nb-h, 102px) + 2rem) 1.5rem 6rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }
        @media (min-width: 900px) {
          .hero-content {
            grid-template-columns: 1fr 1fr;
            padding-left: 2.5rem;
            padding-right: 2.5rem;
            gap: 3rem;
          }
        }
        @media (min-width: 1280px) {
          .hero-content { padding-left: 3rem; padding-right: 3rem; }
        }

        /* Text */
        .hero-text {
          display: flex; flex-direction: column; gap: 1.25rem;
          order: 2;
        }
        @media (min-width: 900px) { .hero-text { order: 1; } }

        .hero-eyebrow {
          font-size: 0.625rem; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.22em;
          color: rgba(255,255,255,0.5);
        }

        .hero-h1 {
          font-size: clamp(2.75rem, 6vw, 4.75rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.02;
          color: #FFFFFF;
        }
        .hero-em { font-style: italic; }

        .hero-sub {
          font-size: 1rem;
          color: rgba(255,255,255,0.65);
          line-height: 1.6;
          max-width: 26rem;
        }

        .hero-stars {
          display: flex; align-items: center; gap: 4px;
          background: none; border: none; padding: 0; cursor: pointer;
        }
        .hero-stars-text {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.55);
          margin-left: 4px;
        }

        .hero-price-row {
          display: flex; align-items: baseline; gap: 0.875rem; flex-wrap: wrap;
        }
        .hero-price { font-size: 2rem; font-weight: 700; color: #FFFFFF; }
        .hero-mrp   { font-size: 1.125rem; color: rgba(255,255,255,0.4); text-decoration: line-through; }
        .hero-save  {
          font-size: 0.75rem; font-weight: 600;
          background: rgba(180,83,9,0.25); color: #FCD68A;
          border: 1px solid rgba(180,83,9,0.4);
          border-radius: 999px; padding: 0.25rem 0.625rem;
        }

        .hero-btns { display: flex; gap: 0.75rem; flex-wrap: wrap; }

        .hero-coupon {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.6);
          line-height: 1.45;
        }
        .hero-coupon strong { color: rgba(255,255,255,0.85); }

        /* Product image */
        .hero-product {
          position: relative;
          order: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @media (min-width: 900px) { .hero-product { order: 2; } }

        .hero-prod-img {
          width: 100%;
          max-width: 460px;
          max-height: 55svh;
          object-fit: contain;
          filter: drop-shadow(0 24px 48px rgba(0,0,0,0.6));
        }

        .hero-wish {
          position: absolute;
          top: 0; right: 0;
          width: 2.5rem; height: 2.5rem;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.7);
          cursor: pointer; transition: all 0.2s;
        }
        .hero-wish:hover { background: rgba(255,255,255,0.2); color: #fff; }
        .hero-wish--on { color: var(--accent); background: rgba(180,83,9,0.2); border-color: rgba(180,83,9,0.4); }

        /* Slider controls */
        .hero-controls {
          position: absolute;
          bottom: 8.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex; align-items: center; gap: 1rem;
        }
        @media (min-width: 900px) { .hero-controls { bottom: 9.5rem; left: 3rem; transform: none; } }

        .hero-arrow {
          width: 2.25rem; height: 2.25rem;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #fff; cursor: pointer;
          transition: all 0.2s;
        }
        .hero-arrow:hover { background: rgba(255,255,255,0.25); }

        .hero-dots { display: flex; gap: 6px; }
        .hero-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.35);
          border: none; padding: 0; cursor: pointer;
          transition: all 0.2s;
        }
        .hero-dot--on {
          background: #fff;
          width: 22px; border-radius: 3px;
        }

        /* Bottom strip */
        .hero-strip {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 10;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(12px);
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .hero-strip-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0.875rem 1.5rem;
          display: flex; align-items: center;
          justify-content: space-between; gap: 1rem;
        }
        @media (min-width: 768px) { .hero-strip-inner { padding: 0.875rem 2.5rem; } }

        .hero-colors { display: flex; align-items: center; gap: 0.625rem; }
        .swatch {
          width: 1.75rem; height: 1.75rem;
          border-radius: 50%; border-width: 2px; border-style: solid;
          cursor: pointer; transition: all 0.2s;
        }
        .swatch--on {
          box-shadow: 0 0 0 2px rgba(255,255,255,0.6);
          transform: scale(1.12);
        }
        .hero-color-name {
          font-size: 0.75rem; color: rgba(255,255,255,0.6);
          margin-left: 0.25rem;
        }

        .hero-thumbs { display: flex; gap: 0.5rem; }
        .thumb {
          width: 3rem; height: 3rem;
          border-radius: 0.5rem; overflow: hidden;
          border: 1.5px solid transparent;
          background: rgba(255,255,255,0.08);
          padding: 0; cursor: pointer; transition: all 0.2s;
          opacity: 0.45;
        }
        .thumb:hover { opacity: 0.75; }
        .thumb--on { border-color: rgba(255,255,255,0.7); opacity: 1; }
        .thumb-img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* ══ PRODUCTS ════════════════════════════════════════ */
        .products-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 640px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }

        .product-card {
          border-radius: 1rem; overflow: hidden;
          border: 1px solid var(--border);
          background: var(--white);
          transition: all 0.25s;
        }
        .product-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-4px); }

        .product-img-wrap {
          position: relative;
          aspect-ratio: 1;
          background: var(--gray);
          overflow: hidden;
        }
        .product-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .product-card:hover .product-img { transform: scale(1.04); }

        .product-badge {
          position: absolute; top: 0.75rem; left: 0.75rem;
          background: var(--ink); color: #fff;
          font-size: 0.5625rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.12em;
          padding: 0.25rem 0.625rem; border-radius: 999px;
        }
        .product-quick {
          position: absolute; bottom: 0.75rem; left: 50%; transform: translateX(-50%);
          background: rgba(0,0,0,0.75); color: #fff;
          font-size: 0.75rem; font-weight: 600;
          padding: 0.375rem 1rem; border-radius: 999px; border: none;
          cursor: pointer; white-space: nowrap;
          opacity: 0; transition: opacity 0.2s;
        }
        .product-card:hover .product-quick { opacity: 1; }

        .product-body { padding: 1.25rem; }
        .product-name    { font-size: 0.9375rem; font-weight: 600; color: var(--ink); margin-bottom: 0.125rem; }
        .product-variant { font-size: 0.8125rem; color: var(--mid); margin-bottom: 0.75rem; }

        .product-swatches { display: flex; gap: 0.375rem; margin-bottom: 0.75rem; }
        .p-swatch {
          width: 1.125rem; height: 1.125rem;
          border-radius: 50%;
          border-width: 1.5px; border-style: solid;
          display: inline-block;
        }

        .product-stars { display: flex; align-items: center; gap: 2px; margin-bottom: 0.5rem; }
        .product-rtext { font-size: 0.75rem; color: var(--mid); margin-left: 3px; }

        .product-price-row { display: flex; align-items: baseline; gap: 0.5rem; margin-bottom: 1rem; }
        .product-price { font-size: 1.125rem; font-weight: 700; color: var(--ink); }
        .product-mrp   { font-size: 0.875rem; color: var(--muted); text-decoration: line-through; }

        .product-cta {
          width: 100%; padding: 0.625rem;
          background: var(--ink); color: #fff;
          font-size: 0.8125rem; font-weight: 600;
          border-radius: 0.625rem; border: none; cursor: pointer;
          transition: background 0.2s;
        }
        .product-cta:hover { background: var(--accent); }

        /* ══ TRUST BAR ═══════════════════════════════════════ */
        .trust-bar {
          background: var(--white);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }
        @media (min-width: 768px) { .trust-bar { grid-template-columns: repeat(4, 1fr); } }

        .trust-item {
          padding: 1.5rem;
          display: flex; align-items: center; gap: 1rem;
          border-right: 1px solid var(--border);
        }
        .trust-item:last-child,
        .trust-item:nth-child(2) { border-right: none; }
        @media (min-width: 768px) {
          .trust-item:nth-child(2) { border-right: 1px solid var(--border); }
        }
        .trust-icon  { color: var(--accent); flex-shrink: 0; }
        .trust-title { display: block; font-size: 0.875rem; font-weight: 600; color: var(--ink); }
        .trust-desc  { display: block; font-size: 0.75rem; color: var(--mid); }

        /* ══ MARQUEE ═════════════════════════════════════════ */
        .marquee-wrap { background: var(--ink); overflow: hidden; padding: 0.875rem 0; }
        .marquee { display: flex; gap: 3rem; white-space: nowrap; }
        .marquee-item {
          color: rgba(255,255,255,0.7);
          font-size: 0.625rem; font-weight: 600;
          letter-spacing: 0.25em; text-transform: uppercase;
          display: flex; align-items: center; gap: 0.875rem;
        }
        .marquee-dot { color: var(--accent); font-size: 0.4rem; }

        /* ══ COLLECTION BANNER ═══════════════════════════════ */
        .banner-sec { background: #111111; }
        .banner-inner {
          max-width: 1280px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr;
        }
        @media (min-width: 900px) {
          .banner-inner { grid-template-columns: 1fr 1fr; min-height: 520px; }
        }
        .banner-img-side { overflow: hidden; background: #1A1A1A; min-height: 300px; }
        .banner-img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .banner-text {
          padding: 3.5rem 2rem;
          display: flex; flex-direction: column; justify-content: center; gap: 1.5rem;
        }
        @media (min-width: 900px) { .banner-text { padding: 4rem 3.5rem; } }

        .banner-h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700; letter-spacing: -0.025em; line-height: 1.07;
          color: #FFFFFF;
        }
        .banner-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.875rem; }
        .banner-li { display: flex; align-items: flex-start; gap: 0.75rem; font-size: 0.9375rem; color: #C0B8B0; line-height: 1.5; }
        .banner-check { color: var(--accent); flex-shrink: 0; margin-top: 0.125rem; }

        /* ══ REASONS ═════════════════════════════════════════ */
        .reasons-grid {
          display: grid; grid-template-columns: 1fr;
          gap: 3rem; align-items: center;
        }
        @media (min-width: 900px) { .reasons-grid { grid-template-columns: 1fr 1fr; gap: 5rem; } }

        .reasons-img-wrap {
          border-radius: 1.25rem; overflow: hidden;
          aspect-ratio: 4/5; background: #1A1A1A;
        }
        .reasons-img { width: 100%; height: 100%; object-fit: cover; }

        .reasons-content { display: flex; flex-direction: column; }
        .reasons-list { display: flex; flex-direction: column; margin: 1.5rem 0 0; }

        .reason {
          display: flex; align-items: flex-start; gap: 1.25rem;
          padding: 1.125rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          border-top: none; border-left: none; border-right: none;
          background: none; text-align: left; width: 100%; cursor: pointer;
          transition: all 0.15s;
        }
        .reason:first-child { border-top: 1px solid rgba(255,255,255,0.07); }
        .reason-num {
          font-size: 0.625rem; font-weight: 700;
          color: var(--accent); letter-spacing: 0.08em;
          flex-shrink: 0; min-width: 2rem; margin-top: 0.125rem;
        }
        .reason-body { flex: 1; }
        .reason-title { font-size: 0.9375rem; font-weight: 600; color: rgba(255,255,255,0.85); }
        .reason--on .reason-title { color: var(--accent); }
        .reason-desc {
          font-size: 0.875rem; color: rgba(255,255,255,0.45);
          line-height: 1.6; margin-top: 0.5rem; overflow: hidden;
        }
        .reason-tog { color: rgba(255,255,255,0.3); flex-shrink: 0; margin-top: 0.125rem; }
        .reason--on .reason-tog { color: var(--accent); }

        /* ══ TESTIMONIAL ════════════════════════════════════ */
        .testimonial-sec { background: #0C0C0C; padding: 5rem 1.5rem; }
        .testimonial-inner {
          max-width: 56rem; margin: 0 auto;
          display: flex; flex-direction: column; align-items: center; gap: 2rem;
          text-align: center;
        }
        @media (min-width: 768px) { .testimonial-inner { flex-direction: row; text-align: left; } }

        .testimonial-avatar {
          width: 5rem; height: 5rem; border-radius: 50%;
          background: #2A2525;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .testimonial-initials { font-size: 1.25rem; font-weight: 700; color: rgba(255,255,255,0.4); }
        .testimonial-body { display: flex; flex-direction: column; gap: 0.75rem; }
        .testimonial-stars { display: flex; gap: 3px; }
        .testimonial-quote {
          font-size: clamp(1.125rem, 2.5vw, 1.5rem);
          font-weight: 600; color: #FFFFFF; line-height: 1.5; letter-spacing: -0.01em;
        }
        .testimonial-author { font-size: 0.875rem; color: rgba(255,255,255,0.35); }

        /* ══ GALLERY ════════════════════════════════════════ */
        .gallery-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;
        }
        @media (min-width: 640px)  { .gallery-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .gallery-grid { grid-template-columns: repeat(6, 1fr); } }

        .gallery-card { display: flex; flex-direction: column; gap: 0.625rem; }
        .gallery-img-wrap {
          border-radius: 0.875rem; overflow: hidden;
          aspect-ratio: 3/4; background: var(--gray);
        }
        .gallery-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .gallery-img-wrap:hover .gallery-img { transform: scale(1.05); }
        .gallery-label { font-size: 0.75rem; font-weight: 600; color: var(--mid); text-align: center; }

        /* ══ REVIEWS ════════════════════════════════════════ */
        .reviews-layout {
          display: grid; grid-template-columns: 1fr; gap: 3rem;
        }
        @media (min-width: 900px) { .reviews-layout { grid-template-columns: 200px 1fr; } }

        .score-panel { display: flex; flex-direction: column; gap: 0.75rem; }
        .score-big {
          font-size: 3.5rem; font-weight: 700;
          letter-spacing: -0.04em; color: var(--ink); line-height: 1;
        }
        .score-of   { font-size: 1.5rem; color: var(--muted); }
        .score-stars{ display: flex; gap: 3px; }
        .score-count{ font-size: 0.8125rem; color: var(--mid); }

        .review-form {
          background: var(--white); border: 1px solid var(--border);
          border-radius: 1rem; padding: 1.5rem; margin-bottom: 2rem; overflow: hidden;
        }
        .form-title { font-size: 1rem; font-weight: 600; color: var(--ink); margin-bottom: 1.25rem; }
        .form-row {
          display: grid; grid-template-columns: 1fr;
          gap: 0.75rem; margin-bottom: 0.75rem;
        }
        @media (min-width: 640px) { .form-row { grid-template-columns: 1fr 1fr; } }

        .inp {
          width: 100%;
          background: var(--gray); border: 1px solid var(--border);
          border-radius: 0.625rem; padding: 0.75rem 1rem;
          font-size: 0.875rem; color: var(--ink); font-family: var(--ff);
          outline: none; transition: border-color 0.15s;
        }
        .inp:focus { border-color: var(--ink); }
        .inp--ta { resize: none; min-height: 5rem; }

        .star-pick {
          display: flex; align-items: center; gap: 0.25rem;
          background: var(--gray); border: 1px solid var(--border);
          border-radius: 0.625rem; padding: 0.625rem 1rem;
        }
        .star-pick-label { font-size: 0.75rem; color: var(--mid); margin-right: 0.25rem; }

        .no-reviews { color: var(--muted); text-align: center; padding: 3rem 0; }

        .reviews-grid {
          display: grid; grid-template-columns: 1fr; gap: 1rem;
        }
        @media (min-width: 640px)  { .reviews-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { .reviews-grid { grid-template-columns: repeat(3, 1fr); } }

        .review-card {
          background: var(--white); border: 1px solid var(--border);
          border-radius: 1rem; padding: 1.375rem;
          transition: box-shadow 0.2s;
        }
        .review-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }

        .review-stars { display: flex; gap: 2px; margin-bottom: 0.875rem; }
        .review-text {
          font-size: 0.9375rem; color: #4A4440; line-height: 1.6; margin-bottom: 1.25rem;
          display: -webkit-box; -webkit-line-clamp: 4;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .review-author {
          display: flex; align-items: center; gap: 0.75rem;
          padding-top: 1rem; border-top: 1px solid var(--gray);
        }
        .review-avi {
          width: 2rem; height: 2rem; border-radius: 50%;
          background: var(--ink); color: #fff;
          font-size: 0.75rem; font-weight: 600;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .review-name { font-size: 0.875rem; font-weight: 600; color: var(--ink); }
        .verified {
          display: flex; align-items: center; gap: 3px;
          font-size: 0.6875rem; color: #2D9A5A; font-weight: 500; margin-top: 1px;
        }

        /* ══ OFFER STRIP ════════════════════════════════════ */
        .offer-strip {
          background: var(--amber-l);
          border-top: 1px solid #F5DFA0;
          border-bottom: 1px solid #F5DFA0;
          padding: 2.25rem 1.5rem;
        }
        .offer-inner {
          max-width: 1280px; margin: 0 auto;
          display: flex; flex-direction: column; gap: 1.5rem; align-items: flex-start;
        }
        @media (min-width: 768px) {
          .offer-inner {
            flex-direction: row; align-items: center; justify-content: space-between;
            padding: 0 2.5rem;
          }
        }
        .offer-h2 {
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          font-weight: 700; letter-spacing: -0.025em; color: var(--ink);
          margin-bottom: 0.25rem;
        }
        .offer-price { color: var(--accent); }
        .offer-sub   { font-size: 0.9375rem; color: var(--mid); }

        /* ══ FINAL CTA ═══════════════════════════════════════ */
        .cta-sec { overflow: hidden; }
        .cta-inner {
          position: relative; min-height: 520px;
          display: flex; align-items: flex-end;
        }
        @media (min-width: 768px) { .cta-inner { min-height: 600px; } }
        .cta-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0; }
        .cta-overlay {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 55%, transparent 100%);
        }
        .cta-text {
          position: relative; z-index: 2;
          padding: 3rem 1.5rem;
          max-width: 42rem;
          display: flex; flex-direction: column; gap: 1.25rem;
        }
        @media (min-width: 768px) { .cta-text { padding: 4rem 3rem; } }
        .cta-h2 {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700; letter-spacing: -0.03em; line-height: 1.02; color: #FFFFFF;
        }
        .cta-em { color: var(--accent); font-style: italic; }
        .cta-sub { font-size: 1rem; color: rgba(255,255,255,0.6); max-width: 26rem; line-height: 1.55; }
      `}</style>
    </div>
  );
}
