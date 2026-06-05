"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Card, Heading, Button } from "@/components/ui/tcc";

export default function SuccessPage() {
  const hasShownToast = useRef(false);

  useEffect(() => {
    fetch("/api/cart/clear", { method: "POST" }).catch(() => {});
    if (!hasShownToast.current) {
      toast.success("Order Placed");
      hasShownToast.current = true;
    }
  }, []);

  return (
    <section className="min-h-screen bg-surface flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-125 h-125 bg-emerald-600/10 blur-[150px] -z-10" />
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-blue-600/10 blur-[150px] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full relative z-10"
      >
        <Card size="xl" className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 md:w-32 md:h-32 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10"
          >
            <CheckCircle2 size={64} strokeWidth={1.5} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Heading as="h1" className="mb-6">
              Order <span className="text-emerald-600 italic">Confirmed.</span>
            </Heading>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-lg md:text-xl font-medium mb-12 leading-relaxed"
          >
            Thank you for choosing theCarryClub. Your premium iWallet is being prepared for dispatch. We&apos;ll send you a tracking link shortly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button href="/buy" size="lg" className="w-full sm:w-auto gap-3">
              <ShoppingBag size={18} /> Continue Shopping
            </Button>
            <Button href="/" variant="secondary" size="lg" className="w-full sm:w-auto gap-3">
              Home <ArrowRight size={18} />
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </section>
  );
}
