"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { authFetch } from "@/lib/auth";
import { AnalyticsSummary } from "@/types";
import { Eye, Wallet, TrendingUp } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  initiated: "#a3a3a3",
  awaiting_payment: "#e0b23d",
  payment_received: "#639922",
  contact_released: "#3b6d11",
  completed: "#27500a",
  refunded: "#e24b4a",
  cancelled: "#6b6f66",
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

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-kampurse-green-light flex items-center justify-center shrink-0">
        <Icon size={18} className="text-kampurse-green-dark" />
      </div>
      <div>
        <p className="text-xs text-foreground-muted">{label}</p>
        <p className="text-lg font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await authFetch("/analytics/summary/");
        if (!res.ok) throw new Error();
        const json = await res.json();
        setData(json);
      } catch {
        setError("Could not load analytics. You may not have permission to view this page.");
      }
    }
    fetchSummary();
  }, []);

  if (error) {
    return <p className="text-sm text-kampurse-urgent">{error}</p>;
  }

  if (!data) {
    return <p className="text-sm text-foreground-muted">Loading analytics...</p>;
  }

  const dailyViewsFormatted = data.daily_views.map((d) => ({
    ...d,
    day: new Date(d.day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  }));

  const statusBreakdownFormatted = data.transaction_status_breakdown.map((s) => ({
    ...s,
    label: statusLabels[s.status] ?? s.status,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-medium">Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Eye} label="Views (last 7 days)" value={data.total_views_7d.toLocaleString()} />
        <StatCard icon={Wallet} label="Revenue (completed)" value={`₦${Number(data.completed_revenue).toLocaleString()}`} />
        <StatCard icon={TrendingUp} label="Transactions" value={data.transaction_status_breakdown.reduce((sum, s) => sum + s.count, 0).toString()} />
      </div>

      <div className="bg-surface border border-border rounded-xl p-4">
        <h2 className="text-sm font-medium mb-4">Page Views — Last 7 Days</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={dailyViewsFormatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" fontSize={12} stroke="var(--foreground-muted)" />
            <YAxis fontSize={12} stroke="var(--foreground-muted)" allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Line type="monotone" dataKey="count" stroke="#639922" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4">
          <h2 className="text-sm font-medium mb-4">Top Viewed Lodges (30d)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.top_properties} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" fontSize={12} stroke="var(--foreground-muted)" allowDecimals={false} />
              <YAxis dataKey="title" type="category" fontSize={11} stroke="var(--foreground-muted)" width={110} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="view_count" fill="#639922" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4">
          <h2 className="text-sm font-medium mb-4">Top Viewed Items (30d)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.top_items} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" fontSize={12} stroke="var(--foreground-muted)" allowDecimals={false} />
              <YAxis dataKey="title" type="category" fontSize={11} stroke="var(--foreground-muted)" width={110} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="view_count" fill="#3b6d11" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-4">
        <h2 className="text-sm font-medium mb-4">Transaction Pipeline</h2>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={statusBreakdownFormatted}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={(entry: any) => `${entry.label}: ${entry.count}`}
            >
              {statusBreakdownFormatted.map((entry, index) => (
                <Cell key={index} fill={STATUS_COLORS[entry.status] ?? "#a3a3a3"} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}