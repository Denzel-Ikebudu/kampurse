import Image from "next/image";
import Link from "next/link";
import { PropertyListItem } from "@/types";

export default function PropertyCard({ property }: { property: PropertyListItem }) {
  return (
    <Link
      href={`/lodges/${property.slug}`}
      className="block bg-surface border border-border rounded-xl overflow-hidden hover:border-kampurse-green transition-colors"
    >
      <div className="relative h-40 bg-surface-muted">
        {property.cover_image ? (
          <Image
            src={property.cover_image}
            alt={property.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-foreground-muted text-sm">
            No image
          </div>
        )}
        {property.is_featured && (
          <span className="absolute top-2 left-2 bg-kampurse-green text-white text-xs px-2 py-1 rounded-md">
            Featured
          </span>
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-medium truncate">{property.title}</h3>
        <p className="text-xs text-foreground-muted mb-2">
          {property.campus} &middot; {property.bedrooms} bed &middot; {property.bathrooms} bath
        </p>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-base font-medium">
            &#8358;{Number(property.initial_price).toLocaleString()}
          </span>
          <span className="text-xs text-foreground-muted">/ year</span>
        </div>
        <button className="w-full bg-kampurse-green text-white text-sm py-2 rounded-md hover:bg-kampurse-green-dark transition-colors">
          Reserve now
        </button>
      </div>
    </Link>
  );
}