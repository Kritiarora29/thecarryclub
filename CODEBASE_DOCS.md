# theCarryClub – Complete Codebase Documentation

> Project root: `iwallets/` (Next.js 16 App Router)
> Last updated: 2026-06-05 | Branch: patch-fixes-1 | Commit: 5437859

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Folder Structure](#2-folder-structure)
3. [Design System & Theming](#3-design-system--theming)
4. [Database Schemas (MongoDB / Mongoose)](#4-database-schemas)
5. [API Routes](#5-api-routes)
6. [Frontend Pages & Components](#6-frontend-pages--components)
7. [Library / Utility Layer (`lib/`)](#7-library--utility-layer)
8. [Data Flow Diagrams](#8-data-flow-diagrams)
9. [Environment Variables Required](#9-environment-variables-required)
10. [What Is Working](#10-what-is-working)
11. [What Is Broken / Not Working](#11-what-is-broken--not-working)
12. [Dead Code & Files That Should Be Removed](#12-dead-code--files-that-should-be-removed)
13. [Unused npm Dependencies](#13-unused-npm-dependencies)

---

## 1. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript + TSX |
| Database | MongoDB via Mongoose |
| Auth | NextAuth v4 (Google + Email) |
| Payments | Razorpay (SDK + Checkout.js) |
| Shipping | NimbusPost API (+ Simulator Mode) |
| Email | Nodemailer (SMTP) |
| Styling | Tailwind CSS v4 + CSS-in-JS (`<style jsx global>`) |
| Font | Replica (self-hosted `.ttf`, commercial Lineto typeface) |
| Animation | Framer Motion |
| Charts | Recharts (admin dashboard) |
| 3D | Three.js + @react-three/fiber + @react-three/drei |
| Icons | Lucide React |

---

## 2. Folder Structure

```
iwallets/
├── app/
│   ├── globals.css              # Tailwind @import, @font-face, @theme tokens, base reset
│   ├── layout.tsx               # Root layout — no Google Fonts; uses Replica via globals.css
│   ├── page.tsx                 # Homepage → renders PremiumLanding
│   ├── buy/
│   │   ├── page.tsx             # Product detail/shop page (server)
│   │   └── BuyClient.tsx        # Interactive buy page (client) — TCC tokens throughout
│   ├── cart/
│   │   ├── page.tsx             # Cart page (server — reads cookie)
│   │   └── CartClient.tsx       # Full checkout UI (client) — TCC tokens throughout
│   ├── wishlist/
│   │   ├── page.tsx             # Wishlist page (server)
│   │   └── WishlistClient.tsx   # Wishlist UI (client) — TCC tokens throughout
│   ├── privacy/
│   │   └── page.tsx             # Privacy policy — uses text-brand/bg-brand tokens
│   ├── returns/
│   │   └── page.tsx             # Returns policy — uses text-brand/bg-brand tokens
│   ├── pay/[orderId]/
│   │   ├── page.tsx             # COD→Prepaid conversion page
│   │   └── PayClient.tsx        # Payment UI for existing COD orders
│   ├── admin/
│   │   ├── layout.tsx           # Admin layout (auth guard)
│   │   ├── page.tsx             # Admin dashboard (orders + products + settings)
│   │   └── orders/
│   │       ├── page.tsx         # Admin orders list
│   │       └── [id]/page.tsx    # Admin order detail + shipping
│   └── api/
│       ├── order/
│       │   ├── route.ts
│       │   └── [orderId]/pay/route.ts
│       ├── razorpay/
│       │   ├── order/route.ts
│       │   ├── verify/route.ts
│       │   └── webhook/route.ts
│       ├── nimbus/
│       │   ├── config/route.ts
│       │   ├── serviceability/route.ts
│       │   ├── ship/route.ts
│       │   ├── track/route.ts
│       │   ├── cancel/route.ts
│       │   ├── warehouses/route.ts
│       │   └── test-connection/route.ts
│       ├── admin-orders/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── admin-product/route.ts
│       ├── cart-count/route.ts  # GET — returns cart item count from cookie
│       ├── admin-check/route.ts # GET — returns { authenticated: bool }
│       ├── admin-logout/route.ts# POST — clears admin session
│       ├── reviews/route.ts
│       └── verify/
│           ├── send/route.ts
│           ├── confirm/route.ts
│           └── status/route.ts
│
├── components/
│   ├── ui/
│   │   └── tcc.tsx              # TCC design system: Button, Card, PageShell, Eyebrow,
│   │                            #   Heading, PageHeader, PriceTag, BackButton, Divider, Badge
│   ├── AdminLoginModal.tsx
│   ├── AnnouncementBar.tsx
│   ├── AuthProvider.tsx
│   ├── BuyNowButton.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── LayoutClient.tsx         # Client wrapper — mounts Navbar + Footer + Toaster
│   ├── Logo.tsx
│   ├── Navbar.tsx               # ★ Redesigned — Ekster-style: centered logo, nav left,
│   │                            #   icons right, coupon tape announcement bar, CSS-in-JS
│   ├── OrdersTable.tsx
│   ├── PremiumLanding.tsx       # ★ Redesigned — Ekster-style full-bleed hero slider,
│   │                            #   3 slides, consistent section colors, CSS-in-JS
│   ├── ProductView.tsx
│   ├── RazorpayCheckout.tsx
│   ├── SignIn.tsx
│   ├── WalletModel.tsx
│   └── WalletShowcase.tsx
│
├── lib/
│   ├── analytics.ts             # trackConversion, trackPageView, useUTMCapture
│   ├── cart.ts
│   ├── cartActions.ts
│   ├── mongodb.ts
│   ├── orderActions.ts          # ⚠️ DEAD — stub, never called
│   ├── sendMail.ts
│   ├── wishlist.ts
│   └── wishlistActions.ts
│
├── models/
│   ├── NimbusConfig.ts
│   ├── Order.ts
│   ├── Product.ts
│   ├── Review.ts
│   └── Verification.ts
│
├── public/
│   ├── fonts/                   # Self-hosted Replica font files
│   │   ├── fonnts.com-ReplicaPro.ttf         # weights 300–500
│   │   ├── fonnts.com-Replica-Bold.ttf       # weights 600–900
│   │   ├── fonnts.com-ReplicaPro-Italic.ttf  # italic 300–500
│   │   └── fonnts.com-Replica_ProTT_Heavy.ttf # reserved / not declared yet
│   └── Iwallet - Images/        # Product photography (by colour/device)
│       ├── Prod image- desk-Black/
│       ├── Prod image-desk-grey/
│       └── Prod image- desk -White/
│
├── global.d.ts                  # declare module "*.css" — fixes TS2688 CSS import error
├── tsconfig.json                # includes global.d.ts
└── package.json
```

---

## 3. Design System & Theming

### 3.1 Fonts

Replica (commercial Lineto typeface) is the **sole typeface** across the entire site.
Google Fonts (`next/font/google`) was removed from `layout.tsx` in this branch.

**`@font-face` declarations in `app/globals.css`:**

| File | Weights served |
|------|---------------|
| `fonnts.com-ReplicaPro.ttf` | 300–500 (light, regular, medium) |
| `fonnts.com-Replica-Bold.ttf` | 600–900 (semi-bold, bold, heavy) |
| `fonnts.com-ReplicaPro-Italic.ttf` | 300–500 italic |

CSS custom property: `--font-sans: "Replica", ui-sans-serif, system-ui, sans-serif`

All component CSS-in-JS blocks use `--ff: "Replica", ui-sans-serif, system-ui, sans-serif` (defined per component).

### 3.2 Colour Tokens (Tailwind v4 `@theme`)

Defined in `app/globals.css` under `@theme {}`. Auto-generates `bg-*`, `text-*`, `border-*` Tailwind utilities.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-brand` | `#B45309` | Primary accent (amber/orange) — buttons, highlights |
| `--color-brand-hover` | `#92400E` | Brand hover state |
| `--color-brand-light` | `#FEF3C7` | Amber tint backgrounds |
| `--color-surface` | `#F0EFEC` | Page background (neutral warm-gray) |
| `--color-surface-card` | `#FFFFFF` | Card/panel backgrounds |
| `--color-muted` | `#E8E5DF` | Muted section backgrounds |
| `--color-primary` | `#1A1A1A` | Body text, headings |
| `--color-primary-foreground` | `#F0EFEC` | Text on dark/brand backgrounds |
| `--color-muted-foreground` | `#9CA3AF` | Secondary/hint text |
| `--color-border` | `#E8E4DF` | Dividers, card borders |

**Usage rule:** Always use token classes (`text-brand`, `bg-surface`, `text-primary`, `text-muted-foreground`, `border-border`) — never hardcode hex values. Admin pages are excluded (they use their own `#ff3366` accent).

**Exceptions kept intentionally:**
- `text-emerald-*` — success states (universal UI convention)
- `text-rose-*` — error states (universal UI convention)
- Admin dashboard — separate dark design system with `#ff3366` accent

### 3.3 TCC Component Library (`components/ui/tcc.tsx`)

Single-file design system used across informational/static pages (not the main landing):

| Component | Props |
|-----------|-------|
| `Button` | `variant`, `size`, `href`, `fullWidth`, `type` |
| `Card` | `size` (`sm` / `md` / `lg`) |
| `PageShell` | Wrapper with `bg-surface pt-32` |
| `Eyebrow` | Uppercase tracking label |
| `Heading` | `as` (`h1`/`h2`/`h3`) |
| `PageHeader` | `title`, `subtitle` combo |
| `PriceTag` | `amount`, `size` — renders ₹ price |
| `BackButton` | `href` link with ← |
| `Divider` | `<hr>` with brand styling |
| `Badge` | Pill label |

### 3.4 Navbar CSS Variables

`Navbar.tsx` injects these globals (used site-wide to offset fixed header):

```css
--nb-tape-h: 34px;   /* announcement bar height */
--nb-bar-h:  68px;   /* main nav bar height */
--nb-h: calc(var(--nb-tape-h) + var(--nb-bar-h));  /* ≈ 102px total */
```

Hero and page sections use `padding-top: var(--nb-h)` to clear the fixed header.

### 3.5 Section Color Pattern (PremiumLanding & pages)

| Section type | Background |
|---|---|
| Default / white section | `#FFFFFF` |
| Alternate light section | `#F4F3F0` |
| Dark section | `#111111` |
| Very dark section | `#0C0C0C` |
| Offer/amber strip | `#FFF8EE` |

---

## 4. Database Schemas

### 4.1 Order (`models/Order.ts`)

```
Collection: orders

Field              Type      Notes
─────────────────────────────────────────────────────────────────────
_id                ObjectId  auto
name               String    Customer full name
email              String    Customer email
phone              String    Customer phone
address.street     String
address.city       String
address.state      String
address.pincode    String    6-digit
address.landmark   String    Optional

items[].title      String    Product title
items[].quantity   Number
items[].price      Number    Unit price at purchase time

amount             Number    Total (INR)
paymentId          String    Razorpay payment_id OR "COD"
paymentMethod      String    "prepaid" | "cod"

nimbusShipmentId   String
nimbusAwb          String
nimbusCourier      String
nimbusLabelUrl     String
nimbusStatus       String    manifested|picked_up|in_transit|out_for_delivery|delivered
nimbusShippedAt    Date

createdAt / updatedAt  Date  Mongoose timestamps
```

No unique index on `paymentId` — deduplication done at app level.

### 4.2 Product (`models/Product.ts`)

```
Collection: products

Field           Type      Notes
──────────────────────────────────────────────────────────
_id             ObjectId  auto
title           String    required
slug.current    String    required — auto-generated URL slug
price           Number    required — INR
description     String
color           String    variant label
imageUrl        String    primary image (/uploads/...)
videoUrl        String    video (/uploads/...)
images          [String]  array of image URLs
tagline         String
bullets         [String]  feature bullets
quote           String
subQuote        String
collectionName  String
brand           String
createdAt / updatedAt  Date
```

Files uploaded to `public/uploads/` (server filesystem, not a CDN). Deleted on product delete.

### 4.3 Review (`models/Review.ts`)

```
Collection: reviews

Field    Type     Notes
──────────────────────────────────────
name     String   required
text     String   required
stars    Number   1–5, default 5
approved Boolean  Default: true (auto-approved — no moderation)
createdAt / updatedAt  Date
```

### 4.4 NimbusConfig (`models/NimbusConfig.ts`)

Singleton — only one document (`findOne()`).

```
Collection: nimbusconfigs

email / password   String   ⚠️ password stored plaintext
mode               String   "sandbox" | "production"
isConfigured       Boolean
isSimulator        Boolean  default: true

pickupName / pickupPhone / pickupAddress / pickupCity / pickupState / pickupPincode
```

### 4.5 Verification (`models/Verification.ts`)

Email verification tokens. TTL 15 min. **Currently unused** — see §11.4.

```
email     String   indexed
token     String   unique, 64-char hex
verified  Boolean  default: false
createdAt Date     TTL expires in 900s
```

---

## 5. API Routes

### Order

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/order` | Create order in MongoDB + send confirmation email |
| POST | `/api/order/[orderId]/pay` | Update COD order with Razorpay `paymentId` |

### Razorpay

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/razorpay/order` | Create server-side Razorpay order (**not called by frontend** — see §11.2) |
| POST | `/api/razorpay/verify` | Verify HMAC signature, dedup, create order in DB |
| POST | `/api/razorpay/webhook` | Signature check only — handler is stubbed (see §11.3) |

### NimbusPost Shipping

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/nimbus/config` | Fetch/save credentials + pickup address |
| POST | `/api/nimbus/test-connection` | Test Nimbus login |
| POST | `/api/nimbus/warehouses` | Fetch warehouse list |
| POST | `/api/nimbus/serviceability` | Courier rates for pincode |
| POST | `/api/nimbus/ship` | Book shipment, updates Order AWB/label |
| GET | `/api/nimbus/track` | Track by AWB |
| POST | `/api/nimbus/cancel` | Cancel shipment, clears nimbus* fields |

Simulator mode (`isSimulator: true`) returns mocked data — no real API calls.

### Admin

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin-orders` | All orders (**⚠️ no auth check** — see §11.9) |
| GET | `/api/admin-orders/[id]` | Single order |
| GET | `/api/admin-product` | All products |
| POST | `/api/admin-product` | Create product + upload files |
| DELETE | `/api/admin-product` | Delete product + remove files |
| GET | `/api/cart-count` | Cart item count from cookie |
| GET | `/api/admin-check` | Returns `{ authenticated: bool }` |
| POST | `/api/admin-logout` | Clears admin session |

### Reviews

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/reviews` | All approved reviews, newest first |
| POST | `/api/reviews` | Create review (auto-approved, no rate limit) |

### Email Verification (⚠️ DISABLED)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/verify/send` | Send verification email |
| GET | `/api/verify/confirm` | Mark verified, redirect to cart |
| GET | `/api/verify/status` | Poll verification status |

---

## 6. Frontend Pages & Components

### Pages

| Route | Server Component | Client Component | Description |
|-------|-----------------|------------------|-------------|
| `/` | `app/page.tsx` | `PremiumLanding` | Homepage — Ekster-style hero slider, bestsellers, trust bar, reviews |
| `/buy` | `app/buy/page.tsx` | `BuyClient` | Product detail — colour picker, add-to-cart, reviews |
| `/cart` | `app/cart/page.tsx` | `CartClient` | Checkout — shipping form, order summary, Razorpay/COD |
| `/wishlist` | `app/wishlist/page.tsx` | `WishlistClient` | Saved items |
| `/pay/[orderId]` | `app/pay/[orderId]/page.tsx` | `PayClient` | COD → prepaid conversion |
| `/admin` | — | `app/admin/page.tsx` | Dashboard: charts, product CRUD, Nimbus config |
| `/admin/orders` | — | `app/admin/orders/page.tsx` | Orders table |
| `/admin/orders/[id]` | — | `app/admin/orders/[id]/page.tsx` | Order detail + book/track shipment |

### Key Components

#### `Navbar` (redesigned — Ekster-style)

- **Layout**: 3-column CSS grid — nav links LEFT · logo CENTER · icons RIGHT
- **Announcement tape**: rotating 4-message strip (`--nb-tape-h: 34px`) with coupon code highlight
- **Scroll behaviour**: `border-bottom` + `box-shadow` appear after 10px scroll
- **Cart/wishlist badges**: Polled every 3 s via `/api/cart-count` and cookie parse
- **Mobile drawer**: Full-screen slide-in from top, mounted below fixed header
- **CSS**: All via `<style jsx global>` — defines `--nb-tape-h`, `--nb-bar-h`, `--nb-h` globals
- **Font**: Uses `--ff` (Replica) directly — no `var(--font-display)` / `var(--font-body)` references

#### `PremiumLanding` (redesigned — Ekster-style)

- **Hero**: Full-bleed, `100svh` — 3 slides (one per colour variant), auto-advance every 5.5 s
  - Each slide: product image as bg + heavy left-to-right gradient overlay
  - Text bottom-left: eyebrow / H1 / description / price row / Shop Now + Add to Cart buttons / coupon note
  - Product image right-side with `drop-shadow`
  - Slider controls: left/right arrows + dot nav (below text, desktop left-aligned)
  - Bottom glass strip: colour swatches + thumbnail row (always visible)
- **Sections** (top to bottom):
  1. Bestsellers (white bg) — 3 product cards with swatches, rating, quick-view hover
  2. Trust bar (white) — 4-column grid: Free Shipping · RFID · Returns · Stars
  3. Marquee (dark) — animated ticker
  4. Collection banner (dark) — product image left, feature checklist right
  5. 4 Reasons to Upgrade (dark) — accordion, product image changes on click
  6. Testimonial (darker) — avatar + quote
  7. Lifestyle gallery (white) — 6 cards using product images (replace with editorial shots)
  8. Reviews (gray) — score panel + review cards grid + write-a-review form
  9. Offer strip (amber) — coupon discount callout
  10. Final CTA (full-bleed dark) — image bg + gradient overlay
- **CSS**: All via `<style jsx global>` — section tokens: `--white`, `--gray`, `--dark`, `--accent`

#### `components/ui/tcc.tsx`

Single-file component library used on cart, buy, wishlist, privacy, returns, and other secondary pages. See §3.3.

### Cart System

Cookie `cart` (not `httpOnly`) → `[{ slug: string, qty: number }]`

- Read: `lib/cart.ts → getCart()` (server, `next/headers`)
- Write: `lib/cartActions.ts` server actions
- Count: `/api/cart-count` — read by Navbar every 3 s

### Checkout Flow

```
User fills CartClient form
  → "Review & Place Order" → opens review modal
  → Prepaid: RazorpayCheckout → Razorpay modal (no server order_id — see §11.2)
      → success callback → POST /api/order → DB + email → /success
  → COD: "Place Order" → POST /api/order (paymentId: "COD") → /success
  ⚠️  Cart cookie NOT cleared after either path (see §11.1)
```

---

## 7. Library / Utility Layer

| File | Purpose |
|------|---------|
| `lib/mongodb.ts` | Mongoose singleton with hot-reload cache |
| `lib/cart.ts` | Read/write cart cookie (server-side) |
| `lib/wishlist.ts` | Read/write wishlist cookie (server-side, `httpOnly: true`) |
| `lib/cartActions.ts` | Server actions: `addToCart`, `buyItNow`, `updateQty`, `removeFromCart`, `clearCart` |
| `lib/wishlistActions.ts` | Server actions: `toggleWishlist`, `removeFromWishlist` |
| `lib/sendMail.ts` | Nodemailer transporter + `sendOrderEmail(order)` |
| `lib/analytics.ts` | `trackConversion()`, `trackPageView()`, `useUTMCapture()` — Meta Pixel + GTM |
| `lib/orderActions.ts` | **⚠️ DEAD** — stub `placeOrder`, never called |

---

## 8. Data Flow Diagrams

### Prepaid Order

```
Cart page → form → review modal → RazorpayCheckout
  → window.Razorpay.open() (client, no server order_id)
  → success callback → POST /api/order
  → Order.create() + sendOrderEmail()
  → redirect /success
  ⚠️ cart cookie NOT cleared
```

### COD Order

```
Cart page → form → review modal → "Place Order"
  → POST /api/order { paymentId: "COD" }
  → Order.create() + sendOrderEmail()
  → redirect /success
```

### Admin Shipping

```
/admin/orders/[id]
  → POST /api/nimbus/serviceability → courier list
  → POST /api/nimbus/ship → AWB + label URL saved to Order
  → GET /api/nimbus/track → event timeline
  → POST /api/nimbus/cancel → clears nimbus fields
```

---

## 9. Environment Variables Required

```env
# MongoDB
MONGODB_URI=

# NextAuth
NEXTAUTH_URL=https://thecarryclub.in
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY=

# Email (Nodemailer)
EMAIL_SERVER_HOST=
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=

# Analytics
NEXT_PUBLIC_GTM_ID=GTM-WHDR6L7P
NEXT_PUBLIC_META_PIXEL_ID=898817735950340

# App
NEXT_PUBLIC_URL=https://thecarryclub.in
NEXT_PUBLIC_APP_URL=https://thecarryclub.in
```

---

## 10. What Is Working

| Feature | Status | Notes |
|---------|--------|-------|
| Homepage — hero slider | ✅ | 3-slide auto-advance, controls, colour picker |
| Homepage — all sections | ✅ | Consistent white/gray/dark palette |
| Product browsing (`/buy`, `/`) | ✅ | Products from MongoDB |
| Add to cart | ✅ | Server actions, cookie-based |
| Wishlist | ✅ | Server actions, cookie-based |
| Cart checkout form | ✅ | Validation, address fields |
| COD order placement | ✅ | POST /api/order, email sent |
| Prepaid order (Razorpay) | ✅ | Opens modal, saves on success |
| Order confirmation email | ✅ | Nodemailer HTML template |
| Admin dashboard | ✅ | Orders, products, Nimbus config |
| Admin product CRUD | ✅ | File upload to `/public/uploads/` |
| NimbusPost simulator | ✅ | Mocked couriers/AWB/timeline |
| NimbusPost live mode | ✅ | Sandbox + production |
| Shipment booking / tracking / cancel | ✅ | Via nimbus routes |
| Customer reviews | ✅ | GET + POST, displayed on landing + buy |
| COD → prepaid conversion | ✅ | `/pay/[orderId]` |
| Coupon code SAVE400 | ✅ UI-only | ₹400 discount, no server validation |
| 5% prepaid discount | ✅ UI-only | Client-side calc only |
| 3D wallet model | ✅ | Three.js via `@react-three/fiber` |
| Replica font | ✅ | Self-hosted TTF in `public/fonts/` |
| Design tokens | ✅ | `text-brand`, `bg-surface`, etc. across all pages |
| TypeScript CSS import | ✅ | `global.d.ts` fixes TS2688 |

---

**Confirmed used packages:**

| Package | Where |
|---------|-------|
| `mongoose` | All models + `lib/mongodb.ts` |
| `mongodb` | Required by `@next-auth/mongodb-adapter` |
| `next-auth` | `AuthProvider`, `SignIn`, admin layout |
| `razorpay` | `/api/razorpay/order/route.ts` |
| `nodemailer` | `lib/sendMail.ts` |
| `framer-motion` | `PremiumLanding`, `Navbar`, CartClient, buy page |
| `lucide-react` | All UI components |
| `react-hot-toast` | CartClient, PremiumLanding, buy page |
| `recharts` | Admin dashboard chart |
| `three` + `@react-three/fiber` + `@react-three/drei` | `WalletModel`, `WalletShowcase` |
| `clsx` | Class conditionals |

---

*End of documentation. Last updated: 2026-06-05 — reflects branch `patch-fixes-1` including Ekster-style redesign, Replica font setup, TCC design token unification, and TypeScript fixes.*
