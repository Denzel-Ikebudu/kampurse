import Link from "next/link";
import Header from "@/components/Header";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-kampurse-green-light flex items-center justify-center mx-auto mb-6">
          <Home size={28} className="text-kampurse-green-dark" />
        </div>
        <h1 className="text-2xl font-semibold mb-2">Lodge not found — or maybe just this page</h1>
        <p className="text-foreground-muted mb-8">
          The page you're looking for doesn't exist. Let's get you back on track.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/"
            className="inline-block bg-kampurse-green text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-kampurse-green-dark transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/lodges"
            className="inline-block border border-border px-6 py-3 rounded-md text-sm font-medium hover:bg-surface-muted transition-colors"
          >
            Browse Lodges
          </Link>
        </div>
      </main>
    </>
  );
}