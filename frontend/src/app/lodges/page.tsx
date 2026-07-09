import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import LodgeFilters from "@/components/LodgeFilters";
import { getProperties } from "@/lib/api";
import { PropertyListItem, PaginatedResponse } from "@/types";

export default async function LodgesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;

  const apiParams: Record<string, string> = { campus: "unn" };
  if (params.room_type) apiParams.room_type = params.room_type;
  if (params.min_price) apiParams.min_price = params.min_price;
  if (params.max_price) apiParams.max_price = params.max_price;

const data: PaginatedResponse<PropertyListItem> = await getProperties(apiParams);
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-xl font-medium mb-4">Lodges — UNN</h1>

        <LodgeFilters />

        {data.results.length === 0 ? (
          <p className="text-foreground-muted text-sm mt-4">No listings match your filters.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {data.results.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}