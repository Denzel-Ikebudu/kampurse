"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth";
import { RoommateRequestItem } from "@/types";
import { Check, X, Wallet, Calendar, MapPin } from "lucide-react";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  open: "bg-kampurse-green-light text-kampurse-green-dark",
  matched: "bg-blue-100 text-blue-800",
  closed: "bg-surface-muted text-foreground-muted",
};

export default function RoommateModerationPage() {
  const [requests, setRequests] = useState<RoommateRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState<number | null>(null);

  async function loadRequests() {
    setLoading(true);
    try {
      const res = await authFetch("/roommates/");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRequests(data.results ?? data);
    } catch {
      setError("Could not load roommate requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  async function updateStatus(id: number, status: string) {
    setActioningId(id);
    try {
      const res = await authFetch(`/roommates/${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch {
      setError("Could not update that request. Try again.");
    } finally {
      setActioningId(null);
    }
  }

  const pending = requests.filter((r) => r.status === "pending");
  const others = requests.filter((r) => r.status !== "pending");

  if (loading) {
    return <p className="text-sm text-foreground-muted">Loading roommate requests...</p>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-medium">Roommate Requests</h1>

      {error && <p className="text-sm text-kampurse-urgent">{error}</p>}

      <section>
        <h2 className="text-sm font-medium text-foreground-muted mb-3">
          Pending Approval ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-foreground-muted">Nothing waiting on review.</p>
        ) : (
          <div className="space-y-3">
            {pending.map((r) => (
              <div key={r.id} className="bg-surface border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-sm font-medium">{r.student_name}</p>
                    <p className="text-xs text-foreground-muted">
                      {r.campus} &middot; {r.student_contact}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full shrink-0 ${statusStyles[r.status]}`}>
                    {r.status}
                  </span>
                </div>

                {(r.linked_property_title || r.preferred_location) && (
                  <p className="text-xs text-foreground-muted flex items-center gap-1 mb-2">
                    <MapPin size={13} />
                    {r.linked_property_title ?? r.preferred_location}
                  </p>
                )}

                <p className="text-sm text-foreground-muted mb-3">{r.description}</p>

                <div className="flex flex-wrap gap-3 text-xs text-foreground-muted mb-4">
                  {(r.budget_min || r.budget_max) && (
                    <span className="flex items-center gap-1">
                      <Wallet size={13} />
                      {r.budget_min && `₦${Number(r.budget_min).toLocaleString()}`}
                      {r.budget_min && r.budget_max && " – "}
                      {r.budget_max && `₦${Number(r.budget_max).toLocaleString()}`}
                    </span>
                  )}
                  {r.move_in_date && (
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {r.move_in_date}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(r.id, "open")}
                    disabled={actioningId === r.id}
                    className="flex items-center gap-1.5 bg-kampurse-green text-white text-xs px-3 py-1.5 rounded-md hover:bg-kampurse-green-dark transition-colors disabled:opacity-60"
                  >
                    <Check size={13} /> Approve
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "closed")}
                    disabled={actioningId === r.id}
                    className="flex items-center gap-1.5 border border-border text-xs px-3 py-1.5 rounded-md hover:bg-surface-muted transition-colors disabled:opacity-60"
                  >
                    <X size={13} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-sm font-medium text-foreground-muted mb-3">All Other Requests</h2>
        {others.length === 0 ? (
          <p className="text-sm text-foreground-muted">Nothing here yet.</p>
        ) : (
          <div className="space-y-2">
            {others.map((r) => (
              <div key={r.id} className="bg-surface border border-border rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm">{r.student_name}</p>
                  <p className="text-xs text-foreground-muted">
                    {r.campus} &middot; {r.linked_property_title ?? r.preferred_location}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[r.status]}`}>
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}