"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const roomTypes = [
  { value: "", label: "All types" },
  { value: "self_contain", label: "Self Contain" },
  { value: "room_parlour", label: "Room & Parlour" },
  { value: "flat", label: "Flat" },
  { value: "shared", label: "Shared Room" },
  { value: "single_room", label: "Single Room" },
];

const priceRanges = [
  { value: "", label: "Any price" },
  { value: "0-100000", label: "Under ₦100k" },
  { value: "100000-200000", label: "₦100k – ₦200k" },
  { value: "200000-300000", label: "₦200k – ₦300k" },
  { value: "300000-999999999", label: "₦300k+" },
];

export default function LodgeFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function handlePriceChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      const [min, max] = value.split("-");
      params.set("min_price", min);
      params.set("max_price", max);
    } else {
      params.delete("min_price");
      params.delete("max_price");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <select
        onChange={(e) => updateFilter("room_type", e.target.value)}
        defaultValue={searchParams.get("room_type") ?? ""}
        className="text-sm border border-border rounded-full px-3 py-1.5 bg-surface"
      >
        {roomTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => handlePriceChange(e.target.value)}
        className="text-sm border border-border rounded-full px-3 py-1.5 bg-surface"
      >
        {priceRanges.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    </div>
  );
}