"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Reset scroll lock on every route change (caused by React Three Fiber canvas on home page)
  useEffect(() => {
    document.body.style.overflow = "";
    document.body.style.height = "";
    document.documentElement.style.overflow = "";
    window.scrollTo(0, 0);
  }, [pathname]);

  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {/* ❌ Hide Navbar on admin (Navbar already has its own promo bar) */}
      {!isAdmin && <Navbar />}

      {/* ✅ Main content */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* ❌ Hide Footer on admin */}
      {!isAdmin && <Footer />}

      {/* 🔔 Global Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#111",
            color: "#fff",
            borderRadius: "10px",
          },
        }}
      />
    </>
  );
}
