"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { motion } from "framer-motion";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0f1f38] mt-auto overflow-hidden">
      <motion.div 
        className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8"
        initial={{ opacity: 0 }}
        whileInView={{
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
          },
        }}
        viewport={{ once: false, amount: 0.15 }} 
      >
        <motion.div 
          className="col-span-2 md:col-span-1" 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
          }}
          initial="hidden"
          whileInView="visible"
        >
          <Link href="/" className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-kampurse-green flex items-center justify-center">
              <Home size={16} className="text-white" />
            </div>
            <span className="font-medium text-lg text-white">Kampurse</span>
          </Link>
          <p className="text-sm text-white/60 mb-3">
            Nsukka housing and hustle, without the wahala.
          </p>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-kampurse-green hover:text-white transition-colors"
          >
            Chat with us on WhatsApp
          </a>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
          }}
          initial="hidden"
          whileInView="visible"
        >
          <h3 className="text-sm font-medium mb-3 text-white">Explore</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/lodges" className="hover:text-white transition-colors">Lodges</Link></li>
            <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
            <li><Link href="/roommates" className="hover:text-white transition-colors">Roommates</Link></li>
          </ul>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
          }}
          initial="hidden"
          whileInView="visible"
        >
          <h3 className="text-sm font-medium mb-3 text-white">Company</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
          </ul>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
          }}
          initial="hidden"
          whileInView="visible"
        >
          <h3 className="text-sm font-medium mb-3 text-white">Contact</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li>+234 815 698 1023</li>
            <li>UNN, Nsukka</li>
          </ul>
        </motion.div>
      </motion.div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-white/40 text-center">
          © {year} Kampurse.
        </div>
      </div>
    </footer>
  );
  
}