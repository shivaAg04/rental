import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { buildTenurePlans } from "../src/lib/pricing";

async function createAdapter() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  if (tursoUrl && tursoToken) {
    return new PrismaLibSql({ url: tursoUrl, authToken: tursoToken });
  }

  const { PrismaBetterSqlite3 } = await import(
    "@prisma/adapter-better-sqlite3"
  );
  return new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  });
}

const items = [
  {
    title: "3-Seater Fabric Sofa",
    category: "Furniture",
    description:
      "Plush 3-seater fabric sofa with sturdy wooden frame, perfect for living rooms. Delivered, assembled, and picked up at the end of your tenure.",
    deposit: 1500,
    basePrice: 2199,
    rating: 4.7,
    reviewCount: 112,
    gradient: ["#0f766e", "#134e4a"],
    featured: true,
  },
  {
    title: "Queen Size Bed with Storage",
    category: "Furniture",
    description:
      "Engineered wood queen bed with hydraulic storage, includes a supportive plywood base. Great for 1BHK/2BHK setups.",
    deposit: 1200,
    basePrice: 1699,
    rating: 4.6,
    reviewCount: 68,
    gradient: ["#6d5acd", "#332a66"],
    featured: false,
  },
  {
    title: "4-Seater Dining Table Set",
    category: "Furniture",
    description:
      "Solid-top dining table with 4 cushioned chairs. Scratch-resistant finish, easy to move between homes.",
    deposit: 1000,
    basePrice: 1899,
    rating: 4.5,
    reviewCount: 41,
    gradient: ["#b45309", "#5c2a04"],
    featured: false,
  },
  {
    title: "Ergonomic Office Chair",
    category: "Furniture",
    description:
      "Mesh-back ergonomic chair with adjustable armrests and lumbar support — built for long work-from-home days.",
    deposit: 500,
    basePrice: 899,
    rating: 4.6,
    reviewCount: 89,
    gradient: ["#334155", "#0f172a"],
    featured: false,
  },
  {
    title: "Double Door Refrigerator 265L",
    category: "Appliances",
    description:
      "Frost-free double door refrigerator, 265L capacity — ideal for a family of 3-4. Free installation included.",
    deposit: 2000,
    basePrice: 1599,
    rating: 4.8,
    reviewCount: 156,
    gradient: ["#0e7490", "#083344"],
    featured: true,
  },
  {
    title: "Front Load Washing Machine 7kg",
    category: "Appliances",
    description:
      "7kg front-load washing machine with multiple wash programs. Low water and power consumption.",
    deposit: 2000,
    basePrice: 1499,
    rating: 4.7,
    reviewCount: 103,
    gradient: ["#15803d", "#0a3d1c"],
    featured: false,
  },
  {
    title: "1.5 Ton Split AC",
    category: "Appliances",
    description:
      "Energy-efficient 1.5 ton split AC with copper condenser coil. Includes one free servicing during your tenure.",
    deposit: 2500,
    basePrice: 2499,
    rating: 4.8,
    reviewCount: 201,
    gradient: ["#1d4ed8", "#0b1e63"],
    featured: true,
  },
  {
    title: "RO+UV Water Purifier",
    category: "Appliances",
    description:
      "7-stage RO+UV water purifier with mineral cartridge and 8L storage tank. Filter changes included.",
    deposit: 500,
    basePrice: 599,
    rating: 4.5,
    reviewCount: 54,
    gradient: ["#166534", "#052e16"],
    featured: false,
  },
  {
    title: '43" Smart LED TV',
    category: "Electronics",
    description:
      "43-inch full-HD smart LED TV with built-in streaming apps and voice remote.",
    deposit: 1500,
    basePrice: 1299,
    rating: 4.7,
    reviewCount: 132,
    gradient: ["#7c2d12", "#3b1206"],
    featured: false,
  },
  {
    title: "MacBook Air M2",
    category: "Electronics",
    description:
      "13-inch MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Comes with charger and a protective sleeve.",
    deposit: 5000,
    basePrice: 3499,
    rating: 4.9,
    reviewCount: 97,
    gradient: ["#be185d", "#5c0a2b"],
    featured: true,
  },
  {
    title: "Orthopedic Memory Foam Mattress (Queen)",
    category: "Mattress & Sleep",
    description:
      "Medium-firm orthopedic memory foam mattress, queen size, with removable washable cover.",
    deposit: 500,
    basePrice: 999,
    rating: 4.6,
    reviewCount: 76,
    gradient: ["#4b5563", "#1f2937"],
    featured: false,
  },
  {
    title: "Convection Microwave Oven 25L",
    category: "Kitchen & Dining",
    description:
      "25L convection microwave with grill and bake functions, ideal for daily cooking and baking.",
    deposit: 800,
    basePrice: 699,
    rating: 4.5,
    reviewCount: 38,
    gradient: ["#e8823a", "#9a4b12"],
    featured: false,
  },
];

async function main() {
  const adapter = await createAdapter();
  const prisma = new PrismaClient({ adapter });

  const existingItemCount = await prisma.rentalItem.count();
  if (existingItemCount > 0) {
    console.log(
      `Skipping catalog seed: ${existingItemCount} item(s) already exist. ` +
        "Delete them first if you want to reseed the sample catalog.",
    );
  } else {
    for (const item of items) {
      await prisma.rentalItem.create({
        data: {
          title: item.title,
          category: item.category,
          description: item.description,
          deposit: item.deposit,
          rating: item.rating,
          reviewCount: item.reviewCount,
          gradientFrom: item.gradient[0],
          gradientTo: item.gradient[1],
          featured: item.featured,
          pricing: {
            create: buildTenurePlans(item.basePrice),
          },
        },
      });
    }
    console.log(`Seeded ${items.length} items.`);
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@rentro.app";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
  if (!process.env.ADMIN_PASSWORD) {
    console.warn(
      "ADMIN_PASSWORD not set — using the dev default. Set ADMIN_EMAIL and " +
        "ADMIN_PASSWORD env vars before seeding a production database.",
    );
  }

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Rentro Admin",
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  console.log(`Ensured admin user: ${adminEmail}`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
