import Link from "next/link";
import { Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="bg-[#111111] text-white pt-16 pb-10 px-6 md:px-16"
      style={{ fontFamily: "var(--font-body, sans-serif)" }}
    >
      <div className="max-w-[1280px] mx-auto">

        {/* Top row */}
        <div className="flex flex-col lg:flex-row justify-between gap-14 pb-14 border-b border-[#2A2A2A]">

          {/* Brand column */}
          <div className="max-w-xs">
            <Link href="/" className="block mb-5">
              <span
                className="text-[1.75rem] font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-display, Georgia, serif)", letterSpacing: "-0.03em" }}
              >
                theCarryClub<span style={{ color: "var(--brand)" }}>.</span>
              </span>
            </Link>
            <p className="text-[#7A736E] text-sm leading-relaxed mb-6">
              Redefining the everyday carry. Ultra-slim premium wallets, built for India.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/thecarryclub.in_"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-center text-[#7A736E] hover:bg-[#B45309] hover:border-[#B45309] hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram size={15} />
              </a>
              <a
                href="mailto:info@thecarryclub.in"
                className="w-9 h-9 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-center text-[#7A736E] hover:bg-[#B45309] hover:border-[#B45309] hover:text-white transition-all"
                aria-label="Email"
              >
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 lg:gap-16">
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5A534E] mb-5">Collection</h4>
              <ul className="space-y-3.5">
                {[
                  { label: "Slim Wallets", href: "/buy" },
                  { label: "New Arrivals", href: "/buy" },
                  { label: "Bestsellers",  href: "/buy" },
                ].map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[13px] text-[#9C9590] hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5A534E] mb-5">Support</h4>
              <ul className="space-y-3.5">
                {[
                  { label: "FAQs",    href: "/faqs" },
                  { label: "Returns", href: "/returns" },
                  { label: "Shipping", href: "/faqs" },
                ].map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[13px] text-[#9C9590] hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5A534E] mb-5">Legal</h4>
              <ul className="space-y-3.5">
                {[
                  { label: "Privacy Policy",   href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map(l => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[13px] text-[#9C9590] hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[#5A534E]">
            © {new Date().getFullYear()} theCarryClub. All rights reserved.
          </p>
          <p className="text-[12px] text-[#5A534E]">
            Secured by <span className="text-[#7A736E] font-medium">Razorpay</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
