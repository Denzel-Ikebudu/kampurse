"use client";

import { use } from "react";
import ItemForm from "@/components/ItemForm";

export default function EditItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <div>
      <h1 className="text-xl font-medium mb-4">Edit Item</h1>
      <ItemForm editSlug={slug} />
    </div>
  );
}