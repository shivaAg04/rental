import { Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-brand-foreground font-bold">
            RN
          </span>
          <span className="text-lg font-semibold tracking-tight">RN Rentals</span>
        </div>
        <p className="mt-3 text-sm text-muted">
          Furniture &amp; electronics on flexible monthly rent, delivered
          across India.
        </p>
        <a
          href="tel:+916299311018"
          className="mt-3 flex w-fit items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-hover"
        >
          <Phone className="size-4" />
          +91 62993 11018
        </a>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} RN Rentals. All rights reserved.</p>
          <p>Made for modern Indian homes.</p>
        </div>
      </div>
    </footer>
  );
}
