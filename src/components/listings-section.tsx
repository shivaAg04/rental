"use client";

import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { lowestMonthlyPrice } from "@/lib/pricing";
import { Category, RentalItem } from "@/lib/types";
import { CategoryStrip } from "./category-strip";
import { ItemCard } from "./item-card";

type SortOption = "relevance" | "price-asc" | "price-desc" | "rating";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function ListingsSection({ items: rentalItems }: { items: RentalItem[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [sort, setSort] = useState<SortOption>("relevance");

  const filtered = useMemo(() => {
    let items = rentalItems.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesQuery =
        query.trim().length === 0 ||
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });

    items = [...items].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return lowestMonthlyPrice(a) - lowestMonthlyPrice(b);
        case "price-desc":
          return lowestMonthlyPrice(b) - lowestMonthlyPrice(a);
        case "rating":
          return b.rating - a.rating;
        default:
          return Number(b.featured) - Number(a.featured);
      }
    });

    return items;
  }, [query, category, sort, rentalItems]);

  return (
    <section id="listings" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Browse rentals
        </h2>
        <p className="text-sm text-muted">
          {filtered.length} item{filtered.length === 1 ? "" : "s"} available
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <CategoryStrip active={category} onSelect={setCategory} />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search within results..."
            className="w-full max-w-sm rounded-full border border-border bg-surface px-4 py-2 text-sm outline-none placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-ring/20"
          />

          <div className="flex items-center gap-2 text-sm">
            <SlidersHorizontal className="size-4 text-muted" />
            <label htmlFor="sort" className="text-muted">
              Sort by
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-full border border-border bg-surface px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-ring/20"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="font-medium">No items match your search</p>
          <p className="text-sm text-muted">
            Try a different keyword or category.
          </p>
        </div>
      )}
    </section>
  );
}
