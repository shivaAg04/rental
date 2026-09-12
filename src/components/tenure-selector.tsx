"use client";

import { ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { formatINR } from "@/lib/format";
import { RentalItem, TenureMonths } from "@/lib/types";

export function TenureSelector({ item }: { item: RentalItem }) {
  const sortedPlans = [...item.pricing].sort((a, b) => b.months - a.months);
  const [months, setMonths] = useState<TenureMonths>(sortedPlans[0].months);

  const activePlan =
    item.pricing.find((plan) => plan.months === months) ?? item.pricing[0];
  const cheapestPerMonth = Math.min(
    ...item.pricing.map((plan) => plan.pricePerMonth),
  );
  const totalRent = activePlan.pricePerMonth * activePlan.months;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-sm font-medium text-muted">Choose your plan</p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {sortedPlans.map((plan) => {
          const isActive = plan.months === months;
          const isCheapest = plan.pricePerMonth === cheapestPerMonth;
          return (
            <button
              key={plan.months}
              type="button"
              onClick={() => setMonths(plan.months)}
              className={`relative flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-sm transition-colors cursor-pointer ${
                isActive
                  ? "border-brand bg-brand-soft"
                  : "border-border bg-surface hover:bg-surface-muted"
              }`}
            >
              {isCheapest && (
                <span className="absolute -top-2.5 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                  Best value
                </span>
              )}
              <span className="font-semibold">{plan.months} months</span>
              <span className="text-xs text-muted">
                {formatINR(plan.pricePerMonth)}/mo
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-3xl font-bold">
          {formatINR(activePlan.pricePerMonth)}
        </span>
        <span className="text-sm text-muted">/month</span>
      </div>
      <p className="mt-1 text-sm text-muted">
        {formatINR(totalRent)} total for {activePlan.months} months, billed
        monthly
      </p>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-muted px-4 py-3 text-sm">
        <span className="text-muted">Refundable deposit</span>
        <span className="font-semibold">{formatINR(item.deposit)}</span>
      </div>

      <button
        type="button"
        className="mt-5 w-full rounded-full bg-brand py-3 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand-hover cursor-pointer"
      >
        Rent now
      </button>

      <div className="mt-4 flex flex-col gap-2 text-sm text-muted">
        <div className="flex items-center gap-2">
          <Truck className="size-4 text-brand" />
          Free delivery &amp; installation
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-brand" />
          Damage protection available
        </div>
      </div>
    </div>
  );
}
