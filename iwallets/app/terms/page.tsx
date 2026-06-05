"use client";

import { motion } from "framer-motion";
import { PageShell, PageHeader, Card, Divider } from "@/components/ui/tcc";

export default function TermsPage() {
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
            eyebrow="Legal Documentation"
            title={<>Terms of <br /><span className="text-brand">Service.</span></>}
            align="left"
            className="mb-8"
          />
          <div className="w-24 h-2 bg-primary rounded-full" />
        </div>

        <Card size="xl" className="space-y-12 text-muted-foreground font-medium">
          <p className="text-xl md:text-2xl text-primary font-bold leading-relaxed">
            By using our website and purchasing our products, you agree to the following terms and conditions. Please read them carefully.
          </p>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight flex items-center gap-4">
              <span className="text-brand">01.</span> General
            </h2>
            <p className="leading-relaxed">theCarryClub reserves the right to update these terms at any time. Your continued use of the site constitutes acceptance of any changes. We may modify, suspend or discontinue any part of the service at any time.</p>
          </section>

          <Divider />

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight flex items-center gap-4">
              <span className="text-brand">02.</span> Product Availability
            </h2>
            <p className="leading-relaxed">While we strive for accuracy, we cannot guarantee that all items will always be in stock. Prices are subject to change without notice. All descriptions of products or product pricing are subject to change at any time without notice.</p>
          </section>

          <Divider />

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight flex items-center gap-4">
              <span className="text-brand">03.</span> Intellectual Property
            </h2>
            <p className="leading-relaxed">All content on this site, including images, text, and logos, is the property of theCarryClub and is protected by copyright laws. You may not use our intellectual property without express written permission.</p>
          </section>

          <Divider />

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight flex items-center gap-4">
              <span className="text-brand">04.</span> Liability
            </h2>
            <p className="leading-relaxed">theCarryClub is not liable for any indirect, incidental, or consequential damages arising from the use of our products. Our total liability to you for any losses shall not exceed the amount paid by you for the product.</p>
          </section>
        </Card>

        <div className="mt-20 text-center">
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Last updated: May 2026</p>
        </div>
      </div>
    </PageShell>
  );
}
