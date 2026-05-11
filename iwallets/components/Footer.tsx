import Link from "next/link"
import { Instagram, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 md:pt-24 pb-12 px-6 md:px-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
          
          {/* BRAND PANEL */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            <Link href="/" className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase">
              theCarry<span className="text-[#ff3366]">Club</span>
            </Link>
            <p className="text-gray-500 text-sm md:text-xl font-bold leading-tight max-w-sm">
              Crafting minimal gear for the modern professional. Built to last, designed to carry.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/thecarryclub.in" 
                target="_blank"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#ff3366] hover:border-[#ff3366] transition-all group"
              >
                <Instagram size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <a 
                href="mailto:info@thecarryclub.in" 
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#ff3366] hover:border-[#ff3366] transition-all group"
              >
                <Mail size={18} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* LINKS PANEL */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Explore</h4>
              <ul className="space-y-4 font-bold text-sm">
                <li><Link href="/buy" className="hover:text-[#ff3366] transition-colors">Shop All</Link></li>
                <li><Link href="/about" className="hover:text-[#ff3366] transition-colors">Our Story</Link></li>
                <li><Link href="/faqs" className="hover:text-[#ff3366] transition-colors">FAQs</Link></li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Legal</h4>
              <ul className="space-y-4 font-bold text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/returns" className="hover:text-white transition-colors">Returns</Link></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Contact</h4>
              <ul className="space-y-4 font-bold text-sm">
                <li><a href="mailto:info@thecarryclub.in" className="text-[#ff3366] hover:underline">info@thecarryclub.in</a></li>
                <li className="text-gray-500 text-xs">Available Mon-Fri • 10am - 6pm</li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
            © {new Date().getFullYear()} theCarryClub • Engineered in India
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-600">
             <span>Secure Payments via Razorpay</span>
             <span>Encrypted Checkout</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
