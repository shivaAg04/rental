import { CalendarRange, Shield, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-surface">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 15% 10%, var(--color-brand-soft), transparent), radial-gradient(45% 40% at 90% 0%, color-mix(in oklab, var(--color-accent) 18%, transparent), transparent)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted px-3 py-1 text-xs font-medium text-muted">
          <Sparkles className="size-3.5 text-accent" />
          Over 12,000 items available near you
        </div>

        <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          Furniture &amp; electronics on rent,{" "}
          <span className="text-brand">on your terms</span>
        </h1>

        <p className="mt-4 max-w-xl text-base text-muted sm:text-lg">
          Sofas, beds, ACs, refrigerators, TVs, and more — delivered to your
          door with flexible 3, 6, and 12-month plans. No buying, no hassle.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="#listings"
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand-hover"
          >
            Start browsing
          </a>
          <a
            href="#"
            className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold transition-colors hover:bg-surface-muted"
          >
            How it works
          </a>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-brand" />
            Free delivery &amp; installation
          </div>
          <div className="flex items-center gap-2">
            <CalendarRange className="size-4 text-brand" />
            Flexible 3, 6 &amp; 12-month plans
          </div>
        </div>
      </div>
    </section>
  );
}
