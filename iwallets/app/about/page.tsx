"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Instagram, ArrowRight, Shield, Zap, Heart } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="min-h-screen bg-[#fafafa] pt-32 md:pt-48 pb-20 overflow-hidden font-sans">
      <div className="max-w-[1440px] mx-auto px-6 md:px-20">

        {/* Hero Section */}
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center relative mb-24 md:mb-40">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="z-10 relative"
          >
             <p className="text-[#ff3366] font-black tracking-[0.3em] text-[10px] md:text-sm uppercase mb-6">About theCarryClub</p>
            <h1 className="text-6xl md:text-[100px] lg:text-[120px] font-black text-black leading-[0.85] tracking-tighter mb-10">
              Redefining <br /> 
              <span className="text-rose-600">Everyday</span> <br />
              Carry.
            </h1>
            <p className="text-gray-500 text-lg md:text-2xl max-w-xl mb-12 leading-relaxed font-medium">
              We're on a mission to eliminate bulk and bring back intentionality to the things you carry every single day.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="relative h-[300px] md:h-[500px] lg:h-[600px] w-full bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl z-10"
          >
            <Image 
              src="/Iwallet - Images/Editorial-desk/2.jpg" 
              alt="Everyday Carry Lifestyle" 
              fill 
              className="object-cover"
              unoptimized
            />
          </motion.div>

          {/* Background Glows */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-600/10 blur-[150px] -z-10" />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-blue-600/10 blur-[120px] -z-10" />
        </div>

        {/* Vision Section - Split Layout like Home */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32 md:mb-56">
          <div className="relative h-[400px] md:h-[600px] bg-white rounded-[3rem] overflow-hidden shadow-2xl">
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
              className="text-[120px] md:text-[200px] font-black text-transparent stroke-gray-200 leading-none select-none block mb-[-40px] md:mb-[-80px]"
              style={{ WebkitTextStroke: '2px #e5e7eb' }}
            >
              01
            </motion.span>
            <h2 className="text-4xl md:text-7xl font-black mb-8 tracking-tighter">
              The Vision <br /> of Less.
            </h2>
            <div className="space-y-6 text-gray-500 text-lg md:text-xl leading-relaxed max-w-md font-medium">
              <p>
                We believe everyday essentials should feel <span className="text-black font-black">intentional</span>.
              </p>
              <p>
                Our wallets are designed for people who prefer less — less bulk,
                less noise, less distraction. <span className="text-rose-600 font-black">Clean lines, premium materials,
                and practical engineering.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-32 md:mb-56">
           <div className="text-center mb-20">
              <h2 className="text-4xl md:text-7xl font-black tracking-tighter mb-6">Engineered for Excellence.</h2>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs md:text-sm">Quality without compromise</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
              {[
                { title: "Premium Materials", desc: "Highest grade vegan leather chosen for its texture and durability.", icon: <Shield size={40} strokeWidth={1}/> },
                { title: "Ultra Slim", desc: "Designed to vanish in your pocket while holding all your essentials.", icon: <Zap size={40} strokeWidth={1}/> },
                { title: "Made with Heart", desc: "Every product is a piece of art, reimagined for the modern world.", icon: <Heart size={40} strokeWidth={1}/> }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -15 }}
                  className="bg-white p-10 md:p-16 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 flex flex-col items-center text-center group"
                >
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-10 group-hover:bg-rose-600 group-hover:text-white transition-all duration-500">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black mb-4 tracking-tighter uppercase">{item.title}</h3>
                  <p className="text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
           </div>
        </div>

        {/* Contact CTA - Dark Theme */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-[#111] rounded-[3rem] p-10 md:p-32 overflow-hidden text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-600/20 to-blue-600/20 opacity-50" />
          
          <div className="relative z-10">
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-10 leading-none">
              Let's Start a <br /> <span className="text-rose-600">Conversation.</span>
            </h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a
                href="mailto:info@thecarryclub.in"
                className="group flex items-center gap-4 bg-white px-10 py-5 rounded-full hover:bg-rose-600 transition-all transform hover:scale-105"
              >
                <Mail size={20} className="text-rose-600 group-hover:text-white" />
                <span className="text-sm font-black uppercase tracking-widest group-hover:text-white">Email Us</span>
              </a>

              <Link
                href="https://instagram.com/Thecarryclub.in_"
                target="_blank"
                className="group flex items-center gap-4 bg-[#222] border border-white/10 px-10 py-5 rounded-full hover:bg-white transition-all transform hover:scale-105"
              >
                <Instagram size={20} className="text-white group-hover:text-black" />
                <span className="text-sm font-black uppercase tracking-widest text-white group-hover:text-black">Instagram</span>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
