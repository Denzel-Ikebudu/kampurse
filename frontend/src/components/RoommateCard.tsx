"use client";

import { useState } from "react";
import { RoommateRequestItem } from "@/types";
import { User, MapPin, Calendar, Wallet, Phone } from "lucide-react";

const genderLabels: Record<string, string> = {
  male: "Male",
  female: "Female",
  any: "No preference",
};

export default function RoommateCard({ request }: { request: RoommateRequestItem }) {
  const [revealed, setRevealed] = useState(false);
  const lodgeLabel = request.linked_property_title || request.preferred_location;

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-kampurse-green-light flex items-center justify-center">
            <User size={16} className="text-kampurse-green-dark" />
          </div>
          <div>
            <p className="text-sm font-medium">{request.student_name}</p>
            <p className="text-xs text-foreground-muted">{request.campus}</p>
          </div>
        </div>
        <span className="text-xs px-2 py-1 rounded-full border border-border text-foreground-muted">
          {genderLabels[request.gender_preference] ?? request.gender_preference}
        </span>
      </div>

      {lodgeLabel && (
        <p className="text-xs text-kampurse-green-dark bg-kampurse-green-light rounded-md px-3 py-2 mb-3 flex items-center gap-1.5">
          <MapPin size={13} className="shrink-0" />
          {request.linked_property_title
            ? `Has a lodge: ${lodgeLabel} (listed on Kampurse)`
            : `Has a lodge: ${lodgeLabel}`}
        </p>
      )}

      <p className="text-sm text-foreground-muted leading-relaxed mb-3">
        {request.description}
      </p>

      <div className="flex flex-wrap gap-3 text-xs text-foreground-muted mb-4">
        {(request.budget_min || request.budget_max) && (
          <span className="flex items-center gap-1">
            <Wallet size={13} />
            {request.budget_min && `₦${Number(request.budget_min).toLocaleString()}`}
            {request.budget_min && request.budget_max && " – "}
            {request.budget_max && `₦${Number(request.budget_max).toLocaleString()}`}
            {" "}for roommate
          </span>
        )}
        {request.move_in_date && (
          <span className="flex items-center gap-1">
            <Calendar size={13} /> Move-in: {request.move_in_date}
          </span>
        )}
      </div>

      {revealed ? (
        <div className="w-full bg-kampurse-green-light text-kampurse-green-dark text-sm py-2 rounded-md flex items-center justify-center gap-2">
          <Phone size={14} />
          {request.student_contact}
        </div>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="w-full bg-kampurse-green text-white text-sm py-2 rounded-md hover:bg-kampurse-green-dark transition-colors"
        >
          I&apos;m interested
        </button>
      )}
    </div>
  );
}