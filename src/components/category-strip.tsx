"use client";

import {
  BedDouble,
  Laptop,
  LucideIcon,
  Refrigerator,
  Sofa,
  UtensilsCrossed,
} from "lucide-react";
import { categories } from "@/lib/data";
import { Category } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  Sofa,
  Refrigerator,
  Laptop,
  BedDouble,
  UtensilsCrossed,
};

export function CategoryStrip({
  active,
  onSelect,
}: {
  active: Category | "All";
  onSelect: (category: Category | "All") => void;
}) {
  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
      <CategoryPill
        label="All"
        selected={active === "All"}
        onClick={() => onSelect("All")}
      />
      {categories.map(({ name, icon }) => {
        const Icon = iconMap[icon];
        return (
          <CategoryPill
            key={name}
            label={name}
            icon={Icon}
            selected={active === name}
            onClick={() => onSelect(name)}
          />
        );
      })}
    </div>
  );
}

function CategoryPill({
  label,
  icon: Icon,
  selected,
  onClick,
}: {
  label: string;
  icon?: LucideIcon;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
        selected
          ? "border-brand bg-brand text-brand-foreground"
          : "border-border bg-surface text-foreground/80 hover:bg-surface-muted"
      }`}
    >
      {Icon && <Icon className="size-4" />}
      {label}
    </button>
  );
}
