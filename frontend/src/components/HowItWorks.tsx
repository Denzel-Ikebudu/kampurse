"use client";

import { Wallet, ShieldCheck, Handshake } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: Wallet,
    title: "Reserve and pay us",
    description:
      "Found a lodge or item you want? Reserve it and pay Kampurse directly — never the landlord or seller.",
  },
  {
    icon: ShieldCheck,
    title: "We confirm payment",
    description:
      "Once we've verified your payment, we hold it safely and reach out to connect you with the other side.",
  },
  {
    icon: Handshake,
    title: "Inspect, then we release",
    description:
      "You get contact details and inspect the lodge or item in person. Satisfied? We complete the deal. Not satisfied before that point? You get a refund.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold mb-2">How Kampurse keeps you safe</h2>
        <p className="text-foreground-muted max-w-lg mx-auto">
          No wiring money to a stranger. Every deal goes through us first.
        </p>
      </div>

      <div className="relative max-w-xl mx-auto">
        <div className="absolute left-6 top-2 bottom-2 w-px bg-border" aria-hidden="true" />

        <motion.div 
          className="space-y-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
        >
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={step.title} 
                className="relative flex gap-5"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
              >
                <div className="relative z-10 w-12 h-12 shrink-0 rounded-full bg-kampurse-green-light border border-kampurse-green flex items-center justify-center">
                  <Icon size={20} className="text-kampurse-green-dark" />
                </div>
                <div className="pt-1.5">
                  <p className="text-xs font-medium text-kampurse-green uppercase tracking-wide mb-1">
                    Step {i + 1}
                  </p>
                  <h3 className="text-base font-medium mb-1">{step.title}</h3>
                  <p className="text-sm text-foreground-muted">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}