import { ChevronRight, ShieldCheck, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ImageCarousel } from "@/components/image-carousel";
import { ItemMedia } from "@/components/item-media";
import { TenureSelector } from "@/components/tenure-selector";
import { formatINR } from "@/lib/format";
import { toRentalItem } from "@/lib/mappers";
import { lowestMonthlyPrice } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await prisma.rentalItem.findUnique({ where: { id } });
  return { title: item ? `${item.title} — Voko` : "Voko" };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dbItem = await prisma.rentalItem.findUnique({
    where: { id },
    include: { pricing: true, images: { orderBy: { order: "asc" } } },
  });
  if (!dbItem || !dbItem.active) notFound();
  const item = toRentalItem(dbItem);

  const startingPrice = lowestMonthlyPrice(item);
  const relatedDbItems = await prisma.rentalItem.findMany({
    where: { category: item.category, id: { not: item.id }, active: true },
    include: { pricing: true, images: { orderBy: { order: "asc" } } },
    take: 4,
  });
  const related = relatedDbItems.map(toRentalItem);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-sm text-muted">
            <Link href="/" className="transition-colors hover:text-brand">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link
              href={`/?category=${encodeURIComponent(item.category)}`}
              className="transition-colors hover:text-brand"
            >
              {item.category}
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground">{item.title}</span>
          </nav>

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <ImageCarousel
                  images={item.images}
                  gradient={item.gradient}
                  alt={item.title}
                />
                {item.featured && (
                  <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    Featured
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium">
                    {item.category}
                  </span>
                  <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    {item.title}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-accent text-accent" />
                      <span className="font-medium text-foreground">
                        {item.rating}
                      </span>
                      ({item.reviewCount} reviews)
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted sm:hidden">
                  Starting at{" "}
                  <span className="font-semibold text-foreground">
                    {formatINR(startingPrice)}/mo
                  </span>
                </p>
              </div>

              <div className="mt-6 border-t border-border pt-6">
                <h2 className="font-semibold">About this item</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 flex items-start gap-2 rounded-xl bg-surface-muted p-4 text-sm text-muted">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand" />
                All items are quality-checked and sanitized before delivery.
                Swap or return anytime after the minimum tenure.
              </div>
            </div>

            <div className="lg:sticky lg:top-20 lg:self-start">
              <TenureSelector item={item} />
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold tracking-tight">
                More in {item.category}
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((relatedItem) => (
                  <Link
                    key={relatedItem.id}
                    href={`/listing/${relatedItem.id}`}
                    className="group overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
                  >
                    <ItemMedia
                      imageUrl={relatedItem.images[0] ?? null}
                      gradient={relatedItem.gradient}
                      alt={relatedItem.title}
                      className="aspect-[4/3] w-full"
                    />
                    <div className="p-4">
                      <h3 className="line-clamp-1 font-semibold">
                        {relatedItem.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        Starting at{" "}
                        <span className="font-semibold text-foreground">
                          {formatINR(lowestMonthlyPrice(relatedItem))}/mo
                        </span>
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
