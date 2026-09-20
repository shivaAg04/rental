import { Search } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-brand-foreground font-bold">
            V
          </span>
          <span className="text-lg font-semibold tracking-tight">Voko</span>
        </Link>

        <div className="relative mx-2 hidden flex-1 items-center md:flex">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted" />
          <input
            type="text"
            placeholder="Search furniture, appliances, electronics, and more..."
            className="w-full rounded-full border border-border bg-surface-muted py-2.5 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-ring/20"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      <div className="border-t border-border px-4 pb-3 pt-2 md:hidden">
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted" />
          <input
            type="text"
            placeholder="Search rentals..."
            className="w-full rounded-full border border-border bg-surface-muted py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-ring/20"
          />
        </div>
      </div>
    </header>
  );
}
