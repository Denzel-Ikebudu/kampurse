"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authFetch } from "@/lib/auth";
import { Plus } from "lucide-react";

interface ItemRow {
  id: number;
  title: string;
  campus: string;
  status: string;
  price: string;
  slug: string;
  is_distress_sale: boolean;
}

const statusColors: Record<string, string> = {
  available: "bg-kampurse-green-light text-kampurse-green-dark",
  pending: "bg-yellow-100 text-yellow-700",
  sold: "bg-gray-200 text-gray-600",
};

export default function DashboardMarketplacePage() {
  const [items, setItems] = useState<ItemRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await authFetch("/items/?page_size=100");
      const data = await res.json();
      setItems(data.results ?? []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Listings — Marketplace</h1>
        <Link
          href="/dashboard/marketplace/new"
          className="flex items-center gap-1.5 bg-kampurse-green text-white text-sm px-3 py-2 rounded-md hover:bg-kampurse-green-dark transition-colors"
        >
          <Plus size={16} /> New Item
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
              {items.map((item) => (
                <tr key={item.id} className="border-t border-border">
                  <td className="px-4 py-2.5">
                    {item.title}
                    {item.is_distress_sale && (
                      <span className="ml-2 text-xs text-kampurse-urgent">(urgent)</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">{item.campus}</td>
                  <td className="px-4 py-2.5">₦{Number(item.price).toLocaleString()}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[item.status] ?? ""}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Link href={`/dashboard/marketplace/${item.slug}/edit`} className="text-kampurse-green-dark hover:underline">
                      Edit
                    </Link>
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