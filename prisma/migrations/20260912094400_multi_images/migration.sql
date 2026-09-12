/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `RentalItem` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ItemImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "itemId" TEXT NOT NULL,
    CONSTRAINT "ItemImage_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "RentalItem" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_RentalItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "deposit" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 4.5,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "gradientFrom" TEXT NOT NULL,
    "gradientTo" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_RentalItem" ("category", "createdAt", "deposit", "description", "featured", "gradientFrom", "gradientTo", "id", "location", "rating", "reviewCount", "title", "updatedAt") SELECT "category", "createdAt", "deposit", "description", "featured", "gradientFrom", "gradientTo", "id", "location", "rating", "reviewCount", "title", "updatedAt" FROM "RentalItem";
DROP TABLE "RentalItem";
ALTER TABLE "new_RentalItem" RENAME TO "RentalItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
