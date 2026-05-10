"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, X } from "lucide-react";

export default function AdminLoginModal({ onClose }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin");
      onClose();
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-sm rounded-[2.5rem] p-6 md:p-10 bg-white shadow-2xl relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-8 md:mb-10 text-center">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <User className="w-6 h-6 md:w-8 md:h-8 text-[#ff3366]" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-black tracking-tighter">
            Admin Access
          </h2>
          <p className="text-xs md:text-sm font-medium text-gray-400 mt-2">
            Restricted to authorized personnel.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              placeholder="Admin Email"
              className="w-full pl-12 pr-4 py-3 md:py-4 rounded-2xl bg-gray-50 border border-gray-100 text-black font-medium focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all text-sm md:text-base"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-12 pr-4 py-3 md:py-4 rounded-2xl bg-gray-50 border border-gray-100 text-black font-medium focus:outline-none focus:border-[#ff3366] focus:bg-white transition-all text-sm md:text-base"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
            />
          </div>
        </div>

        <div className="mt-6 md:mt-8 space-y-4">
          <button
            onClick={login}
            className="w-full py-3 md:py-4 rounded-2xl bg-black hover:bg-[#ff3366] text-white font-black text-base md:text-lg tracking-wide transition-all shadow-xl shadow-gray-200"
          >
            LOGIN TO DASHBOARD
          </button>
        </div>
      </motion.div>
    </div>
  );
}