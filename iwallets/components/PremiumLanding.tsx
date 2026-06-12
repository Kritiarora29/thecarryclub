"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart } from "@/lib/cartActions";
import { toggleWishlist } from "@/lib/wishlistActions";
import { trackConversion } from "@/lib/analytics";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  Truck, RotateCcw, Star,
  Check, Heart, ShoppingBag, Tag, ArrowRight, Lock, Plus, Minus,
} from "lucide-react";


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
  { num: "01", title: "Holds 8+ Cards", desc: "Every card organized and accessible. No more bulging billfolds." },
  { num: "02", title: "Ultra Slim ", desc: "Thinner than your smartphone. Slides right into your front pocket." },
  { num: "03", title: "RFID Blocking",  desc: "Built-in protection shields your cards from contactless scanning." },
  { num: "04", title: "Premium Vegan Leather", desc: "Cruelty-free, soft-touch material that develops a beautiful patina." },
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
  const [coupon, setCoupon]             = useState<{ code: string; label: string; payJust: number | null; active: boolean } | null>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentProduct = products.find((p: any) => p.slug?.current === selectedColor.slug);
  const basePrice = currentProduct?.price || products[0]?.price || 1150;
  const baseMRP   = basePrice + 200;

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

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? nextSlide() : prevSlide();
    touchStartX.current = null;
  };

  useEffect(() => { fetch("/api/reviews").then(r => r.json()).then(setReviews).catch(() => {}); }, []);

  useEffect(() => {
    fetch("/api/coupon").then(r => r.json()).then(c => {
      if (!c?.couponCode) return;
      const basePrice = currentProduct?.price || products[0]?.price || 1150;
      const payJust = c.discountType === "percent"
        ? Math.round(basePrice * (1 - c.discountAmount / 100))
        : basePrice - c.discountAmount;
      setCoupon({ code: c.couponCode, label: c.displayLabel, payJust, active: c.isActive });
    }).catch(() => {});
  }, []);

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
      trackConversion({ event_name: "add_to_cart", value: basePrice, currency: "INR", content_ids: [slug] });
      toast.success("Added to cart!");
    } catch { toast.error("Failed"); }
    finally { setBusy(false); }
  };

  const buyNow = async () => {
    setBusy(true);
    try {
      await addToCart(slug);
      trackConversion({ event_name: "add_to_cart", value: basePrice, currency: "INR", content_ids: [slug] });
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


      <section className="hero" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

        <div className="hero-track" style={{ transform: `translateX(-${slide * 100}%)` }}>
          {SLIDES.map((s, i) => (
            <div key={i} className="hero-slide">
              {/* Background */}
              <div className="hero-bg">
                <img src={s.color.images[0]} alt="" className="hero-bg-img" />
                <div className="hero-bg-overlay" />
              </div>

              {/* Content */}
              <div className="hero-content">
                {/* Text */}
                <div className="hero-text">
                  <p className="hero-eyebrow">India&apos;s Premium iWallet</p>
                  <h1 className="hero-h1">
                    {s.headline[0]}<br />
                    <em className="hero-em" style={{ color: s.accent }}>{s.headline[1]}</em>
                  </h1>
                  <p className="hero-sub">{s.sub}</p>

                  <div className="hero-stars">
                    {[...Array(5)].map((_, j) => <Star key={j} size={12} className="star-fill" />)}
                    <span className="hero-stars-text">{avg} &middot; {reviews.length || "100+"} reviews</span>
                  </div>

                  <div className="hero-price-row">
                    <span className="hero-price">&#8377;{basePrice.toLocaleString("en-IN")}</span>
                    <span className="hero-mrp">&#8377;{baseMRP.toLocaleString("en-IN")}</span>
                    <span className="hero-save">Save &#8377;{baseMRP - basePrice}</span>
                  </div>

                  <div className="hero-btns">
                    <button onClick={buyNow} disabled={busy} className="btn-white">
                      {busy ? "…" : "Shop Now"}
                    </button>
                    <button onClick={addCart} disabled={busy} className="btn-ghost">
                      <ShoppingBag size={15} /> Add to Cart
                    </button>
                  </div>

                  {coupon?.active && (
                    <div className="hero-coupon">
                      <Tag size={12} /> Apply&nbsp;<strong>{coupon.code}</strong>&nbsp;&mdash; pay just&nbsp;<strong>&#8377;{coupon.payJust}</strong>
                    </div>
                  )}
                </div>

                {/* Product image (desktop only) */}
                <div className="hero-product">
                  <img
                    src={s.color.images[i === slide ? imgIdx : 0]}
                    alt={s.color.name}
                    className="hero-prod-img"
                  />
                  <button onClick={toggleWish} className={`hero-wish ${inWishlist ? "hero-wish--on" : ""}`}>
                    <Heart size={14} className={inWishlist ? "fill-current" : ""} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots only - no arrow buttons */}
        <div className="hero-dots-bar">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goSlide(i)} className={`hero-dot ${i === slide ? "hero-dot--on" : ""}`} />
          ))}
        </div>

        {/* Colour + thumb strip - bottom */}
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
                    <span className="product-price">&#8377;{(products.find((p: any) => p.slug?.current === color.slug)?.price || basePrice).toLocaleString("en-IN")}</span>
                    <span className="product-mrp">&#8377;{((products.find((p: any) => p.slug?.current === color.slug)?.price || basePrice) + 200).toLocaleString("en-IN")}</span>
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

      <div className="marquee-wrap">
        <div className="marquee tcc-marquee-run">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="marquee-item"><span className="marquee-dot">&#9670;</span>{t}</span>
          ))}
        </div>
      </div>

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
                Shop Now &mdash; &#8377;{basePrice.toLocaleString("en-IN")} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

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
              &ldquo;Finally a wallet that doesn&apos;t ruin the lines of my outfit. Ultra slim, premium feel &mdash; completely worth every rupee.&rdquo;
            </blockquote>
            <p className="testimonial-author">&mdash; Arjun S. &middot; Verified Purchase</p>
          </div>
        </div>
      </section>

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
                ? <p className="no-reviews">No reviews yet &mdash; be the first!</p>
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

      <section className="offer-strip">
        <div className="offer-inner">
          <div>
            <p className="eyebrow-amber">Limited Time Offer</p>
            <h2 className="offer-h2">Get it for just <span className="offer-price">&#8377;{coupon?.active && coupon.payJust ? coupon.payJust : basePrice}</span></h2>
            <p className="offer-sub">
              {coupon?.active
                ? <>Apply coupon <strong>{coupon.code}</strong> at checkout &middot; {coupon.label}</>
                : <>Free shipping &middot; 7-day easy returns</>
              }
            </p>
          </div>
          <Link href="/cart" className="btn-amber">Claim Discount <ArrowRight size={14} /></Link>
        </div>
      </section>

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


    </div>
  );
}
