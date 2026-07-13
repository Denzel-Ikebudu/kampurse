import Header from "@/components/Header";
import Link from "next/link";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-medium mb-3">Welcome to Kampurse</h1>
        <p className="text-foreground-muted mb-6">
          Find lodges, buy and sell items, and connect with roommates at UNN.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/lodges"
            className="inline-block bg-kampurse-green text-white px-5 py-2.5 rounded-md text-sm hover:bg-kampurse-green-dark transition-colors"
          >
            Browse Lodges
          </Link>
          <Link
            href="/marketplace"
            className="inline-block border border-border px-5 py-2.5 rounded-md text-sm hover:bg-surface-muted transition-colors"
          >
            Browse Marketplace
          </Link>
          <Link
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-kampurse-urgent text-white px-5 py-2.5 rounded-md text-sm hover:opacity-90 transition-opacity"
          >
            Sell an Item
          </Link>
        </div>
      </main>
    </>
  );
}