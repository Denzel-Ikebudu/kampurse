"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/auth";
import { getCampuses, getAmenities } from "@/lib/api";

interface Campus { id: number; short_code: string; name: string; }
interface Amenity { id: number; name: string; }

interface PropertyFormData {
  title: string;
  campus: number | "";
  location_area: string;
  room_type: string;
  initial_price: string;
  subsequent_price: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  amenities: number[];
  is_featured: boolean;
}

const roomTypes = ["self_contain", "room_parlour", "flat", "shared", "single_room"];

export default function PropertyForm({ editSlug }: { editSlug?: string }) {
  const router = useRouter();
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingImages, setExistingImages] = useState<{ id: number; image: string; is_cover: boolean }[]>([]);

  const [form, setForm] = useState<PropertyFormData>({
    title: "", campus: "", location_area: "", room_type: "self_contain",
    initial_price: "", subsequent_price: "", bedrooms: 1, bathrooms: 1,
    description: "", amenities: [], is_featured: false,
  });

  useEffect(() => {
    getCampuses().then(setCampuses);
    getAmenities().then(setAmenities);

    if (editSlug) {
      authFetch(`/properties/${editSlug}/`).then(async (res) => {
        const data = await res.json();
        setForm({
          title: data.title,
          campus: data.campus.id,
          location_area: data.location_area,
          room_type: data.room_type,
          initial_price: data.initial_price,
          subsequent_price: data.subsequent_price,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          description: data.description,
          amenities: data.amenities.map((a: Amenity) => a.id),
          is_featured: data.is_featured,
        });
        setExistingImages(data.images ?? []);
      });
    }
  }, [editSlug]);

  function toggleAmenity(id: number) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(id) ? f.amenities.filter((a) => a !== id) : [...f.amenities, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = { ...form, campus: Number(form.campus) };
      const url = editSlug ? `/properties/${editSlug}/` : "/properties/";
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
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/property-images/`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
        }
      }

      router.push("/dashboard/listings");
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
          <label className="text-xs text-foreground-muted block mb-1">Room Type</label>
          <select value={form.room_type} onChange={(e) => setForm({ ...form, room_type: e.target.value })}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface">
            {roomTypes.map((rt) => <option key={rt} value={rt}>{rt.replace("_", " ")}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-foreground-muted block mb-1">Location Area</label>
        <input required value={form.location_area} onChange={(e) => setForm({ ...form, location_area: e.target.value })}
          className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-foreground-muted block mb-1">First-Year Price (₦)</label>
          <input required type="number" value={form.initial_price} onChange={(e) => setForm({ ...form, initial_price: e.target.value })}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface" />
        </div>
        <div>
          <label className="text-xs text-foreground-muted block mb-1">Renewal Price (₦)</label>
          <input required type="number" value={form.subsequent_price} onChange={(e) => setForm({ ...form, subsequent_price: e.target.value })}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-foreground-muted block mb-1">Bedrooms</label>
          <input type="number" min={0} value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: Number(e.target.value) })}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface" />
        </div>
        <div>
          <label className="text-xs text-foreground-muted block mb-1">Bathrooms</label>
          <input type="number" min={0} value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: Number(e.target.value) })}
            className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface" />
        </div>
      </div>

      <div>
        <label className="text-xs text-foreground-muted block mb-1">Description</label>
        <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface" />
      </div>

      <div>
        <label className="text-xs text-foreground-muted block mb-2">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {amenities.map((a) => (
            <button type="button" key={a.id} onClick={() => toggleAmenity(a.id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                form.amenities.includes(a.id) ? "bg-kampurse-green text-white border-kampurse-green" : "border-border text-foreground-muted"
              }`}>
              {a.name}
            </button>
          ))}
        </div>
      </div>

      {existingImages.length > 0 && (
        <div>
          <label className="text-xs text-foreground-muted block mb-2">Current Images</label>
          <div className="flex flex-wrap gap-2">
            {existingImages.map((img) => (
              <div key={img.id} className="relative w-20 h-20 rounded-md overflow-hidden border border-border">
                <img src={img.image} alt="" className="w-full h-full object-cover" />
                {img.is_cover && (
                 <span className="absolute top-0.5 left-0.5 bg-kampurse-green text-white text-[9px] px-1 rounded">
                   Cover
                 </span>
                )}
             </div>
           ))}
         </div>
        </div>
        )}

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
        {isSubmitting ? "Saving..." : editSlug ? "Update Property" : "Create Property"}
      </button>
    </form>
  );
}