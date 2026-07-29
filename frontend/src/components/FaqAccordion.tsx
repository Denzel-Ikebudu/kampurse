"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqGroup {
  title: string;
  items: FaqItem[];
}

const faqGroups: FaqGroup[] = [
  {
    title: "How it works",
    items: [
      {
        question: "Why do I pay Kampurse and not the landlord or seller directly?",
        answer:
          "Kampurse acts as a trusted middleman so you're never sending money to a stranger you've never met. We hold your payment until you've had a chance to inspect the lodge or item in person.",
      },
      {
        question: "What happens after I pay?",
        answer:
          "Once we confirm your payment has come through, we reach out to connect you with the landlord or seller so you can arrange an inspection.",
      },
      {
        question: "Can I get my money back if I don't like the lodge or item?",
        answer:
          "Yes — as long as the deal hasn't been marked complete yet, a refund is possible. Once you've inspected it and confirmed you're satisfied, the deal is marked complete and refunds are no longer available.",
      },
      {
        question: "What happens once a deal is marked complete?",
        answer:
          "Completing a deal means you've inspected the lodge or item and confirmed you're happy with it. At that point, it's treated as final and refunds can no longer be issued.",
      },
    ],
  },
  {
    title: "Listings",
    items: [
      {
        question: "Can I list my own lodge or item?",
        answer:
          "Not directly through the site — only Kampurse staff publish listings, to keep quality and trust consistent. If you'd like to sell an item, reach out to us on WhatsApp and we'll help list it.",
      },
      {
        question: "How do I sell something on Kampurse?",
        answer:
          "Tap \"Sell an Item\" on the Marketplace page to message us directly on WhatsApp with details about what you're selling.",
      },
      {
        question: "Are the lodges verified?",
        answer:
          "Yes — every lodge listed has been checked by our team before it goes live.",
      },
      {
        question: "Can I post a roommate request?",
        answer:
          "Yes — reach out to us on WhatsApp with your details (budget, preferred location, move-in date) and we'll get your roommate request listed.",
      },
    ],
  },
  {
    title: "Account & Trust",
    items: [
      {
        question: "Is my payment safe?",
        answer:
          "Your payment goes to Kampurse first, not directly to a landlord or seller you haven't met. We only release contact details after confirming your payment, and refunds stay possible until the deal is marked complete.",
      },
      {
        question: "How do I contact Kampurse directly?",
        answer: "You can reach us anytime on WhatsApp — the link is in the footer of every page.",
      },
    ],
  },
];

function AccordionItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium">{item.question}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-foreground-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="text-sm text-foreground-muted pb-4 pr-8">{item.answer}</p>
      )}
    </div>
  );
}

export default function FaqAccordion() {
  return (
    <div className="max-w-2xl mx-auto">
      {faqGroups.map((group) => (
        <div key={group.title} className="mb-8">
          <h2 className="text-sm font-medium text-kampurse-green uppercase tracking-wide mb-2">
            {group.title}
          </h2>
          {group.items.map((item) => (
            <AccordionItem key={item.question} item={item} />
          ))}
        </div>
      ))}
    </div>
  );
}