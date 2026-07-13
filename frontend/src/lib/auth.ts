const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export interface StaffUser {
  role: "owner" | "content_manager" | "support_sales";
  full_name: string;
}

export async function login(username: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("Invalid username or password.");
  }

  const data = await res.json();
  localStorage.setItem("kampurse_access_token", data.access);
  localStorage.setItem("kampurse_refresh_token", data.refresh);
  localStorage.setItem("kampurse_user", JSON.stringify({ role: data.role, full_name: data.full_name }));

  return data;
}

export function logout() {
  localStorage.removeItem("kampurse_access_token");
  localStorage.removeItem("kampurse_refresh_token");
  localStorage.removeItem("kampurse_user");
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("kampurse_access_token");
}

export function getCurrentUser(): StaffUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("kampurse_user");
  return raw ? JSON.parse(raw) : null;
}

/** Authenticated fetch wrapper — attaches the Bearer token automatically */
export async function authFetch(path: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res;
}