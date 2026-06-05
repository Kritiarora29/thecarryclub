"use client";

import { motion } from "framer-motion";
import { PageShell, PageHeader, Card, Divider } from "@/components/ui/tcc";

export default function PrivacyPage() {
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
            title={<>Privacy <br /><span className="text-brand">Policy.</span></>}
            align="left"
            className="mb-8"
          />
          <div className="w-24 h-2 bg-primary rounded-full" />
        </div>

        <Card size="xl" className="space-y-12 text-muted-foreground font-medium">
          <p className="text-xl md:text-2xl text-primary font-bold leading-relaxed">
            Your privacy is of the utmost importance to us. This policy outlines how we collect, use, and protect your personal information.
          </p>

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight flex items-center gap-4">
              <span className="text-brand">01.</span> Data Collection
            </h2>
            <p className="leading-relaxed">We collect information you provide directly to us when you make a purchase, sign up for our newsletter, or contact support. This includes your name, email, phone number, and shipping address.</p>
          </section>

          <Divider />

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight flex items-center gap-4">
              <span className="text-brand">02.</span> How We Use Data
            </h2>
            <p className="leading-relaxed">We use your information to process orders, provide customer support, and send promotional updates (if you&apos;ve opted in). We do not sell your personal data to third parties.</p>
          </section>

          <Divider />

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight flex items-center gap-4">
              <span className="text-brand">03.</span> Security
            </h2>
            <p className="leading-relaxed">We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or destruction. All transactions are processed through secure payment gateways.</p>
          </section>

          <Divider />

          <section className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight flex items-center gap-4">
              <span className="text-brand">04.</span> Cookies
            </h2>
            <p className="leading-relaxed">Our website uses cookies to enhance your browsing experience and analyze site traffic. You can choose to disable cookies through your browser settings, though this may affect site functionality.</p>
          </section>
        </Card>

        <div className="mt-20 text-center">
          <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Last updated: May 2026</p>
        </div>
      </div>
    </PageShell>
  );
}
