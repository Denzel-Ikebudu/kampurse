const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export function trackView(path: string, propertyId?: number, itemId?: number) {
  fetch(`${API_BASE_URL}/analytics/track/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path,
      property: propertyId ?? null,
      item: itemId ?? null,
    }),
  }).catch(() => {}); // silent fail — tracking should never break the page for a user
}