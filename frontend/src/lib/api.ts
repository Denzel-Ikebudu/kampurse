const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function getProperties(searchParams?: Record<string, string>) {
  const query = searchParams ? `?${new URLSearchParams(searchParams)}` : "";
  const res = await fetch(`${API_BASE_URL}/properties/${query}`, {
    next: { revalidate: 60 }, // cache for 60s, then re-fetch — good balance for listings that don't change every second
  });

  if (!res.ok) {
    throw new Error("Failed to fetch properties");
  }

  return res.json();
}

export async function getPropertyBySlug(slug: string) {
  const res = await fetch(`${API_BASE_URL}/properties/${slug}/`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch property");
  }

  return res.json();
}