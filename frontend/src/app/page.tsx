import Header from "@/components/Header";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-medium mb-3">Welcome to Kampurse</h1>
        <p className="text-foreground-muted mb-6">Find lodges, buy and sell items, and connect with roommates at UNN.</p>
        <Link href="/lodges" className="inline-block bg-kampurse-green text-white px-5 py-2.5 rounded-md text-sm">
          Browse Lodges
        </Link>
      </main>
    </>
  );
}