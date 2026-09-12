import { RentalItem, TenurePlan } from "./types";

const roundToNearest = (value: number, step: number) =>
  Math.round(value / step) * step;

/** Builds 3/6/12-month plans from a 3-month base rate, with longer tenures priced cheaper per month. */
export function buildTenurePlans(price3Month: number): TenurePlan[] {
  return [
    { months: 3, pricePerMonth: price3Month },
    { months: 6, pricePerMonth: roundToNearest(price3Month * 0.88, 50) },
    { months: 12, pricePerMonth: roundToNearest(price3Month * 0.75, 50) },
  ];
}

export function lowestMonthlyPrice(item: RentalItem) {
  return Math.min(...item.pricing.map((plan) => plan.pricePerMonth));
}

export function planForTenure(item: RentalItem, months: number) {
  return item.pricing.find((plan) => plan.months === months) ?? item.pricing[0];
}
