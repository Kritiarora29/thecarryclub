"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
