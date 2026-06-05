"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Instagram, Shield, Zap, Heart } from "lucide-react";
import Image from "next/image";
import { PageShell, Eyebrow, Heading } from "@/components/ui/tcc";

export default function AboutPage() {
  return (
    <PageShell spacing="lg" className="overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">

        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center relative mb-24 md:mb-40">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="z-10 relative"
          >
            <Eyebrow className="mb-6">About theCarryClub</Eyebrow>
            <Heading as="h1" className="text-6xl md:text-[100px] lg:text-[120px] mb-10">
              Redefining <br />
              <span className="text-brand">Everyday</span> <br />
              Carry.
            </Heading>
            <p className="text-muted-foreground text-lg md:text-2xl max-w-xl mb-12 leading-relaxed font-medium">
              We&apos;re on a mission to eliminate bulk and bring back intentionality to the things you carry every single day.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative h-[300px] md:h-[500px] lg:h-[600px] w-full bg-surface-card rounded-4xl md:rounded-[3rem] overflow-hidden shadow-2xl z-10"
          >
            <Image
              src="/Iwallet - Images/Editorial-desk/2.jpg"
              alt="Everyday Carry Lifestyle"
              fill
              className="object-cover"
              unoptimized
            />
          </motion.div>

          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand/10 blur-[150px] -z-10" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-blue-600/10 blur-[120px] -z-10" />
        </div>

        {/* Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32 md:mb-56">
          <div className="relative h-[400px] md:h-[600px] bg-surface-card rounded-[3rem] overflow-hidden shadow-2xl">
            <Image
              src="/Iwallet - Images/Editorial-desk/1.jpg"
              alt="The Vision"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.3 }}
              className="text-[120px] md:text-[200px] font-black text-transparent leading-none select-none block -mb-10 md:-mb-20"
              style={{ WebkitTextStroke: "2px #e5e7eb" }}
            >
              01
            </motion.span>
            <Heading as="h2" className="text-4xl md:text-7xl mb-8">
              The Vision <br /> of Less.
            </Heading>
            <div className="space-y-6 text-muted-foreground text-lg md:text-xl leading-relaxed max-w-md font-medium">
              <p>We believe everyday essentials should feel <span className="text-primary font-black">intentional</span>.</p>
              <p>Our wallets are designed for people who prefer less — less bulk, less noise, less distraction. <span className="text-brand font-black">Clean lines, premium materials, and practical engineering.</span></p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-32 md:mb-56">
          <div className="text-center mb-20">
            <Heading as="h2" className="text-4xl md:text-7xl mb-6">Engineered for Excellence.</Heading>
            <Eyebrow color="muted">Quality without compromise</Eyebrow>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {[
              { title: "Premium Materials", desc: "Highest grade vegan leather chosen for its texture and durability.", icon: <Shield size={40} strokeWidth={1} /> },
              { title: "Ultra Slim", desc: "Designed to vanish in your pocket while holding all your essentials.", icon: <Zap size={40} strokeWidth={1} /> },
              { title: "Made with Heart", desc: "Every product is a piece of art, reimagined for the modern world.", icon: <Heart size={40} strokeWidth={1} /> },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -15 }}
                className="bg-surface-card p-10 md:p-16 rounded-[2.5rem] shadow-xl border border-border flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-10 group-hover:bg-brand group-hover:text-white transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-4 tracking-tighter uppercase">{item.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-primary rounded-[3rem] p-10 md:p-32 overflow-hidden text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand/20 to-blue-600/20 opacity-50" />
          <div className="relative z-10">
            <Heading as="h2" className="text-5xl md:text-8xl text-primary-foreground mb-10">
              Let&apos;s Start a <br /><span className="text-brand">Conversation.</span>
            </Heading>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a
                href="mailto:info@thecarryclub.in"
                className="group flex items-center gap-4 bg-surface-card px-10 py-5 rounded-full hover:bg-brand transition-all transform hover:scale-105"
              >
                <Mail size={20} className="text-brand group-hover:text-white" />
                <span className="text-sm font-black uppercase tracking-widest group-hover:text-white">Email Us</span>
              </a>
              <Link
                href="https://instagram.com/Thecarryclub.in_"
                target="_blank"
                className="group flex items-center gap-4 bg-white/10 border border-white/10 px-10 py-5 rounded-full hover:bg-surface-card transition-all transform hover:scale-105"
              >
                <Instagram size={20} className="text-white group-hover:text-primary" />
                <span className="text-sm font-black uppercase tracking-widest text-white group-hover:text-primary">Instagram</span>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </PageShell>
  );
}
