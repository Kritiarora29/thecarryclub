import type { Metadata } from "next";
import Hero from "@/components/Hero";

export const metadata: Metadata = {
  title: "Buy Premium Slim Wallets Online India | iWallet",
  description:
    "Shop the iWallet — the world's slimmest premium vegan leather wallet. Available in Black, Space Grey & White. Free shipping across India. 7-day easy returns.",
  alternates: {
    canonical: "https://thecarryclub.com",
  },
};

// JSON-LD structured data for rich Google results
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "theCarryClub",
  url: "https://thecarryclub.com",
  description: "Premium slim vegan leather wallets engineered for the modern lifestyle.",
  image: "https://thecarryclub.com/black_wallet.jpeg",
  priceRange: "₹₹",
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@thecarryclub.in",
    contactType: "customer service",
  },
};

export default function Home() {
  return (
    <>
      {/* JSON-LD for rich search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
    </>
  );
}
