import type {
  ItemImage as DbItemImage,
  RentalItem as DbRentalItem,
  TenurePlan as DbTenurePlan,
} from "@/generated/prisma/client";
import { Category, RentalItem, TenureMonths } from "./types";

type DbItemWithRelations = DbRentalItem & {
  pricing: DbTenurePlan[];
  images: DbItemImage[];
};

export function toRentalItem(item: DbItemWithRelations): RentalItem {
  return {
    id: item.id,
    title: item.title,
    category: item.category as Category,
    description: item.description,
    deposit: item.deposit,
    pricing: item.pricing.map((plan) => ({
      months: plan.months as TenureMonths,
      pricePerMonth: plan.pricePerMonth,
    })),
    rating: item.rating,
    reviewCount: item.reviewCount,
    gradient: [item.gradientFrom, item.gradientTo],
    images: [...item.images]
      .sort((a, b) => a.order - b.order)
      .map((img) => img.url),
    featured: item.featured,
  };
}
