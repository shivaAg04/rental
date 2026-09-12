"use client";

import { Heart, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { formatINR } from "@/lib/format";
import { lowestMonthlyPrice } from "@/lib/pricing";
import { RentalItem } from "@/lib/types";
import { ItemMedia } from "./item-media";

export function ItemCard({ item }: { item: RentalItem }) {
  const [saved, setSaved] = useState(false);
  const startingPrice = lowestMonthlyPrice(item);

  return (
    <Link
      href={`/listing/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <ItemMedia
          imageUrl={item.images[0] ?? null}
          gradient={item.gradient}
          alt={item.title}
          className="absolute inset-0 h-full w-full"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />

        {item.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            Featured
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setSaved((v) => !v);
          }}
          aria-label="Save item"
          aria-pressed={saved}
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-transform hover:scale-105 cursor-pointer"
        >
          <Heart
            className={`size-4 ${saved ? "text-accent" : ""}`}
            fill={saved ? "currentColor" : "none"}
          />
        </button>

        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-black/80">
          {item.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-1 font-semibold tracking-tight">
          {item.title}
        </h3>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted">Starting at</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold">
                {formatINR(startingPrice)}
              </span>
              <span className="text-xs text-muted">/mo</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <Star className="size-3.5 fill-accent text-accent" />
            <span className="font-medium">{item.rating}</span>
            <span className="text-muted">({item.reviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
