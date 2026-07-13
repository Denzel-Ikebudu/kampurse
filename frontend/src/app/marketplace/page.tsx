import Header from "@/components/Header";
import ItemCard from "@/components/ItemCard";
import { getItems } from "@/lib/api";
import { ItemListItem, PaginatedResponse } from "@/types";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default async function MarketplacePage() {
  const data: PaginatedResponse<ItemListItem> = await getItems({ campus: "unn" });

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-medium">Marketplace — UNN</h1>
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-kampurse-urgent text-white text-sm px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Sell an Item
          </a>
        </div>

        {data.results.length === 0 ? (
          <p className="text-foreground-muted text-sm">No items listed yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.results.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}