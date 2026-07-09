"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ReserveButtonProps {
  type: "property" | "item";
  id: number;
  title: string;
  price: string;
  ctaLabel: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function ReserveButton({ type, id, title, price, ctaLabel }: ReserveButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  function openModal(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setIsSuccess(false);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const payload: Record<string, string | number> = {
      buyer_name: name,
      buyer_phone: phone,
      buyer_email: email,
      amount: price,
    };
    if (type === "property") {
      payload.related_property = id;
    } else {
      payload.item = id;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/transactions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Something went wrong. Please try again.");
      }

      setIsSuccess(true);
    } catch {
      setError("Could not submit your request. Please check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="w-full bg-kampurse-green text-white text-sm py-2 rounded-md hover:bg-kampurse-green-dark transition-colors"
      >
        {ctaLabel}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-surface rounded-xl max-w-sm w-full p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-medium">
                {isSuccess ? "Request Sent" : ctaLabel}
              </h2>
              <button onClick={closeModal} aria-label="Close">
                <X size={18} className="text-foreground-muted" />
              </button>
            </div>

            {isSuccess ? (
              <div>
                <p className="text-sm text-foreground-muted mb-4">
                  We&apos;ve received your interest in <strong>{title}</strong>. Kampurse will
                  reach out to you shortly on the phone number you provided with payment details.
                </p>
                <button
                  onClick={closeModal}
                  className="w-full bg-kampurse-green text-white text-sm py-2 rounded-md"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-xs text-foreground-muted mb-1">
                  {title} — &#8358;{Number(price).toLocaleString()}
                </p>

                <div>
                  <label className="text-xs text-foreground-muted block mb-1">Full name</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface"
                  />
                </div>

                <div>
                  <label className="text-xs text-foreground-muted block mb-1">Phone number</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface"
                  />
                </div>

                <div>
                  <label className="text-xs text-foreground-muted block mb-1">Email (optional)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface"
                  />
                </div>

                {error && <p className="text-xs text-kampurse-urgent">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-kampurse-green text-white text-sm py-2 rounded-md hover:bg-kampurse-green-dark transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}