"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/lodges", label: "Lodges" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/roommates", label: "Roommates" },
];

export default function MobileNav({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className={overlay ? "text-white" : "text-foreground"}
      >
        <Menu size={24} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex items-center justify-between px-4 py-4 border-b border-border">
            <span className="font-medium text-lg">Kampurse</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col px-4 py-6 gap-5 text-base">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}