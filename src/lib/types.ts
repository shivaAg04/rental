export type Category =
  | "Furniture"
  | "Appliances"
  | "Electronics"
  | "Mattress & Sleep"
  | "Kitchen & Dining";

export type TenureMonths = 3 | 6 | 12;

export type TenurePlan = {
  months: TenureMonths;
  pricePerMonth: number;
};

export type RentalItem = {
  id: string;
  title: string;
  category: Category;
  description: string;
  deposit: number;
  pricing: TenurePlan[];
  rating: number;
  reviewCount: number;
  gradient: [string, string];
  images: string[];
  featured?: boolean;
  active: boolean;
};
