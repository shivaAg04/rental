"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { PRESET_GRADIENTS } from "@/lib/gradients";
import { MAX_IMAGES } from "@/lib/limits";
import { prisma } from "@/lib/prisma";
import { isUploadedFile, uploadImage } from "@/lib/upload";

const itemSchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  category: z.string().trim().min(1, "Category is required."),
  description: z.string().trim().min(10, "Description is too short."),
  deposit: z.coerce.number().int().min(0, "Deposit must be 0 or more."),
  price3: z.coerce.number().int().min(1, "3-month price must be greater than 0."),
  price6: z.coerce.number().int().min(1, "6-month price must be greater than 0."),
  price12: z.coerce
    .number()
    .int()
    .min(1, "12-month price must be greater than 0."),
  rating: z.coerce.number().min(0).max(5),
  reviewCount: z.coerce.number().int().min(0),
  gradientName: z.string().trim().min(1),
  featured: z.coerce.boolean(),
});

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Not authorized.");
  }
}

function parseForm(formData: FormData) {
  return itemSchema.safeParse({
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
    deposit: formData.get("deposit"),
    price3: formData.get("price3"),
    price6: formData.get("price6"),
    price12: formData.get("price12"),
    rating: formData.get("rating"),
    reviewCount: formData.get("reviewCount"),
    gradientName: formData.get("gradientName"),
    featured: formData.get("featured") === "on",
  });
}

function tenurePlansFrom(data: {
  price3: number;
  price6: number;
  price12: number;
}) {
  return [
    { months: 3, pricePerMonth: data.price3 },
    { months: 6, pricePerMonth: data.price6 },
    { months: 12, pricePerMonth: data.price12 },
  ];
}

export async function createItemAction(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  await requireAdmin();

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Invalid details.";
  }

  const gradient =
    PRESET_GRADIENTS.find((g) => g.name === parsed.data.gradientName) ??
    PRESET_GRADIENTS[0];

  const newFiles = formData.getAll("images").filter(isUploadedFile);
  if (newFiles.length > MAX_IMAGES) {
    return `You can upload up to ${MAX_IMAGES} photos.`;
  }
  const imageUrls = await Promise.all(newFiles.map((file) => uploadImage(file)));

  await prisma.rentalItem.create({
    data: {
      title: parsed.data.title,
      category: parsed.data.category,
      description: parsed.data.description,
      deposit: parsed.data.deposit,
      rating: parsed.data.rating,
      reviewCount: parsed.data.reviewCount,
      gradientFrom: gradient.from,
      gradientTo: gradient.to,
      featured: parsed.data.featured,
      pricing: { create: tenurePlansFrom(parsed.data) },
      images: {
        create: imageUrls.map((url, order) => ({ url, order })),
      },
    },
  });

  revalidatePath("/admin/listings");
  revalidatePath("/");
  redirect("/admin/listings");
}

export async function updateItemAction(
  id: string,
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  await requireAdmin();

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? "Invalid details.";
  }

  const gradient =
    PRESET_GRADIENTS.find((g) => g.name === parsed.data.gradientName) ??
    PRESET_GRADIENTS[0];

  const keptUrls = formData.getAll("keepImageUrls").map(String);
  const newFiles = formData.getAll("images").filter(isUploadedFile);
  if (keptUrls.length + newFiles.length > MAX_IMAGES) {
    return `You can upload up to ${MAX_IMAGES} photos.`;
  }
  const newUrls = await Promise.all(newFiles.map((file) => uploadImage(file)));
  const finalUrls = [...keptUrls, ...newUrls];

  await prisma.$transaction([
    prisma.tenurePlan.deleteMany({ where: { itemId: id } }),
    prisma.itemImage.deleteMany({ where: { itemId: id } }),
    prisma.rentalItem.update({
      where: { id },
      data: {
        title: parsed.data.title,
        category: parsed.data.category,
        description: parsed.data.description,
        deposit: parsed.data.deposit,
        rating: parsed.data.rating,
        reviewCount: parsed.data.reviewCount,
        gradientFrom: gradient.from,
        gradientTo: gradient.to,
        featured: parsed.data.featured,
        pricing: { create: tenurePlansFrom(parsed.data) },
        images: {
          create: finalUrls.map((url, order) => ({ url, order })),
        },
      },
    }),
  ]);

  revalidatePath("/admin/listings");
  revalidatePath("/");
  revalidatePath(`/listing/${id}`);
  redirect("/admin/listings");
}

export async function deleteItemAction(id: string) {
  await requireAdmin();
  await prisma.rentalItem.delete({ where: { id } });
  revalidatePath("/admin/listings");
  revalidatePath("/");
}

export async function toggleItemActiveAction(id: string, active: boolean) {
  await requireAdmin();
  await prisma.rentalItem.update({ where: { id }, data: { active } });
  revalidatePath("/admin/listings");
  revalidatePath("/");
  revalidatePath(`/listing/${id}`);
}
