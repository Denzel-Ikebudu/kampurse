"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await login(username, password);
      router.push("/dashboard/overview");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4">
      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6 w-full max-w-sm">
        <h1 className="text-lg font-medium mb-1">Kampurse Staff Login</h1>
        <p className="text-sm text-foreground-muted mb-5">Sign in to access the dashboard.</p>

        <div className="mb-3">
          <label className="text-xs text-foreground-muted block mb-1">Username</label>
          <input
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface"
          />
        </div>

        <div className="mb-4">
          <label className="text-xs text-foreground-muted block mb-1">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface"
          />
        </div>

        {error && <p className="text-xs text-kampurse-urgent mb-3">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-kampurse-green text-white text-sm py-2.5 rounded-md hover:bg-kampurse-green-dark transition-colors disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}