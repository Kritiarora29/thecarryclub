import Link from "next/link"
import { Instagram, Mail, Phone, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white text-black pt-24 pb-12 px-6 md:px-20 border-t border-gray-100 font-sans">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-24">
          <div className="max-w-md">
            <Link href="/" className="text-4xl md:text-5xl font-black tracking-tighter mb-8 block">
              theCarryClub<span className="text-blue-600">.</span>
            </Link>
            <p className="text-gray-500 font-medium text-lg leading-relaxed mb-10 max-w-sm">
              Redefining the way you carry. Join the club of minimalist enthusiasts worldwide.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">
                <Clock size={14} />
                <span>Monday-Friday 9am-6pm IST</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-black">
                  <Phone size={20} />
                </div>
                {/* <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Support Line</p>
                  <p className="text-xl font-black tracking-tight">+91 99999 99999</p>
                </div> */}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-24">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Collection</h4>
              <ul className="space-y-4 font-black uppercase text-[11px] tracking-widest">
                <li><Link href="/buy" className="hover:text-blue-600 transition-colors">Slim Wallets</Link></li>
                <li><Link href="/buy" className="hover:text-blue-600 transition-colors">New Arrivals</Link></li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Support</h4>
              <ul className="space-y-4 font-black uppercase text-[11px] tracking-widest">
                <li><Link href="/faqs" className="hover:text-blue-600 transition-colors">FAQs</Link></li>
                <li><Link href="/returns" className="hover:text-blue-600 transition-colors">Returns</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Legal</h4>
              <ul className="space-y-4 font-black uppercase text-[11px] tracking-widest">
                <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              © {new Date().getFullYear()} theCarryClub. All Rights Reserved.
            </p>
          </div>
          
          <div className="flex gap-6">
            <a href="https://instagram.com/thecarryclub.in" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all">
              <Instagram size={18} />
            </a>
            <a href="mailto:info@thecarryclub.in" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all">
              <Mail size={18} />
            </a>
          </div>

          <div className="flex items-center gap-8">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secured with Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
