"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/auth";
import { getCampuses, getCategories } from "@/lib/api";

interface Campus { id: number; short_code: string; }
interface Category { id: number; name: string; }

interface ItemFormData {
  title: string;
  campus: number | "";
  category: number | "";
  condition: string;
  price: string;
  description: string;
  seller_name: string;
  seller_contact: string;
  is_distress_sale: boolean;
  distress_reason: string;
  discount_percentage: string;
  is_featured: boolean;
}

const conditions = ["new", "like_new", "good", "fair"];
const distressReasons = ["relocating", "graduating", "urgent_cash", "other"];

export default function ItemForm({ editSlug }: { editSlug?: string }) {
  const router = useRouter();
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<ItemFormData>({
    title: "", campus: "", category: "", condition: "good", price: "",
    description: "", seller_name: "", seller_contact: "",
    is_distress_sale: false, distress_reason: "", discount_percentage: "",
    is_featured: false,
  });

  useEffect(() => {
    getCampuses().then(setCampuses);
    getCategories().then(setCategories);

    if (editSlug) {
      authFetch(`/items/${editSlug}/`).then(async (res) => {
        const data = await res.json();
        setForm({
          title: data.title,
          campus: data.campus?.id ?? "",
          category: data.category?.id ?? "",
          condition: data.condition,
          price: data.price,
          description: data.description,
          seller_name: data.seller_name ?? "",
          seller_contact: data.seller_contact ?? "",
          is_distress_sale: data.is_distress_sale,
          distress_reason: data.distress_reason ?? "",
          discount_percentage: data.discount_percentage ?? "",
          is_featured: data.is_featured,
        });
      });
    }
  }, [editSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        campus: Number(form.campus),
        category: Number(form.category),
        discount_percentage: form.discount_percentage || null,
      };
      const url = editSlug ? `/items/${editSlug}/` : "/items/";
      const method = editSlug ? "PATCH" : "POST";

      const res = await authFetch(url, { method, body: JSON.stringify(payload) });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(JSON.stringify(errData));
      }
      const saved = await res.json();

      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          const formData = new FormData();
          formData.append("property", String(saved.id));
          formData.append("image", images[i]);
          formData.append("is_cover", i === 0 ? "true" : "false");
          formData.append("order", String(i));

          const token = localStorage.getItem("kampurse_access_token");
          const imgRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property-images/`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });

          if (!imgRes.ok) {
            const errText = await imgRes.text();
            console.error("Image upload failed:", errText);
            setError("Property saved, but one or more images failed to upload.");
          }
        }
      }

      router.push("/dashboard/marketplace");
    } catch {
      setError("Could not save. Check all required fields are filled correctly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label className="text-xs text-foreground-muted block mb-1">Title</label>
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-foreground-muted block mb-1">Campus</label>
          <select required value={form.campus} onChange={(e) => setForm({ ...form, campus: Number(e.target.value) })}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface">
            <option value="">Select campus</option>
            {campuses.map((c) => <option key={c.id} value={c.id}>{c.short_code}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-foreground-muted block mb-1">Category</label>
          <select required value={form.category} onChange={(e) => setForm({ ...form, category: Number(e.target.value) })}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface">
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-foreground-muted block mb-1">Condition</label>
          <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface">
            {conditions.map((c) => <option key={c} value={c}>{c.replace("_", " ")}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-foreground-muted block mb-1">Price (₦)</label>
          <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface" />
        </div>
      </div>

      <div>
        <label className="text-xs text-foreground-muted block mb-1">Description</label>
        <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-foreground-muted block mb-1">Seller Name</label>
          <input required value={form.seller_name} onChange={(e) => setForm({ ...form, seller_name: e.target.value })}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface" />
        </div>
        <div>
          <label className="text-xs text-foreground-muted block mb-1">Seller Contact (internal only)</label>
          <input required value={form.seller_contact} onChange={(e) => setForm({ ...form, seller_contact: e.target.value })}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface" />
        </div>
      </div>

      <div className="bg-surface-muted border border-border rounded-lg p-3 space-y-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_distress_sale}
            onChange={(e) => setForm({ ...form, is_distress_sale: e.target.checked })} />
          Distress / Urgent Sale
        </label>

        {form.is_distress_sale && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-foreground-muted block mb-1">Reason</label>
              <select value={form.distress_reason} onChange={(e) => setForm({ ...form, distress_reason: e.target.value })}
                className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface">
                <option value="">Select reason</option>
                {distressReasons.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-foreground-muted block mb-1">Discount % (optional)</label>
              <input type="number" value={form.discount_percentage}
                onChange={(e) => setForm({ ...form, discount_percentage: e.target.value })}
                className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface" />
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="text-xs text-foreground-muted block mb-1">Images {editSlug && "(optional — adds new images)"}</label>
        <input type="file" multiple accept="image/*" onChange={(e) => setImages(e.target.files)} className="text-sm" />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
        Featured listing
      </label>

      {error && <p className="text-xs text-kampurse-urgent">{error}</p>}

      <button type="submit" disabled={isSubmitting}
        className="bg-kampurse-green text-white text-sm px-5 py-2.5 rounded-md hover:bg-kampurse-green-dark transition-colors disabled:opacity-60">
        {isSubmitting ? "Saving..." : editSlug ? "Update Item" : "Create Item"}
      </button>
    </form>
  );
}