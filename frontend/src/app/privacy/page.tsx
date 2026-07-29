import Header from "@/components/Header";

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">Privacy Policy</h1>
        <p className="text-foreground-muted text-sm mb-10">Last updated: July 2026</p>

        <div className="space-y-8 text-sm text-foreground-muted leading-relaxed">
          <section>
            <h2 className="text-base font-medium text-foreground mb-2">1. Information We Collect</h2>
            <p className="mb-2">
              When you make a reservation on Kampurse, we collect your name, phone number, and
              email address so we can process your transaction and connect you with the relevant
              landlord or seller.
            </p>
            <p>
              We also collect basic, non-identifying analytics — such as which pages and listings
              are viewed — to help us understand what students are interested in.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-foreground mb-2">2. How We Use Your Information</h2>
            <p>
              Your reservation details are used only to process your transaction, communicate
              with you about it, and connect you with the landlord or seller once payment is
              confirmed. We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-foreground mb-2">3. Who Can See Your Information</h2>
            <p>
              Your contact details are shared with the specific landlord or seller relevant to
              your reservation, only after your payment has been confirmed. They are not visible
              to other visitors of the site.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-foreground mb-2">4. Cookies & Local Storage</h2>
            <p>
              Kampurse uses your browser's local storage to remember your light/dark theme
              preference. This is not used for tracking or advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-foreground mb-2">5. Contact</h2>
            <p>
              If you have questions about how your information is handled, reach out via WhatsApp
              at +234 815 698 1023.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}