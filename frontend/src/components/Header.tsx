"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  {
    label: "Lodges",
    href: "/lodges",
  },
  {
    label: "Marketplace",
    href: "/marketplace",
  },
  {
    label: "Roommates",
    href: "/roommates",
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="group flex items-center gap-2.5"
        >
          <span className="text-xl font-bold tracking-[-0.03em] text-foreground">
            Kampurse
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "text-kampurse-green-dark"
                    : "text-foreground-muted hover:bg-surface-muted hover:text-foreground"
                }`}
              >
                {link.label}

                {active && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-kampurse-green"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}

          <Link
            href="/about"
            className={`relative rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              pathname === "/about"
                ? "text-kampurse-green-dark"
                : "text-foreground-muted hover:bg-surface-muted hover:text-foreground"
            }`}
          >
            About

            {pathname === "/about" && (
              <motion.span
                layoutId="activeNav"
                className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-kampurse-green"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
          </Link>
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted"
          >
            <Sun
              size={18}
              className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />

            <Moon
              size={18}
              className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
          </button>

          <Link
            href="/login"
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
          >
            Log in
          </Link>

          <Link
            href="/register"
            className="rounded-lg bg-kampurse-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-kampurse-green-dark hover:shadow-md"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted"
          >
            <Sun
              size={18}
              className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
            />

            <Moon
              size={18}
              className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
            />
          </button>

          {/* Menu button */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            transition={{
              duration: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <div className="mx-auto max-w-7xl px-6 py-5">
              <div className="flex flex-col gap-1">
                {navLinks.map((link, index) => {
                  const active = isActive(link.href);

                  return (
                    <motion.div
                      key={link.href}
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.2,
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={`relative block rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                          active
                            ? "bg-kampurse-green-light text-kampurse-green-dark"
                            : "text-foreground hover:bg-surface-muted"
                        }`}
                      >
                        <span className="flex items-center justify-between">
                          {link.label}

                          {active && (
                            <motion.span
                              layoutId="mobileActiveNav"
                              className="h-2 w-2 rounded-full bg-kampurse-green"
                            />
                          )}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div
                  initial={{
                    opacity: 0,
                    x: -10,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.15,
                    duration: 0.2,
                  }}
                >
                  <Link
                    href="/about"
                    onClick={() => setMobileOpen(false)}
                    className={`relative block rounded-xl px-4 py-3.5 text-sm font-medium transition-colors ${
                      pathname === "/about"
                        ? "bg-kampurse-green-light text-kampurse-green-dark"
                        : "text-foreground hover:bg-surface-muted"
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      About

                      {pathname === "/about" && (
                        <span className="h-2 w-2 rounded-full bg-kampurse-green" />
                      )}
                    </span>
                  </Link>
                </motion.div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-border px-4 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-surface-muted"
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-kampurse-green px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-kampurse-green-dark"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}