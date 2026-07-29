import Header from "@/components/Header";

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">Terms of Service</h1>
        <p className="text-foreground-muted text-sm mb-10">Last updated: July 2026</p>

        <div className="space-y-8 text-sm text-foreground-muted leading-relaxed">
          <section>
            <h2 className="text-base font-medium text-foreground mb-2">1. What Kampurse Is</h2>
            <p>
              Kampurse connects students with off-campus lodges, marketplace items, and roommates.
              We're currently starting with the University of Nigeria, Nsukka (UNN), with plans to
              expand to other campuses over time. Kampurse acts as a paid intermediary for
              reservations made through the platform, as described below.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-foreground mb-2">2. How Payments Work</h2>
            <p className="mb-2">
              When you reserve a lodge or item through Kampurse, you pay Kampurse directly — not
              the landlord, seller, or any third party. Kampurse holds this payment until it has
              been confirmed, and only then shares your contact details with the relevant
              landlord or seller so an inspection can be arranged.
            </p>
            <p>
              Kampurse does not accept or process payments on behalf of unverified third parties
              outside this reservation flow.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-foreground mb-2">3. Refunds</h2>
            <p className="mb-2">
              You may request a refund at any point before a transaction is marked{" "}
              <strong className="text-foreground">complete</strong>. A transaction is marked
              complete once you have inspected the lodge or item and confirmed your satisfaction.
            </p>
            <p>
              Once a transaction is marked complete, it is final and no refund will be issued.
              You are responsible for inspecting the lodge or item thoroughly before confirming
              completion.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-foreground mb-2">4. Listings</h2>
            <p>
              Only Kampurse staff may publish listings on the platform. Kampurse makes reasonable
              efforts to verify lodges and items before listing them, but does not guarantee the
              condition, accuracy, or availability of any listing beyond what is stated at the
              time of publishing.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-foreground mb-2">5. Your Responsibilities</h2>
            <p>
              You agree to provide accurate contact information when making a reservation, and to
              conduct your own inspection of any lodge or item before confirming a transaction as
              complete. Kampurse is not responsible for disputes arising after a transaction has
              been marked complete.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-foreground mb-2">6. Contact</h2>
            <p>
              Questions about these terms can be sent to Kampurse via WhatsApp at{" "}
              +234 815 698 1023.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}