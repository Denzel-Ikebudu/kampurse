import Header from "@/components/Header";
import FaqAccordion from "@/components/FaqAccordion";

export default function FaqPage() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2 text-center">Frequently Asked Questions</h1>
        <p className="text-foreground-muted text-center mb-10">
          Everything you need to know about how Kampurse works.
        </p>
        <FaqAccordion />
      </main>
    </>
  );
}