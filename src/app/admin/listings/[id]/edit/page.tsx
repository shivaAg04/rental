import { notFound } from "next/navigation";
import { ItemForm } from "@/components/admin/item-form";
import { PRESET_GRADIENTS } from "@/lib/gradients";
import { prisma } from "@/lib/prisma";
import { updateItemAction } from "../../actions";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.rentalItem.findUnique({
    where: { id },
    include: { pricing: true, images: { orderBy: { order: "asc" } } },
  });
  if (!item) notFound();

  const priceFor = (months: number) =>
    item.pricing.find((p) => p.months === months)?.pricePerMonth ?? 0;
  const imageUrls = item.images.map((img) => img.url);
  const gradientName =
    PRESET_GRADIENTS.find(
      (g) => g.from === item.gradientFrom && g.to === item.gradientTo,
    )?.name ?? PRESET_GRADIENTS[0].name;

  const boundAction = updateItemAction.bind(null, id);

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight">Edit listing</h1>
      <p className="mt-1 text-sm text-muted">{item.title}</p>

      <div className="mt-6 max-w-2xl rounded-2xl border border-border bg-surface p-6">
        <ItemForm
          action={boundAction}
          submitLabel="Save changes"
          defaults={{
            title: item.title,
            category: item.category,
            description: item.description,
            deposit: item.deposit,
            price3: priceFor(3),
            price6: priceFor(6),
            price12: priceFor(12),
            rating: item.rating,
            reviewCount: item.reviewCount,
            gradientName,
            images: imageUrls,
            featured: item.featured,
          }}
        />
      </div>
    </div>
  );
}
