"use client";

import { use } from "react";
import PropertyForm from "@/components/PropertyForm";

export default function EditPropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <div>
      <h1 className="text-xl font-medium mb-4">Edit Property</h1>
      <PropertyForm editSlug={slug} />
    </div>
  );
}