"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useUTMCapture } from "@/lib/analytics";
import { trackPageView } from "@/lib/analytics";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  useUTMCapture();

  useEffect(() => {
    document.body.style.overflow = "";
    document.body.style.height = "";
    document.documentElement.style.overflow = "";
    window.scrollTo(0, 0);
    trackPageView(pathname);
  }, [pathname]);

  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!isAdmin && <Footer />}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { background: "#111", color: "#fff", borderRadius: "10px" },
        }}
      />
    </>
  );
}
