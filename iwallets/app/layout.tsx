import "./globals.css";
import type { Metadata, Viewport } from "next";
import LayoutClient from "@/components/LayoutClient";
import Script from "next/script";

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
  other: {
    "facebook-domain-verification": "sg638gxpiczfi2i69z1l4lnh8165c9",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '898817735950340');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=898817735950340&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}