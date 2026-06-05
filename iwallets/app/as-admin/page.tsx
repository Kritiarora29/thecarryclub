"use client";

import { useEffect, useState } from "react";
import {
  Tag, IndianRupee, Save, LogOut, Eye, EyeOff,
  CheckCircle, XCircle, RefreshCw, ToggleLeft, ToggleRight,
  Package, Pencil,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────

interface CouponConfig {
  couponCode: string;
  discountAmount: number;
  discountType: "flat" | "percent";
  minOrderAmount: number;
  isActive: boolean;
  displayLabel: string;
}

interface Product {
  _id: string;
  title: string;
  color: string;
  price: number;
  imageUrl?: string;
  slug?: { current: string };
}

type Tab = "coupon" | "prices";

// ─── Component ────────────────────────────────────────────────────────────

export default function AsAdminPage() {
  // Auth
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pw, setPw] = useState("");
  const [email, setEmail] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  // Tab
  const [tab, setTab] = useState<Tab>("coupon");

  // Coupon
  const [coupon, setCoupon] = useState<CouponConfig>({
    couponCode: "SAVE400",
    discountAmount: 400,
    discountType: "flat",
    minOrderAmount: 0,
    isActive: true,
    displayLabel: "Save ₹400",
  });
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponSaving, setCouponSaving] = useState(false);
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [editPrices, setEditPrices] = useState<Record<string, string>>({});
  const [prodLoading, setProdLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [prodMsgs, setProdMsgs] = useState<Record<string, { ok: boolean; text: string }>>({});

  // ── Auth check ──────────────────────────────────────────────────────────

  useEffect(() => {
    fetch("/api/admin-check")
      .then(r => r.json())
      .then(d => { setAuthed(d.authenticated); setChecking(false); })
      .catch(() => setChecking(false));
  }, []);

  const login = async () => {
    setLoggingIn(true); setLoginErr("");
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pw }),
    });
    if (res.ok) { setAuthed(true); }
    else { setLoginErr("Invalid credentials."); }
    setLoggingIn(false);
  };

  const logout = async () => {
    await fetch("/api/admin-logout", { method: "POST" });
    setAuthed(false);
  };

  // ── Data load ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!authed) return;
    if (tab === "coupon") loadCoupon();
    if (tab === "prices") loadProducts();
  }, [authed, tab]);

  const loadCoupon = async () => {
    setCouponLoading(true);
    const res = await fetch("/api/as-admin/coupon");
    if (res.ok) {
      const { config } = await res.json();
      setCoupon(config);
    }
    setCouponLoading(false);
  };

  const loadProducts = async () => {
    setProdLoading(true);
    const res = await fetch("/api/as-admin/products");
    if (res.ok) {
      const { products: p } = await res.json();
      setProducts(p);
      const prices: Record<string, string> = {};
      p.forEach((prod: Product) => { prices[prod._id] = String(prod.price); });
      setEditPrices(prices);
    }
    setProdLoading(false);
  };

  // ── Coupon save ─────────────────────────────────────────────────────────

  const saveCoupon = async () => {
    setCouponSaving(true); setCouponMsg(null);
    const res = await fetch("/api/as-admin/coupon", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coupon),
    });
    if (res.ok) {
      const { config } = await res.json();
      setCoupon(config);
      setCouponMsg({ ok: true, text: "Coupon settings saved." });
    } else {
      setCouponMsg({ ok: false, text: "Failed to save." });
    }
    setCouponSaving(false);
    setTimeout(() => setCouponMsg(null), 3500);
  };

  // ── Product price save ──────────────────────────────────────────────────

  const savePrice = async (id: string) => {
    setSavingId(id);
    setProdMsgs(m => ({ ...m, [id]: { ok: false, text: "" } }));
    const price = Number(editPrices[id]);
    if (isNaN(price) || price <= 0) {
      setProdMsgs(m => ({ ...m, [id]: { ok: false, text: "Enter a valid price." } }));
      setSavingId(null); return;
    }
    const res = await fetch("/api/as-admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, price }),
    });
    if (res.ok) {
      const { product } = await res.json();
      setProducts(ps => ps.map(p => p._id === id ? { ...p, price: product.price } : p));
      setProdMsgs(m => ({ ...m, [id]: { ok: true, text: `Saved ₹${product.price}` } }));
    } else {
      setProdMsgs(m => ({ ...m, [id]: { ok: false, text: "Save failed." } }));
    }
    setSavingId(null);
    setTimeout(() => setProdMsgs(m => { const n = { ...m }; delete n[id]; return n; }), 3000);
  };

  // ── Render: checking ────────────────────────────────────────────────────

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw size={22} className="animate-spin text-[#B45309]" />
      </div>
    );
  }

  // ── Render: login ───────────────────────────────────────────────────────

  if (!authed) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <p className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 mb-2">theCarryClub</p>
            <h1 className="text-2xl font-bold tracking-tight">Control Panel</h1>
            <p className="text-sm text-neutral-500 mt-1">Restricted access</p>
          </div>

          <div className="bg-[#161616] border border-neutral-800 rounded-2xl p-7 flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && login()}
              className="bg-[#1E1E1E] border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#B45309] transition-colors placeholder:text-neutral-600"
            />

            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                onKeyDown={e => e.key === "Enter" && login()}
                className="w-full bg-[#1E1E1E] border border-neutral-700 rounded-xl px-4 py-3 pr-11 text-sm outline-none focus:border-[#B45309] transition-colors placeholder:text-neutral-600"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {loginErr && <p className="text-rose-400 text-xs text-center">{loginErr}</p>}

            <button
              onClick={login}
              disabled={loggingIn || !email || !pw}
              className="w-full py-3 bg-[#B45309] hover:bg-[#92400E] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loggingIn ? <RefreshCw size={14} className="animate-spin" /> : null}
              {loggingIn ? "Checking…" : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: panel ───────────────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-neutral-800 px-6 md:px-10 py-4 flex items-center justify-between sticky top-0 bg-[#0D0D0D] z-10">
        <div>
          <p className="text-[9px] tracking-[0.22em] uppercase text-neutral-600">theCarryClub</p>
          <h1 className="text-sm font-bold tracking-tight mt-0.5">Control Panel</h1>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-xs text-neutral-500 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-neutral-800"
        >
          <LogOut size={13} /> Sign out
        </button>
      </header>

      {/* Tabs */}
      <div className="border-b border-neutral-800 px-6 md:px-10">
        <div className="flex gap-1">
          {(["coupon", "prices"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3.5 text-xs font-semibold tracking-wide border-b-2 transition-colors -mb-px capitalize flex items-center gap-1.5 ${
                tab === t
                  ? "border-[#B45309] text-white"
                  : "border-transparent text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {t === "coupon" ? <Tag size={12} /> : <IndianRupee size={12} />}
              {t === "coupon" ? "Coupon Settings" : "Product Prices"}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 md:px-10 py-10">

        {/* ══ COUPON TAB ══════════════════════════════════════════════════ */}
        {tab === "coupon" && (
          <div>
            <div className="mb-7">
              <h2 className="text-lg font-bold">Coupon Settings</h2>
              <p className="text-xs text-neutral-500 mt-1">Configure the discount coupon shown at checkout.</p>
            </div>

            {couponLoading ? (
              <div className="flex items-center gap-2 text-neutral-500 py-10 justify-center">
                <RefreshCw size={16} className="animate-spin" /> Loading…
              </div>
            ) : (
              <div className="bg-[#161616] border border-neutral-800 rounded-2xl overflow-hidden">

                {/* Active toggle */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800">
                  <div>
                    <p className="text-sm font-semibold">Coupon Active</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Enable or disable the coupon site-wide</p>
                  </div>
                  <button
                    onClick={() => setCoupon(c => ({ ...c, isActive: !c.isActive }))}
                    className="flex items-center gap-2 text-sm font-medium transition-colors"
                  >
                    {coupon.isActive
                      ? <><ToggleRight size={28} className="text-[#B45309]" /><span className="text-[#B45309]">ON</span></>
                      : <><ToggleLeft size={28} className="text-neutral-600" /><span className="text-neutral-500">OFF</span></>
                    }
                  </button>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-6">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">Coupon Code</label>
                    <input
                      value={coupon.couponCode}
                      onChange={e => setCoupon(c => ({ ...c, couponCode: e.target.value.toUpperCase() }))}
                      placeholder="SAVE400"
                      className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl px-4 py-3 text-sm font-mono font-bold tracking-widest outline-none focus:border-[#B45309] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">Discount Amount</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">
                        {coupon.discountType === "flat" ? "₹" : "%"}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={coupon.discountAmount}
                        onChange={e => setCoupon(c => ({ ...c, discountAmount: Number(e.target.value) }))}
                        className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl px-4 py-3 pl-8 text-sm outline-none focus:border-[#B45309] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">Discount Type</label>
                    <div className="flex gap-3">
                      {(["flat", "percent"] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setCoupon(c => ({ ...c, discountType: type }))}
                          className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors capitalize ${
                            coupon.discountType === type
                              ? "bg-[#B45309]/20 border-[#B45309] text-[#B45309]"
                              : "bg-[#1A1A1A] border-neutral-700 text-neutral-400 hover:border-neutral-500"
                          }`}
                        >
                          {type === "flat" ? "Flat (₹)" : "Percent (%)"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">Min Order Amount (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">₹</span>
                      <input
                        type="number"
                        min="0"
                        value={coupon.minOrderAmount}
                        onChange={e => setCoupon(c => ({ ...c, minOrderAmount: Number(e.target.value) }))}
                        className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl px-4 py-3 pl-8 text-sm outline-none focus:border-[#B45309] transition-colors"
                      />
                    </div>
                    <p className="text-xs text-neutral-600 mt-1">0 = no minimum</p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">Display Label</label>
                    <input
                      value={coupon.displayLabel}
                      onChange={e => setCoupon(c => ({ ...c, displayLabel: e.target.value }))}
                      placeholder="Save ₹400"
                      className="w-full bg-[#1A1A1A] border border-neutral-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#B45309] transition-colors"
                    />
                    <p className="text-xs text-neutral-600 mt-1">Shown to customers in UI (e.g. "Save ₹400")</p>
                  </div>
                </div>

                {/* Preview */}
                <div className="mx-6 mb-6 bg-[#1A1A1A] border border-neutral-700 rounded-xl p-4">
                  <p className="text-xs text-neutral-500 mb-2 uppercase tracking-wider font-semibold">Preview</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1.5 rounded-lg border font-mono text-sm font-bold tracking-widest ${
                      coupon.isActive ? "bg-[#B45309]/15 border-[#B45309]/40 text-[#B45309]" : "bg-neutral-800 border-neutral-700 text-neutral-500 line-through"
                    }`}>
                      {coupon.couponCode || "CODE"}
                    </span>
                    <span className="text-sm text-neutral-300">
                      {coupon.discountType === "flat"
                        ? `₹${coupon.discountAmount} off`
                        : `${coupon.discountAmount}% off`
                      }
                      {coupon.minOrderAmount > 0 && ` · min ₹${coupon.minOrderAmount}`}
                      {` · ${coupon.displayLabel}`}
                    </span>
                    {!coupon.isActive && <span className="text-xs text-rose-400 font-semibold">INACTIVE</span>}
                  </div>
                </div>

                {/* Save */}
                <div className="px-6 pb-6 flex items-center gap-4">
                  <button
                    onClick={saveCoupon}
                    disabled={couponSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-[#B45309] hover:bg-[#92400E] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-colors"
                  >
                    {couponSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                    {couponSaving ? "Saving…" : "Save Changes"}
                  </button>
                  {couponMsg && (
                    <div className={`flex items-center gap-1.5 text-sm ${couponMsg.ok ? "text-emerald-400" : "text-rose-400"}`}>
                      {couponMsg.ok ? <CheckCircle size={14} /> : <XCircle size={14} />}
                      {couponMsg.text}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ PRODUCT PRICES TAB ══════════════════════════════════════════ */}
        {tab === "prices" && (
          <div>
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Product Prices</h2>
                <p className="text-xs text-neutral-500 mt-1">Update selling prices for each product variant.</p>
              </div>
              <button
                onClick={loadProducts}
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-neutral-800 mt-1"
              >
                <RefreshCw size={12} /> Refresh
              </button>
            </div>

            {prodLoading ? (
              <div className="flex items-center gap-2 text-neutral-500 py-10 justify-center">
                <RefreshCw size={16} className="animate-spin" /> Loading products…
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-neutral-600">
                <Package size={32} strokeWidth={1} />
                <p className="text-sm">No products found in database.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {products.map(prod => (
                  <div
                    key={prod._id}
                    className="bg-[#161616] border border-neutral-800 rounded-2xl p-5 flex items-center gap-4"
                  >
                    {/* Product image */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#1E1E1E] flex-shrink-0">
                      {prod.imageUrl ? (
                        <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-700">
                          <Package size={20} />
                        </div>
                      )}
                    </div>

                    {/* Name + current price */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{prod.title}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{prod.color || "—"}</p>
                      <p className="text-xs text-neutral-600 mt-1">Current: <span className="text-neutral-300 font-mono font-semibold">₹{prod.price}</span></p>
                    </div>

                    {/* Price input + save */}
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs">₹</span>
                        <input
                          type="number"
                          min="1"
                          value={editPrices[prod._id] ?? prod.price}
                          onChange={e => setEditPrices(p => ({ ...p, [prod._id]: e.target.value }))}
                          onKeyDown={e => e.key === "Enter" && savePrice(prod._id)}
                          className="w-28 bg-[#1A1A1A] border border-neutral-700 rounded-xl px-3 py-2.5 pl-7 text-sm font-mono outline-none focus:border-[#B45309] transition-colors"
                        />
                      </div>
                      <button
                        onClick={() => savePrice(prod._id)}
                        disabled={savingId === prod._id}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-[#B45309] hover:bg-[#92400E] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-semibold transition-colors whitespace-nowrap"
                      >
                        {savingId === prod._id
                          ? <RefreshCw size={12} className="animate-spin" />
                          : <Save size={12} />
                        }
                        {savingId === prod._id ? "…" : "Save"}
                      </button>
                    </div>

                    {/* Feedback */}
                    {prodMsgs[prod._id] && (
                      <div className={`flex items-center gap-1 text-xs flex-shrink-0 ${prodMsgs[prod._id].ok ? "text-emerald-400" : "text-rose-400"}`}>
                        {prodMsgs[prod._id].ok ? <CheckCircle size={12} /> : <XCircle size={12} />}
                        {prodMsgs[prod._id].text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
