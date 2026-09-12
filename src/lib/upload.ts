import { randomUUID } from "node:crypto";

/**
 * Stores an uploaded image and returns its public URL.
 * Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set (production), otherwise
 * writes to /public/uploads for local dev — no external account needed.
 */
export async function uploadImage(file: File): Promise<string> {
  const extension = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf("."))
    : "";
  const filename = `${randomUUID()}${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(`listings/${filename}`, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadsDir, filename), bytes);

  return `/uploads/${filename}`;
}

export function isUploadedFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}
