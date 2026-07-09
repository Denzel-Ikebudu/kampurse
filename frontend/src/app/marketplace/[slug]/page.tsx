import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import { getItemBySlug } from "@/lib/api";
import { ItemDetail } from "@/types";
import ReserveButton from "@/components/ReserveButton"

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item: ItemDetail | null = await getItemBySlug(slug);

  if (!item) {
    notFound();
  }

  const coverImage = item.images.find((img) => img.is_cover) ?? item.images[0];

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="relative h-72 md:h-96 bg-surface-muted rounded-xl overflow-hidden mb-6">
          {coverImage ? (
            <Image
              src={coverImage.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-foreground-muted">
              No image available
            </div>
          )}
          {item.is_distress_sale && (
            <span className="absolute top-3 left-3 bg-kampurse-urgent text-white text-xs px-3 py-1.5 rounded-md">
              Urgent Sale{item.distress_reason ? ` — ${item.distress_reason.replace("_", " ")}` : ""}
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-medium mb-1">{item.title}</h1>
            <p className="text-foreground-muted text-sm">
              {item.campus} &middot; {item.category.name} &middot; {item.condition}
            </p>
          </div>

          <div className="bg-surface-muted border border-border rounded-lg px-4 py-3 md:min-w-[220px]">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-xl font-medium">
                &#8358;{Number(item.price).toLocaleString()}
              </span>
              {item.discount_percentage && (
                <span className="text-xs text-kampurse-urgent">
                  {item.discount_percentage}% off
                </span>
              )}
            </div>
            <ReserveButton
              type="item"
              id={item.id}
              title={item.title}
              price={item.price}
              ctaLabel="I'm interested"
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium mb-2">Description</h2>
          <p className="text-sm text-foreground-muted leading-relaxed whitespace-pre-line">
            {item.description}
          </p>
        </div>
      </main>
    </>
  );
}