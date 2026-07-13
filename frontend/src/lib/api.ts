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

export async function getItems(searchParams?: Record<string, string>) {
  const query = searchParams ? `?${new URLSearchParams(searchParams)}` : "";
  const res = await fetch(`${API_BASE_URL}/items/${query}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch items");
  }

  return res.json();
}

export async function getItemBySlug(slug: string) {
  const res = await fetch(`${API_BASE_URL}/items/${slug}/`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch item");
  }

  return res.json();
}

export async function getRoommateRequests(searchParams?: Record<string, string>) {
  const query = searchParams ? `?${new URLSearchParams(searchParams)}` : "";
  const res = await fetch(`${API_BASE_URL}/roommates/${query}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch roommate requests");
  }

  return res.json();
}

interface CampusApiResult {
  id: number;
  name: string;
  short_code: string;
  slug: string;
}

interface AmenityApiResult {
  id: number;
  name: string;
  icon_name: string;
}

interface CategoryApiResult {
  id: number;
  name: string;
  slug: string;
}

export async function getCampuses(): Promise<CampusApiResult[]> {
  const res = await fetch(`${API_BASE_URL}/campuses/`);
  if (!res.ok) throw new Error("Failed to fetch campuses");
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function getAmenities(): Promise<AmenityApiResult[]> {
  const res = await fetch(`${API_BASE_URL}/amenities/`);
  if (!res.ok) throw new Error("Failed to fetch amenities");
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function getCategories(): Promise<CategoryApiResult[]> {
  const res = await fetch(`${API_BASE_URL}/categories/`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return Array.isArray(data) ? data : (data.results ?? []);
}