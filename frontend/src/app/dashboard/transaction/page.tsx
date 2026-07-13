"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth";

interface TransactionRow {
  id: number;
  listing_title: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string;
  amount: string;
  status: string;
  admin_notes: string;
  created_at: string;
}

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  initiated: ["awaiting_payment", "cancelled"],
  awaiting_payment: ["payment_received", "cancelled"],
  payment_received: ["contact_released", "refunded"],
  contact_released: ["completed", "refunded"],
  completed: [],
  refunded: [],
  cancelled: [],
};

const statusLabels: Record<string, string> = {
  initiated: "Initiated",
  awaiting_payment: "Awaiting Payment",
  payment_received: "Payment Received",
  contact_released: "Contact Released",
  completed: "Completed",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

const statusColors: Record<string, string> = {
  initiated: "bg-gray-200 text-gray-700",
  awaiting_payment: "bg-yellow-100 text-yellow-700",
  payment_received: "bg-kampurse-green-light text-kampurse-green-dark",
  contact_released: "bg-blue-100 text-blue-700",
  completed: "bg-green-700 text-white",
  refunded: "bg-kampurse-urgent text-white",
  cancelled: "bg-gray-300 text-gray-600",
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<Record<number, string>>({});

  async function load() {
    const res = await authFetch("/transactions/list/");
    const data = await res.json();
    setTransactions(data.results ?? data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleTransition(id: number, newStatus: string) {
    setActionError((prev) => ({ ...prev, [id]: "" }));
    const res = await authFetch(`/transactions/${id}/transition/`, {
      method: "POST",
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      const data = await res.json();
      setActionError((prev) => ({ ...prev, [id]: data.detail ?? "Could not update." }));
      return;
    }
    load();
  }

  if (loading) return <p className="text-sm text-foreground-muted">Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-medium">Transactions — Escrow Pipeline</h1>

      <div className="space-y-3">
        {transactions.map((t) => (
          <div key={t.id} className="bg-surface border border-border rounded-xl p-4">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-sm font-medium">{t.listing_title}</p>
                <p className="text-xs text-foreground-muted">
                  {t.buyer_name} &middot; {t.buyer_phone} {t.buyer_email && `· ${t.buyer_email}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">₦{Number(t.amount).toLocaleString()}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[t.status] ?? ""}`}>
                  {statusLabels[t.status] ?? t.status}
                </span>
              </div>
            </div>

            {ALLOWED_TRANSITIONS[t.status]?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {ALLOWED_TRANSITIONS[t.status].map((next) => (
                  <button
                    key={next}
                    onClick={() => handleTransition(t.id, next)}
                    className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-surface-muted transition-colors"
                  >
                    Move to: {statusLabels[next]}
                  </button>
                ))}
              </div>
            )}

            {actionError[t.id] && (
              <p className="text-xs text-kampurse-urgent mt-2">{actionError[t.id]}</p>
            )}
          </div>
        ))}

        {transactions.length === 0 && (
          <p className="text-sm text-foreground-muted">No transactions yet.</p>
        )}
      </div>
    </div>
  );
}