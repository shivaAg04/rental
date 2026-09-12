import { Pencil, Plus, Star } from "lucide-react";
import Link from "next/link";
import { ItemMedia } from "@/components/item-media";
import { formatINR } from "@/lib/format";
import { toRentalItem } from "@/lib/mappers";
import { lowestMonthlyPrice } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";
import { ActiveToggle } from "./active-toggle";
import { DeleteItemButton } from "./delete-item-button";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  const dbItems = await prisma.rentalItem.findMany({
    include: { pricing: true, images: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  const items = dbItems.map(toRentalItem);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Listings</h1>
          <p className="mt-1 text-sm text-muted">
            {items.length} item{items.length === 1 ? "" : "s"} in the catalog
          </p>
        </div>
        <Link
          href="/admin/listings/new"
          className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand-hover"
        >
          <Plus className="size-4" />
          Add listing
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Starting price</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Active</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-border last:border-0 ${item.active ? "" : "opacity-50"}`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <ItemMedia
                      imageUrl={item.images[0] ?? null}
                      gradient={item.gradient}
                      alt={item.title}
                      className="size-10 shrink-0 rounded-lg"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.title}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{item.category}</td>
                <td className="px-4 py-3 font-medium">
                  {formatINR(lowestMonthlyPrice(item))}/mo
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Star className="size-3.5 fill-accent text-accent" />
                    {item.rating}
                    <span className="text-muted">({item.reviewCount})</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {item.featured ? (
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand">
                      Featured
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <ActiveToggle
                    id={item.id}
                    title={item.title}
                    active={item.active}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/listings/${item.id}/edit`}
                      aria-label={`Edit ${item.title}`}
                      className="flex size-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-surface-muted"
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                    <DeleteItemButton id={item.id} title={item.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-muted">
            No listings yet. Add your first one.
          </p>
        )}
      </div>
    </div>
  );
}
