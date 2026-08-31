"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getCampuses, getProperties } from "@/lib/api";

interface Campus {
  id: number;
  short_code: string;
}

interface PropertyOption {
  id: number;
  title: string;
  location_area: string;
}

const genders = [
  { value: "any", label: "No Preference" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export default function RoommateSubmitModal() {
  const [open, setOpen] = useState(false);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [isListedOnKampurse, setIsListedOnKampurse] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    student_name: "",
    student_contact: "",
    campus: "",
    linked_property: "",
    preferred_location: "",
    gender_preference: "any",
    budget_min: "",
    budget_max: "",
    move_in_date: "",
    description: "",
  });

  useEffect(() => {
    if (open) getCampuses().then(setCampuses);
  }, [open]);

  useEffect(() => {
    if (!isListedOnKampurse || !form.campus) {
      setProperties([]);
      return;
    }
    const campusObj = campuses.find((c) => c.id === Number(form.campus));
    if (!campusObj) return;

    setLoadingProperties(true);
    getProperties({ campus: campusObj.short_code.toLowerCase() })
      .then((data) => setProperties(data.results ?? []))
      .finally(() => setLoadingProperties(false));
  }, [isListedOnKampurse, form.campus, campuses]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        campus: Number(form.campus),
        linked_property: form.linked_property ? Number(form.linked_property) : null,
        budget_min: form.budget_min || null,
        budget_max: form.budget_max || null,
        move_in_date: form.move_in_date || null,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roommates/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      setSuccess(true);
    } catch {
      setError("Could not submit. Check all required fields are filled correctly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function closeAndReset() {
    setOpen(false);
    setSuccess(false);
    setError("");
    setIsListedOnKampurse(false);
    setForm({
      student_name: "", student_contact: "", campus: "", linked_property: "",
      preferred_location: "", gender_preference: "any", budget_min: "", budget_max: "",
      move_in_date: "", description: "",
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-kampurse-green text-white text-sm px-5 py-2.5 rounded-md hover:bg-kampurse-green-dark transition-colors"
      >
        Post a Roommate Request
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-medium">Post a Roommate Request</h2>
              <button onClick={closeAndReset} aria-label="Close">
                <X size={20} className="text-foreground-muted" />
              </button>
            </div>

            {success ? (
              <div className="text-center py-6">
                <p className="text-sm mb-1">Request submitted!</p>
                <p className="text-xs text-foreground-muted mb-4">
                  Kampurse will review it shortly before it goes live.
                </p>
                <button
                  onClick={closeAndReset}
                  className="bg-kampurse-green text-white text-sm px-5 py-2 rounded-md hover:bg-kampurse-green-dark transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-xs text-foreground-muted bg-surface-muted rounded-md p-2.5">
                  This is for students who already have a lodge (or have one picked out) and want
                  someone to join and split the cost.
                </p>

                <div>
                  <label className="text-xs text-foreground-muted block mb-1">Your Name</label>
                  <input required value={form.student_name}
                    onChange={(e) => setForm({ ...form, student_name: e.target.value })}
                    className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface-muted" />
                </div>

                <div>
                  <label className="text-xs text-foreground-muted block mb-1">Phone / WhatsApp</label>
                  <input required value={form.student_contact}
                    onChange={(e) => setForm({ ...form, student_contact: e.target.value })}
                    className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface-muted" />
                  <p className="text-[11px] text-foreground-muted mt-1">
                    This will be visible so others can reach out to you directly.
                  </p>
                </div>

                <div>
                  <label className="text-xs text-foreground-muted block mb-1">Campus</label>
                  <select required value={form.campus}
                    onChange={(e) => setForm({ ...form, campus: e.target.value, linked_property: "" })}
                    className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface-muted">
                    <option value="">Select</option>
                    {campuses.map((c) => <option key={c.id} value={c.id}>{c.short_code}</option>)}
                  </select>
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={isListedOnKampurse}
                    onChange={(e) => {
                      setIsListedOnKampurse(e.target.checked);
                      setForm({ ...form, linked_property: "", preferred_location: "" });
                    }} />
                  This lodge is already listed on Kampurse
                </label>

                {isListedOnKampurse ? (
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Which Lodge?</label>
                    <select required value={form.linked_property} disabled={!form.campus || loadingProperties}
                      onChange={(e) => setForm({ ...form, linked_property: e.target.value })}
                      className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface-muted disabled:opacity-60">
                      <option value="">
                        {!form.campus ? "Select a campus first" : loadingProperties ? "Loading..." : "Select a lodge"}
                      </option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>{p.title} — {p.location_area}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Lodge Location</label>
                    <input required value={form.preferred_location}
                      placeholder="e.g. Hilltop, near Faculty of Arts"
                      onChange={(e) => setForm({ ...form, preferred_location: e.target.value })}
                      className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface-muted" />
                    <p className="text-[11px] text-foreground-muted mt-1">
                      Include more details about the lodge in the description below.
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs text-foreground-muted block mb-1">Gender Preference</label>
                  <select value={form.gender_preference}
                    onChange={(e) => setForm({ ...form, gender_preference: e.target.value })}
                    className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface-muted">
                    {genders.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Roommate Pays From (₦)</label>
                    <input type="number" value={form.budget_min}
                      onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
                      className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface-muted" />
                  </div>
                  <div>
                    <label className="text-xs text-foreground-muted block mb-1">Up To (₦)</label>
                    <input type="number" value={form.budget_max}
                      onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
                      className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface-muted" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-foreground-muted block mb-1">Move-in Date (optional)</label>
                  <input type="date" value={form.move_in_date}
                    onChange={(e) => setForm({ ...form, move_in_date: e.target.value })}
                    className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface-muted" />
                </div>

                <div>
                  <label className="text-xs text-foreground-muted block mb-1">
                    About You / Lodge Details (rooms, rent breakdown, etc.)
                  </label>
                  <textarea required rows={3} value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full text-sm border border-border rounded-md px-3 py-2 bg-surface-muted" />
                </div>

                {error && <p className="text-xs text-kampurse-urgent">{error}</p>}

                <button type="submit" disabled={isSubmitting}
                  className="w-full bg-kampurse-green text-white text-sm py-2.5 rounded-md hover:bg-kampurse-green-dark transition-colors disabled:opacity-60">
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}