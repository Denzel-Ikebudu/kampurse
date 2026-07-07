import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import { getPropertyBySlug } from "@/lib/api";
import { PropertyDetail } from "@/types";

export default async function LodgeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property: PropertyDetail | null = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  const coverImage = property.images.find((img) => img.is_cover) ?? property.images[0];

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="relative h-72 md:h-96 bg-surface-muted rounded-xl overflow-hidden mb-6">
          {coverImage ? (
            <Image
              src={coverImage.image}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground-muted">
              No image available
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-medium mb-1">{property.title}</h1>
            <p className="text-foreground-muted text-sm">
              {property.location_area}, {property.campus.short_code} &middot; {property.bedrooms} bed &middot; {property.bathrooms} bath
            </p>
          </div>

          <div className="bg-surface-muted border border-border rounded-lg px-4 py-3 md:min-w-[220px]">
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-xl font-medium">
                &#8358;{Number(property.initial_price).toLocaleString()}
              </span>
              <span className="text-xs text-foreground-muted">first year</span>
            </div>
            <p className="text-xs text-foreground-muted mb-3">
              &#8358;{Number(property.subsequent_price).toLocaleString()} / year after
            </p>
            <button className="w-full bg-kampurse-green text-white text-sm py-2.5 rounded-md hover:bg-kampurse-green-dark transition-colors">
              Reserve now
            </button>
          </div>
        </div>

        {property.amenities.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium mb-2">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <span
                  key={amenity.id}
                  className="text-xs px-3 py-1.5 rounded-full border border-border text-foreground-muted"
                >
                  {amenity.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-sm font-medium mb-2">Description</h2>
          <p className="text-sm text-foreground-muted leading-relaxed whitespace-pre-line">
            {property.description}
          </p>
        </div>
      </main>
    </>
  );
}