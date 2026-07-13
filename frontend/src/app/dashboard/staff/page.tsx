"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth";
import { Plus } from "lucide-react";

interface StaffRow {
  id: number;
  username: string;
  full_name: string;
  role: string;
  phone: string;
  is_active_staff: boolean;
}

const roleLabels: Record<string, string> = {
  owner: "Owner",
  content_manager: "Content Manager",
  support_sales: "Support / Sales",
};

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    username: "", password: "", first_name: "", last_name: "", phone: "", role: "content_manager",
  });

  async function load() {
    const res = await authFetch("/staff/");
    const data = await res.json();
    setStaff(data.results ?? data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const res = await authFetch("/staff/", { method: "POST", body: JSON.stringify(form) });
    if (!res.ok) {
      const data = await res.json();
      setError(JSON.stringify(data));
      setIsSubmitting(false);
      return;
    }

    setForm({ username: "", password: "", first_name: "", last_name: "", phone: "", role: "content_manager" });
    setShowForm(false);
    setIsSubmitting(false);
    load();
  }

  async function toggleActive(member: StaffRow) {
    await authFetch(`/staff/${member.id}/`, {
      method: "PATCH",
      body: JSON.stringify({ is_active_staff: !member.is_active_staff }),
    });
    load();
  }

  if (loading) return <p className="text-sm text-foreground-muted">Loading...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium">Staff</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 bg-kampurse-green text-white text-sm px-3 py-2 rounded-md hover:bg-kampurse-green-dark transition-colors"
        >
          <Plus size={16} /> New Staff
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-surface border border-border rounded-xl p-4 space-y-3 max-w-md">
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="First name" value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="text-sm border border-border rounded-md px-3 py-2 bg-surface" />
            <input required placeholder="Last name" value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="text-sm border border-border rounded-md px-3 py-2 bg-surface" />
          </div>
          <input required placeholder="Username" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface" />
          <input required type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface" />
          <input placeholder="Phone" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface" />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface">
            <option value="content_manager">Content Manager</option>
            <option value="support_sales">Support / Sales</option>
            <option value="owner">Owner</option>
          </select>

          {error && <p className="text-xs text-kampurse-urgent">{error}</p>}

          <button type="submit" disabled={isSubmitting}
            className="bg-kampurse-green text-white text-sm px-4 py-2 rounded-md disabled:opacity-60">
            {isSubmitting ? "Creating..." : "Create Staff Account"}
          </button>
        </form>
      )}

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-foreground-muted text-xs">
            <tr>
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Username</th>
              <th className="text-left px-4 py-2">Role</th>
              <th className="text-left px-4 py-2">Phone</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="px-4 py-2.5">{s.full_name}</td>
                <td className="px-4 py-2.5">{s.username}</td>
                <td className="px-4 py-2.5">{roleLabels[s.role] ?? s.role}</td>
                <td className="px-4 py-2.5">{s.phone}</td>
                <td className="px-4 py-2.5">
                  <span className={`text-xs px-2 py-1 rounded-full ${s.is_active_staff ? "bg-kampurse-green-light text-kampurse-green-dark" : "bg-gray-200 text-gray-600"}`}>
                    {s.is_active_staff ? "Active" : "Deactivated"}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <button onClick={() => toggleActive(s)} className="text-kampurse-green-dark hover:underline text-xs">
                    {s.is_active_staff ? "Deactivate" : "Reactivate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}