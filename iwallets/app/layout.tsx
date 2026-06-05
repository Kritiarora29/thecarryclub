import "./globals.css";
import "@/styles/navbar.css";
import "@/styles/landing.css";
import type { Metadata, Viewport } from "next";
import LayoutClient from "@/components/LayoutClient";
import Script from "next/script";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff3366",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://thecarryclub.in"),
  title: {
    default: "theCarryClub – Premium Slim iWallet | Vegan Leather",
    template: "%s | theCarryClub",
  },
  description:
    "India's slimmest premium vegan leather iWallet. Holds 8+ cards, fits every pocket. Free shipping pan India · 7-day easy returns · Starting ₹999.",
  keywords: [
    "slim wallet india", "minimalist wallet", "vegan leather wallet",
    "iWallet", "premium wallet India", "theCarryClub", "buy slim wallet",
    "card holder wallet india",
  ],
  openGraph: {
    title: "theCarryClub – Premium Slim iWallet",
    description: "India's slimmest vegan leather wallet. Holds 8+ cards. Free shipping.",
    url: "https://thecarryclub.in",
    siteName: "theCarryClub",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "theCarryClub – Premium Slim iWallet",
    description: "India's slimmest vegan leather wallet. Free shipping pan India.",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  other: { "facebook-domain-verification": "sg638gxpiczfi2i69z1l4lnh8165c9" },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-WHDR6L7P";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "898817735950340";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-head" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>

        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');`}
        </Script>
      </head>
      <body>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0" width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Meta Pixel noscript fallback */}
        <noscript>
          <img
            height="1" width="1" style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
