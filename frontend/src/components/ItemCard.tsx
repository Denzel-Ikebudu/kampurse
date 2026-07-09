import Image from "next/image";
import Link from "next/link";
import { ItemListItem } from "@/types";
import ReserveButton from "./ReserveButton";

export default function ItemCard({ item }: { item: ItemListItem }) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden hover:border-kampurse-green transition-colors">
      <Link href={`/marketplace/${item.slug}`} className="block">
      
        <div className="relative h-40 bg-surface-muted">
          {item.cover_image ? (
            <Image
              src={item.cover_image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground-muted text-sm">
              No image
            </div>
          )}
          {item.is_distress_sale && (
            <span className="absolute top-2 left-2 bg-kampurse-urgent text-white text-xs px-2 py-1 rounded-md">
              Urgent Sale
            </span>
          )}
          {!item.is_distress_sale && item.is_featured && (
            <span className="absolute top-2 left-2 bg-kampurse-green text-white text-xs px-2 py-1 rounded-md">
              Featured
            </span>
          )}
        </div>

        <div className="px-3 pt-3">
          <h3 className="text-sm font-medium truncate">{item.title}</h3>
          <p className="text-xs text-foreground-muted mb-2">
            {item.campus} &middot; {item.condition}
          </p>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-medium">
              &#8358;{Number(item.price).toLocaleString()}
            </span>
            {item.discount_percentage && (
              <span className="text-xs text-kampurse-urgent">
                {item.discount_percentage}% off
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-3 pb-3">
        <ReserveButton
          type="item"
          id={item.id}
          title={item.title}
          price={item.price}
          ctaLabel="I'm interested"
        />
      </div>
    </div>
  );
}