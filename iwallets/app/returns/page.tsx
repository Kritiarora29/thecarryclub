"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { PageShell, PageHeader, Card, Divider } from "@/components/ui/tcc";

export default function ReturnsPage() {
  return (
    <PageShell spacing="lg">
      <div className="max-w-5xl mx-auto px-6">

        <div className="mb-20 md:mb-32 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-brand/10 rounded-full blur-[100px] -z-10"
          />
          <PageHeader
            eyebrow="Service Policy"
            title={<>Returns & <br /><span className="text-brand">Refunds.</span></>}
            align="left"
            className="mb-8"
          />
          <div className="w-24 h-2 bg-primary rounded-full" />
        </div>

        <Card size="xl" className="space-y-12 text-muted-foreground font-medium">
          <div className="bg-brand-light border border-brand/20 p-8 md:p-12 rounded-4xl">
            <h2 className="text-brand font-black text-2xl md:text-3xl tracking-tight mb-4 uppercase">Important Notice</h2>
            <p className="text-brand font-bold text-lg md:text-xl leading-relaxed">
              ALL SALES ARE FINAL! Due to the limited nature of our drops and releases, we do not offer standard returns or exchanges unless the product is defective.
            </p>
          </div>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight flex items-center gap-4">
              <span className="text-brand">01.</span> Quality Check
            </h2>
            <p className="leading-relaxed">Every single iWallet undergoes a rigorous multi-point quality inspection before it is packed and shipped. We ensure that you receive a product that meets our high standards of craftsmanship.</p>
          </section>

          <Divider />

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight flex items-center gap-4">
              <span className="text-brand">02.</span> Defective Items
            </h2>
            <p className="leading-relaxed">In the rare event that you receive a defective item, please contact us at <span className="text-primary font-black">info@thecarryclub.in</span> within 5 days of delivery. Include your order number and clear photos of the defect.</p>
          </section>

          <Divider />

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight flex items-center gap-4">
              <span className="text-brand">03.</span> Shipping Damage
            </h2>
            <p className="leading-relaxed">If your package arrives visibly damaged, please take photos before opening it and contact us immediately. We will work with our courier partners to resolve the issue for you.</p>
          </section>

          <Divider />

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight flex items-center gap-4">
              <span className="text-brand">04.</span> Refunds
            </h2>
            <p className="leading-relaxed">Refunds are only issued for verified defective items that cannot be replaced. Once approved, the refund will be processed to your original payment method within 7-10 business days.</p>
          </section>
        </Card>

        <div className="mt-20 flex flex-col items-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <RotateCcw className="text-primary" size={32} strokeWidth={1} />
          </div>
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Questions? info@thecarryclub.in</p>
        </div>
      </div>
    </PageShell>
  );
}
