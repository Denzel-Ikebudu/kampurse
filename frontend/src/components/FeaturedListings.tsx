import Link from "next/link";
import PropertyCard from "./PropertyCard";
import ItemCard from "./ItemCard";
import RoommateCard from "./RoommateCard";
import ScrollReveal from "./ScrollReveal";
import { getProperties, getItems, getRoommateRequests } from "@/lib/api";
import {
  PropertyListItem,
  ItemListItem,
  RoommateRequestItem,
  PaginatedResponse,
} from "@/types";

export default async function FeaturedListings() {
  const [propertiesData, itemsData, roommatesData]: [
    PaginatedResponse<PropertyListItem>,
    PaginatedResponse<ItemListItem>,
    PaginatedResponse<RoommateRequestItem>
  ] = await Promise.all([
    getProperties({ campus: "unn" }),
    getItems({ campus: "unn" }),
    getRoommateRequests({ campus: "unn" }),
  ]);

  const featuredProperties = propertiesData.results.slice(0, 4);
  const featuredItems = itemsData.results.slice(0, 4);
  const featuredRoommates = roommatesData.results.slice(0, 2);

  return (
    <>
    <div className="bg-kampurse-green-light text-[#1a1a1a]">
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium">Lodges near you</h2>
          <Link
            href="/lodges"
            className="text-sm text-kampurse-green hover:text-kampurse-green-dark transition-colors"
          >
            View all →
          </Link>
        </div>
        {featuredProperties.length === 0 ? (
          <p className="text-foreground-muted text-sm">No lodges listed yet.</p>
        ) : (
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </ScrollReveal>
        )}
      </section>
    </div>

    <div className="bg-background pt-5">
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium">Fresh on the marketplace</h2>
          <Link
            href="/marketplace"
            className="text-sm text-kampurse-green hover:text-kampurse-green-dark transition-colors"
          >
            View all →
          </Link>
        </div>
        {featuredItems.length === 0 ? (
          <p className="text-foreground-muted text-sm">No items listed yet.</p>
        ) : (
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </ScrollReveal>
        )}
      </section>
    </div>
    
    <div className="bg-kampurse-green-light pt-5 rounded-xl text-[#1a1a1a]">
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium">Looking for a roommate?</h2>
          <Link
            href="/roommates"
            className="text-sm text-kampurse-green hover:text-kampurse-green-dark transition-colors"
          >
            View all →
          </Link>
        </div>
        {featuredRoommates.length === 0 ? (
          <p className="text-foreground-muted text-sm">No roommate requests yet.</p>
        ) : (
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredRoommates.map((request) => (
                <RoommateCard key={request.id} request={request} />
              ))}
            </div>
          </ScrollReveal>
        )}
      </section>
    </div>
    </>
  );
}