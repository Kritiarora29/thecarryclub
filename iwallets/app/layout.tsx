import "./globals.css";
import type { Metadata, Viewport } from "next";
import LayoutClient from "@/components/LayoutClient";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff3366",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://thecarryclub.com"),
  title: {
    default: "theCarryClub – Premium Slim Wallets | iWallet",
    template: "%s | theCarryClub",
  },
  description:
    "Discover the world's slimmest premium vegan leather wallets. Engineered for the modern lifestyle. Free shipping across India. 7-day easy returns.",
  keywords: [
    "slim wallet",
    "minimalist wallet",
    "vegan leather wallet",
    "iWallet",
    "premium wallet India",
    "theCarryClub",
    "buy wallet online India",
  ],
  openGraph: {
    title: "theCarryClub – Premium Slim Wallets",
    description: "The only wallet you'll ever need. Crafted from premium vegan leather.",
    url: "https://thecarryclub.com",
    siteName: "theCarryClub",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "theCarryClub – Premium Slim Wallets",
    description: "Discover the world's slimmest vegan leather wallet.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}