"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart } from "@/lib/cartActions";
import { toggleWishlist } from "@/lib/wishlistActions";
import toast from "react-hot-toast";
import { Heart, Star, ShoppingBag, Zap, Tag, ChevronDown, Leaf, CreditCard, Layers, BadgeCheck, Truck } from "lucide-react";
import { Eyebrow, BackButton, PriceTag } from "@/components/ui/tcc";
import { trackConversion } from "@/lib/analytics";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { PRODUCT_PRICE, COUPON_CODE, COUPON_DISCOUNT, PRICE_AFTER_COUPON } from "@/lib/constants";

/* ─── static data ─────────────────────────────────────────────────── */
const descriptions: Record<string, { tagline: string; bullets: string[] }> = {
  "Premium iWallet – White": {
    tagline: "A clean, minimal finish for the modern professional.",
    bullets: ["Premium Vegan Leather", "Ultra-slim Profile", "Embossed CarryClub Logo", "Holds 6–8 Cards"],
  },
  "Premium iWallet – Black": {
    tagline: "Bold. Matte. Timeless. Redefining your everyday carry.",
    bullets: ["Premium Vegan Leather", "Matte Stealth Finish", "Embossed CarryClub Logo", "Holds 6–8 Cards"],
  },
  "Premium iWallet – Space Grey": {
    tagline: "Inspired by modern tech. Engineered for real life.",
    bullets: ["Premium Vegan Leather", "Tech-inspired Texture", "Reinforced Core", "Holds 6–8 Cards"],
  },
};

const productImages: Record<string, { desktop: string[]; mobile: string[] }> = {
  "Premium iWallet – White": {
    desktop: [
      "/Iwallet - Images/Prod image- desk -White/3-white.jpg",
      "/Iwallet - Images/Prod image- desk -White/5-white(1).jpg",
      "/Iwallet - Images/Prod image- desk -White/6-white.jpg",
      "/Iwallet - Images/Prod image- desk -White/1-white.jpg",
      "/Iwallet - Images/White with box_.png",
    ],
    mobile: [
      "/Iwallet - Images/Prod image- mob-white/2-white.jpg",
      "/Iwallet - Images/Prod image- mob-white/3-white.jpg",
      "/Iwallet - Images/Prod image- mob-white/4-white.jpg",
      "/Iwallet - Images/Prod image- mob-white/1-white.jpg",
      "/Iwallet - Images/White with box_.png",
    ],
  },
  "Premium iWallet – Black": {
    desktop: [
      "/Iwallet - Images/Prod image- desk-Black/2-Black.jpg",
      "/Iwallet - Images/Prod image- desk-Black/3-Black.jpg",
      "/Iwallet - Images/Prod image- desk-Black/5-black.jpg",
      "/Iwallet - Images/Prod image- desk-Black/1-Black.jpg",
      "/Iwallet - Images/Black wit box.png",
    ],
    mobile: [
      "/Iwallet - Images/Prod image- mob-Black/2-Black.jpg",
      "/Iwallet - Images/Prod image- mob-Black/3-Black.jpg",
      "/Iwallet - Images/Prod image- mob-Black/5-black.jpg",
      "/Iwallet - Images/Prod image- mob-Black/1-Black.jpg",
      "/Iwallet - Images/Black wit box.png",
    ],
  },
  "Premium iWallet – Space Grey": {
    desktop: [
      "/Iwallet - Images/Prod image-desk-grey/4.png",
      "/Iwallet - Images/Prod image-desk-grey/1.png",
      "/Iwallet - Images/Prod image-desk-grey/2.png",
      "/Iwallet - Images/Prod image-desk-grey/3.png",
      "/Iwallet - Images/Grey with box_.png",
    ],
    mobile: [
      "/Iwallet - Images/Prod images- grey- mob/4.png",
      "/Iwallet - Images/Prod images- grey- mob/1.png",
      "/Iwallet - Images/Prod images- grey- mob/2.png",
      "/Iwallet - Images/Prod images- grey- mob/3.png",
      "/Iwallet - Images/Grey with box_.png",
    ],
  },
};

function getProductMedia(product: any) {
  const imgs = productImages[product.title];
  const desktopList = imgs?.desktop ?? (product.images?.length ? product.images : product.imageUrl ? [product.imageUrl] : []);
  const mobileList  = imgs?.mobile  ?? desktopList;
  const media = desktopList.map((d: string, i: number) => ({ type: "image", desktop: d, mobile: mobileList[i] ?? d }));
  if (product.videoUrl) media.push({ type: "video", desktop: product.videoUrl, mobile: product.videoUrl });
  return media;
}

/* ─── coupon type ─────────────────────────────────────────────────── */
type CouponInfo = { code: string; label: string; payJust: number; active: boolean } | null;

/* ─── product card ────────────────────────────────────────────────── */
function ProductCard({
  product, idx, onSelect, wishlist, coupon,
  averageRating, totalReviews,
}: {
  product: any; idx: number; onSelect: (p: any) => void;
  wishlist: any[]; coupon: CouponInfo;
  averageRating: string; totalReviews: number;
}) {
  const media  = getProductMedia(product);
  const price  = product.price || PRODUCT_PRICE;
  const slug   = product.slug?.current;
  const [hovered, setHovered] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(slug);
    toast.success("Added to cart");
    trackConversion({ event_name: "add_to_cart", content_ids: [slug], value: price, currency: "INR" });
  };
  const handleBuy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(slug);
    trackConversion({ event_name: "add_to_cart", content_ids: [slug], value: price, currency: "INR" });
    window.location.href = "/cart";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08, duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onSelect(product)}
      className="buy-card group cursor-pointer"
    >
      {/* ── image ── */}
      <div className="buy-card-img-wrap">
        {/* wishlist */}
        <div className="absolute top-3 right-3 z-20">
          <form action={toggleWishlist.bind(null, slug)}>
            <button
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 md:w-9 md:h-9 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center hover:bg-white transition-colors"
              aria-label="Wishlist"
            >
              <Heart
                size={14}
                strokeWidth={2.5}
                className={wishlist.some((w: any) => w.slug === slug) ? "fill-brand stroke-brand" : "stroke-gray-400"}
              />
            </button>
          </form>
        </div>

        {/* scrollable images */}
        <div className="buy-card-scroll no-scrollbar">
          {media.map((m: any, i: number) => (
            <div key={i} className="buy-card-frame snap-center">
              {m.type === "video" ? (
                <video src={m.desktop} autoPlay loop muted playsInline className="w-full h-full object-cover" />
              ) : (
                <>
                  <Image src={m.desktop} alt={`${product.title} ${i + 1}`} fill unoptimized sizes="(max-width:768px) 50vw, 33vw" className="object-cover hidden md:block transition-transform duration-700 group-hover:scale-105" priority={idx < 3 && i === 0} />
                  <Image src={m.mobile}  alt={`${product.title} ${i + 1}`} fill unoptimized sizes="50vw"                              className="object-cover block  md:hidden transition-transform duration-700 group-hover:scale-105" priority={idx < 3 && i === 0} />
                </>
              )}
            </div>
          ))}
        </div>

        {/* dots */}
        <div className="buy-card-dots">
          {media.map((_: any, i: number) => (
            <span key={i} className="buy-card-dot" />
          ))}
        </div>

        {/* hover CTA overlay — desktop only */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="buy-card-overlay hidden md:flex"
            >
              <button onClick={handleAdd} className="buy-card-btn buy-card-btn--amber">
                <ShoppingBag size={13} /> Add to Cart
              </button>
              <button onClick={handleBuy} className="buy-card-btn buy-card-btn--black">
                <Zap size={13} /> Buy Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── info ── */}
      <div className="buy-card-info">
        <Eyebrow className="mb-1">{product.collectionName || "theCarryClub Premium"}</Eyebrow>

        <h2 className="buy-card-title">{product.title}</h2>

        {/* stars */}
        <div className="buy-card-stars">
          {[1,2,3,4,5].map(s => (
            <Star key={s} size={11} className={s <= Math.round(Number(averageRating)) ? "fill-yellow-400 stroke-yellow-400" : "fill-gray-200 stroke-gray-200"} />
          ))}
          <span className="buy-card-rating-text">{averageRating} ({totalReviews})</span>
        </div>

        {/* price row */}
        <div className="buy-card-price-row">
          <PriceTag amount={price} size="md" />
          {coupon?.active && (
            <span className="buy-card-coupon">
              <Tag size={9} />&#8377;{coupon.payJust} with {coupon.code}
            </span>
          )}
        </div>

        {/* mobile quick-add */}
        <div className="flex gap-2 mt-3 md:hidden">
          <button onClick={handleAdd} className="buy-card-btn buy-card-btn--amber flex-1 text-[10px]">
            <ShoppingBag size={11} /> Add
          </button>
          <button onClick={handleBuy} className="buy-card-btn buy-card-btn--black flex-1 text-[10px]">
            <Zap size={11} /> Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── accordion item ─────────────────────────────────────────────── */
function Accordion({ title, items, open, onToggle }: { title: string; items: string[]; open: boolean; onToggle: () => void }) {
  return (
    <div className="pd-accordion">
      <button className="pd-accordion-trigger" onClick={onToggle}>
        <span>{title}</span>
        <ChevronDown size={16} className={`pd-accordion-chevron ${open ? "pd-accordion-chevron--open" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <ul className="pd-accordion-body">
              {items.map((item, i) => (
                <li key={i} className="pd-accordion-item">
                  <span className="pd-accordion-dot" />{item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── spec cards data ─────────────────────────────────────────────── */
const SPEC_CARDS = [
  { Icon: Leaf,       label: "Premium Vegan\nLeather" },
  { Icon: CreditCard, label: "Holds 6–8\nCards" },
  { Icon: Layers,     label: "Ultra-Slim\n3mm Profile" },
  { Icon: BadgeCheck, label: "Embossed\nCarryClub Logo" },
  { Icon: Truck,      label: "Free Shipping\nAll Orders" },
];

/* ─── detail panel ────────────────────────────────────────────────── */
function ProductDetail({
  product, onBack, coupon, averageRating, totalReviews,
}: {
  product: any; onBack: () => void; coupon: CouponInfo;
  reviews: any[]; averageRating: string; totalReviews: number;
}) {
  const [activeImg, setActiveImg]     = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>("features");
  const [showForm, setShowForm]       = useState(false);
  const [newReview, setNewReview]     = useState({ name: "", text: "", stars: 5 });

  const price   = product.price || PRODUCT_PRICE;
  const slug    = product.slug?.current;
  const media   = getProductMedia(product);
  const tagline = product.tagline || descriptions[product.title]?.tagline;
  const bullets = product.bullets?.length ? product.bullets : (descriptions[product.title]?.bullets ?? []);

  const accordions = [
    {
      key: "features",
      title: "Features & Details",
      items: bullets.length > 0 ? bullets : ["Premium Vegan Leather", "Matte Stealth Finish", "Embossed CarryClub Logo", "Holds 6–8 Cards"],
    },
    {
      key: "materials",
      title: "Materials & Care",
      items: [
        "Premium Vegan Leather exterior",
        "Reinforced card slots with snap-fit retention",
        "Wipe clean with a soft, damp cloth",
        "Avoid prolonged exposure to direct sunlight",
        "Do not machine wash or submerge in water",
      ],
    },
    {
      key: "shipping",
      title: "Shipping & Returns",
      items: [
        "Free shipping across India on all orders",
        "Cash on Delivery available",
        "7-day no-questions-asked returns",
        "Orders dispatched within 24–48 hours",
        "Tracked delivery via trusted courier partners",
      ],
    },
    {
      key: "inbox",
      title: "What’s In The Box",
      items: [
        "1× Premium iWallet",
        "1× Dust Protection Bag",
        "1× Authenticity Card",
        "1× Care Instructions Card",
      ],
    },
  ];

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    await addToCart(slug);
    toast.success("Added to cart");
    trackConversion({ event_name: "add_to_cart", content_ids: [slug], value: price, currency: "INR" });
  };
  const handleBuy = async (e: React.MouseEvent) => {
    e.preventDefault();
    await addToCart(slug);
    trackConversion({ event_name: "add_to_cart", content_ids: [slug], value: price, currency: "INR" });
    window.location.href = "/cart";
  };
  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newReview) });
    if (res.ok) { setNewReview({ name: "", text: "", stars: 5 }); setShowForm(false); toast.success("Review submitted!"); }
    else toast.error("Failed to submit.");
  };

  const activeMedia = media[activeImg] ?? media[0];

  return (
    <motion.div key="details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-5xl mx-auto">
      <BackButton onClick={onBack} label="Back to Products" className="mb-6 md:mb-8" />

      {/* ── main card ── */}
      <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl overflow-hidden mb-4 md:mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* LEFT — image + thumbnails */}
          <div className="pd-img-panel">
            {/* main image */}
            <div className="pd-img-main">
              {activeMedia.type === "video" ? (
                <video src={activeMedia.desktop} autoPlay loop muted playsInline controls className="w-full h-full object-contain rounded-xl" />
              ) : (
                <>
                  <Image src={activeMedia.desktop} alt={product.title} fill unoptimized sizes="50vw" className="object-contain hidden md:block" />
                  <Image src={activeMedia.mobile}  alt={product.title} fill unoptimized sizes="100vw" className="object-contain block md:hidden" />
                </>
              )}
            </div>
            {/* thumbnail strip */}
            <div className="pd-thumbs">
              {media.map((m: any, i: number) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`pd-thumb ${i === activeImg ? "pd-thumb--active" : ""}`}>
                  {m.type === "video" ? (
                    <span className="text-[8px] font-bold text-gray-400">▶</span>
                  ) : (
                    <Image src={m.desktop} alt={`View ${i+1}`} fill unoptimized sizes="64px" className="object-cover" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — info */}
          <div className="pd-info">
            <Eyebrow className="mb-1">{product.brand || "theCarryClub Premium"}</Eyebrow>
            <h2 className="pd-title">{product.title}</h2>

            {/* rating row */}
            <div className="pd-rating-row">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= Math.round(Number(averageRating)) ? "fill-yellow-400 stroke-yellow-400" : "fill-gray-200 stroke-gray-200"} />)}
              </div>
              <span className="pd-rating-text">{averageRating} ({totalReviews} Reviews)</span>
              <div className="w-px h-3 bg-gray-200 mx-1" />
              <button onClick={() => setShowForm(!showForm)} className="pd-write-review">{showForm ? "Cancel" : "Write Review"}</button>
            </div>

            {/* review form */}
            <AnimatePresence>
              {showForm && (
                <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} onSubmit={handleReview} className="pd-review-form overflow-hidden">
                  <input required value={newReview.name} onChange={e => setNewReview({...newReview, name: e.target.value})} placeholder="Your name" className="pd-inp" />
                  <div className="flex gap-1 mb-2">
                    {[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => setNewReview({...newReview, stars: s})}><Star size={17} className={s <= newReview.stars ? "fill-black stroke-black" : "fill-gray-200 stroke-gray-200"} /></button>)}
                  </div>
                  <textarea required value={newReview.text} onChange={e => setNewReview({...newReview, text: e.target.value})} placeholder="Share your experience..." className="pd-inp pd-inp--ta" />
                  <button type="submit" className="pd-submit-btn">Submit Review</button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* description */}
            <p className="pd-desc">
              &ldquo;{product.quote || "We really took the Apple Wallet App Logo and brought it to life!"}&rdquo;
            </p>
            {tagline && <p className="pd-tagline">{tagline}</p>}

            {/* price */}
            <div className="pd-price-block">
              <PriceTag amount={price} size="lg" />
              {coupon?.active && (
                <span className="pd-coupon-pill">
                  <Tag size={9} /> &#8377;{coupon.payJust} with coupon {coupon.code}
                </span>
              )}
            </div>

            {/* CTAs */}
            <div className="flex gap-3 mb-5">
              <button onClick={handleAdd} className="buy-card-btn buy-card-btn--amber flex-1 py-3 md:py-3.5 text-xs">ADD TO CART</button>
              <button onClick={handleBuy} className="buy-card-btn buy-card-btn--black flex-1 py-3 md:py-3.5 text-xs">BUY NOW</button>
            </div>

            {/* accordions */}
            <div className="pd-accordions">
              {accordions.map(a => (
                <Accordion
                  key={a.key}
                  title={a.title}
                  items={a.items}
                  open={openAccordion === a.key}
                  onToggle={() => setOpenAccordion(openAccordion === a.key ? null : a.key)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── spec cards row ── */}
      <div className="pd-specs">
        {SPEC_CARDS.map(({ Icon, label }) => (
          <div key={label} className="pd-spec-card">
            <Icon size={22} strokeWidth={1.5} className="pd-spec-icon" />
            <span className="pd-spec-label">{label.split("\n").map((l, i) => <span key={i} className="block">{l}</span>)}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── main ────────────────────────────────────────────────────────── */
function BuyClientContent({ products = [], wishlist = [] }: any) {
  const [selected, setSelected]   = useState<any>(null);
  const [reviews, setReviews]     = useState<any[]>([]);
  const [coupon, setCoupon]       = useState<CouponInfo>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    fetch("/api/reviews").then(r => r.ok ? r.json() : []).then(setReviews).catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/coupon").then(r => r.json()).then(c => {
      if (!c?.couponCode) return;
      const base = PRODUCT_PRICE;
      const payJust = c.discountType === "percent"
        ? Math.round(base * (1 - c.discountAmount / 100))
        : base - c.discountAmount;
      setCoupon({ code: c.couponCode, label: c.displayLabel, payJust, active: c.isActive });
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const slug = searchParams.get("product");
    if (slug && products.length) {
      const p = products.find((x: any) => x.slug?.current === slug);
      if (p) setSelected(p);
    }
  }, [searchParams, products]);

  useEffect(() => {
    if (selected) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      trackConversion({ event_name: "view_content", content_ids: [selected.slug?.current], value: selected.price || PRODUCT_PRICE, currency: "INR" });
    }
  }, [selected]);

  const avg   = reviews.length ? (reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1) : "5.0";
  const total = reviews.length;

  return (
    <section className="min-h-screen bg-[#F5F3EF] pt-28 md:pt-40 pb-20 px-4 md:px-8 flex flex-col">
      <AnimatePresence mode="wait">
        {!selected ? (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-6xl mx-auto w-full">

            {/* header */}
            <div className="text-center mb-10 md:mb-16">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand mb-3">theCarryClub Collection</p>
              <h1 className="text-4xl md:text-7xl font-bold font-serif tracking-tighter leading-[0.9]">
                Select Your <span className="text-brand">Style.</span>
              </h1>
              <p className="mt-4 text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Minimal &middot; Premium &middot; Engineered to Carry
              </p>
            </div>

            {/* grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((p: any, i: number) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  idx={i}
                  onSelect={setSelected}
                  wishlist={wishlist}
                  coupon={coupon}
                  averageRating={avg}
                  totalReviews={total}
                />
              ))}
            </div>

            {/* trust strip */}
            <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-6 md:gap-10">
              {["Free Shipping", "7-Day Returns", "Cash on Delivery", "Premium Packaging"].map(t => (
                <div key={t} className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <span className="w-1 h-1 rounded-full bg-brand" />{t}
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <ProductDetail
            product={selected}
            onBack={() => setSelected(null)}
            coupon={coupon}
            reviews={reviews}
            averageRating={avg}
            totalReviews={total}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export default function BuyClient(props: any) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F3EF] flex items-center justify-center"><span className="text-xs text-gray-400 uppercase tracking-widest font-black">Loading...</span></div>}>
      <BuyClientContent {...props} />
    </Suspense>
  );
}
