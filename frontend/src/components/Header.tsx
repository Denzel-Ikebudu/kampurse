import Link from "next/link";
import { Home, Search } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";

export default function Header({ overlay = false }: { overlay?: boolean }) {
  if (overlay) {
    return (
      <header className="absolute top-0 left-0 right-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-kampurse-green flex items-center justify-center">
              <Home size={16} className="text-white" />
            </div>
          </Link>
          
          <div className="md:flex items-center">
            <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.15em] uppercase text-white/90">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/lodges" className="hover:text-white transition-colors">Lodges</Link>
              <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
              <Link href="/roommates" className="hover:text-white transition-colors">Roommates</Link>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <MobileNav overlay />
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-kampurse-green flex items-center justify-center">
            <Home size={16} className="text-white" />
          </div>
          <span className="font-medium text-lg">Kampurse</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-foreground-muted">
          <Link href="/lodges" className="hover:text-foreground transition-colors">Lodges</Link>
          <Link href="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
          <Link href="/roommates" className="hover:text-foreground transition-colors">Roommates</Link>
        </nav>

        <div className="flex items-center gap-3">
          <MobileNav />
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-3">
        <div className="flex items-center gap-2 bg-surface-muted border border-border rounded-lg px-3 py-2">
          <Search size={16} className="text-foreground-muted" />
          <input
            type="text"
            placeholder="Search lodges near UNN..."
            className="bg-transparent text-sm w-full outline-none placeholder:text-foreground-muted"
          />
        </div>
      </div>
    </header>
  );
}