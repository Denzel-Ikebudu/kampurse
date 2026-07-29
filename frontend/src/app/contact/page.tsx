import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto px-4 py-14">
        <h1 className="text-2xl font-semibold mb-2 text-center">Get in Touch</h1>
        <p className="text-foreground-muted text-center mb-10">
          Have a question, a listing to sell, or feedback? Reach out.
        </p>

        <div className="mb-8 text-center">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-kampurse-green text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-kampurse-green-dark transition-colors"
          >
            Chat on WhatsApp instead
          </a>
          
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-foreground-muted">or send a message</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <ContactForm />
      </main>
    </>
  );
}