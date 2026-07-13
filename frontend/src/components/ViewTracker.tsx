"use client";

import { useEffect } from "react";
import { trackView } from "@/lib/trackView";

export default function ViewTracker({ path, propertyId, itemId }: { path: string; propertyId?: number; itemId?: number }) {
  useEffect(() => {
    trackView(path, propertyId, itemId);
  }, [path, propertyId, itemId]);

  return null;
}