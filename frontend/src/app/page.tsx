import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import { getProperties } from "@/lib/api";
import { PropertyListItem, PaginatedResponse } from "@/types";

export default async function Home() {
  const data: PaginatedResponse<PropertyListItem> = await getProperties({ campus: "unn" });

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-xl font-medium mb-4">Lodges near UNN</h1>

        {data.results.length === 0 ? (
          <p className="text-foreground-muted text-sm">No listings yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.results.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}