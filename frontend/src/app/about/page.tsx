import Header from "@/components/Header";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-14">
        <h1 className="text-2xl font-semibold mb-6 text-center">About Kampurse</h1>

        <div className="space-y-6 text-sm text-foreground-muted leading-relaxed">
          <p>
            Kampurse started with a simple problem every UNN student runs into: finding a lodge,
            buying or selling something, or getting a roommate almost always means trusting a
            stranger with your money before you've even seen what you're paying for.
          </p>
          <p>
            We built Kampurse to close that gap. Instead of sending money directly to a landlord
            or seller you've never met, you pay Kampurse first. We hold your payment, confirm
            it's received, and only then connect you so you can inspect the lodge or item in
            person — before anything is final.
          </p>
          <p>
            Right now, Kampurse is focused entirely on UNN, Nsukka. We're starting local and
            getting it right here before expanding to other campuses.
          </p>
          <p>
            Have a question, or want to list something? Reach out to us anytime on WhatsApp —
            the link is in the footer of every page.
          </p>
        </div>
      </main>
    </>
  );
}