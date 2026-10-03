"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authFetch } from "@/lib/auth";
import { Plus, Trash2 } from "lucide-react";

interface PropertyRow {
  id: number;
  title: string;
  campus: string;
  status: string;
  initial_price: string;
  slug: string;
}

const statusColors: Record<string, string> = {
  available: "bg-kampurse-green-light text-kampurse-green-dark",
  pending: "bg-yellow-100 text-yellow-700",
  taken: "bg-gray-200 text-gray-600",
};

export default function ListingsPage() {
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await authFetch("/properties/?page_size=100");
      const data = await res.json();
      setProperties(data.results ?? []);
      setLoading(false);
    }

    load();
  }, []);

  async function deleteProperty(slug: string, title: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This will also delete its images.`
    );

    if (!confirmed) return;

    const res = await authFetch(`/properties/${slug}/`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Could not delete this property. Please try again.");
      return;
    }

    setProperties((prev) =>
      prev.filter((property) => property.slug !== slug)
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Listings — Lodges</h1>

        <Link
          href="/dashboard/listings/new"
          className="flex items-center gap-1.5 bg-kampurse-green text-white text-sm px-3 py-2 rounded-md hover:bg-kampurse-green-dark transition-colors"
        >
          <Plus size={16} />
          New Property
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-foreground-muted">Loading...</p>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-muted text-foreground-muted text-xs">
              <tr>
                <th className="text-left px-4 py-2">Title</th>
                <th className="text-left px-4 py-2">Campus</th>
                <th className="text-left px-4 py-2">Price</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2"></th>
              </tr>
            </thead>

            <tbody>
              {properties.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-2.5">{p.title}</td>

                  <td className="px-4 py-2.5">{p.campus}</td>

                  <td className="px-4 py-2.5">
                    ₦{Number(p.initial_price).toLocaleString()}
                  </td>

                  <td className="px-4 py-2.5">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        statusColors[p.status] ?? ""
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/dashboard/listings/${p.slug}/edit`}
                        className="text-kampurse-green-dark hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() => deleteProperty(p.slug, p.title)}
                        className="flex items-center gap-1 text-kampurse-urgent hover:underline"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}