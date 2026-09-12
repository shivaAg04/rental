"use client";

import { Plus, X } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { ItemMedia } from "@/components/item-media";
import { categories } from "@/lib/data";
import { PRESET_GRADIENTS } from "@/lib/gradients";
import { MAX_IMAGES, MAX_IMAGE_BYTES } from "@/lib/limits";

type ItemFormAction = (
  prevState: string | undefined,
  formData: FormData,
) => Promise<string | undefined>;

export type ItemFormDefaults = {
  title: string;
  category: string;
  description: string;
  deposit: number;
  price3: number;
  price6: number;
  price12: number;
  rating: number;
  reviewCount: number;
  gradientName: string;
  images: string[];
  featured: boolean;
};

const emptyDefaults: ItemFormDefaults = {
  title: "",
  category: categories[0].name,
  description: "",
  deposit: 0,
  price3: 0,
  price6: 0,
  price12: 0,
  rating: 4.5,
  reviewCount: 0,
  gradientName: PRESET_GRADIENTS[0].name,
  images: [],
  featured: false,
};

type NewFile = { file: File; url: string };

export function ItemForm({
  action,
  defaults = emptyDefaults,
  submitLabel,
}: {
  action: ItemFormAction;
  defaults?: ItemFormDefaults;
  submitLabel: string;
}) {
  const [error, formAction, pending] = useActionState(action, undefined);
  const [existingImages, setExistingImages] = useState<string[]>(defaults.images);
  const [newFiles, setNewFiles] = useState<NewFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fallbackGradient: [string, string] = [
    PRESET_GRADIENTS.find((g) => g.name === defaults.gradientName)?.from ??
      PRESET_GRADIENTS[0].from,
    PRESET_GRADIENTS.find((g) => g.name === defaults.gradientName)?.to ??
      PRESET_GRADIENTS[0].to,
  ];

  const totalCount = existingImages.length + newFiles.length;

  // Keep the native file input's FileList in sync with our accumulated
  // selection, so the same "images" field submits everything the user
  // added across multiple picks (browsers replace, not append, on each pick).
  useEffect(() => {
    if (!fileInputRef.current) return;
    const dt = new DataTransfer();
    newFiles.forEach(({ file }) => dt.items.add(file));
    fileInputRef.current.files = dt.files;
  }, [newFiles]);

  useEffect(() => {
    return () => {
      newFiles.forEach(({ url }) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- revoke only on unmount
  }, []);

  function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;

    let remainingSlots = MAX_IMAGES - totalCount;
    const accepted: NewFile[] = [];
    let message: string | null = null;

    for (const file of Array.from(fileList)) {
      if (remainingSlots <= 0) {
        message = `You can upload up to ${MAX_IMAGES} photos.`;
        break;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        message = `"${file.name}" is too large — please use photos under 8MB.`;
        continue;
      }
      accepted.push({ file, url: URL.createObjectURL(file) });
      remainingSlots -= 1;
    }

    setFileError(message);
    if (accepted.length > 0) {
      setNewFiles((prev) => [...prev, ...accepted]);
    }
  }

  function removeExisting(url: string) {
    setExistingImages((prev) => prev.filter((u) => u !== url));
    setFileError(null);
  }

  function removeNew(index: number) {
    setNewFiles((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
    setFileError(null);
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {existingImages.map((url) => (
        <input key={url} type="hidden" name="keepImageUrls" value={url} />
      ))}

      <Field label="Photos" htmlFor="images">
        <div className="flex flex-wrap gap-3">
          {existingImages.map((url) => (
            <div key={url} className="group relative size-20">
              <ItemMedia
                imageUrl={url}
                gradient={fallbackGradient}
                alt="Listing photo"
                className="size-20 rounded-xl"
              />
              <button
                type="button"
                onClick={() => removeExisting(url)}
                aria-label="Remove photo"
                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-danger text-white shadow-sm cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}

          {newFiles.map(({ url }, i) => (
            <div key={url} className="group relative size-20">
              <ItemMedia
                imageUrl={url}
                gradient={fallbackGradient}
                alt="New photo"
                className="size-20 rounded-xl"
              />
              <button
                type="button"
                onClick={() => removeNew(i)}
                aria-label="Remove photo"
                className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-danger text-white shadow-sm cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}

          {totalCount < MAX_IMAGES && (
            <label
              htmlFor="images"
              className="flex size-20 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border text-muted transition-colors hover:border-brand hover:text-brand"
            >
              <Plus className="size-5" />
            </label>
          )}
        </div>

        <input
          ref={fileInputRef}
          id="images"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFilesSelected(e.target.files)}
          className="hidden"
        />

        {fileError ? (
          <p className="mt-2 text-xs text-danger">{fileError}</p>
        ) : (
          <p className="mt-2 text-xs text-muted">
            Up to {MAX_IMAGES} photos, 8MB each. First photo is the cover
            image. Without any photos, the fallback color below is used
            instead.
          </p>
        )}
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Title" htmlFor="title">
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={defaults.title}
            className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-ring/20"
          />
        </Field>

        <Field label="Category" htmlFor="category">
          <select
            id="category"
            name="category"
            defaultValue={defaults.category}
            className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-ring/20"
          >
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Description" htmlFor="description">
        <textarea
          id="description"
          name="description"
          required
          rows={3}
          defaultValue={defaults.description}
          className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-ring/20 resize-none"
        />
      </Field>

      <Field label="Fallback color (if no photo)" htmlFor="gradientName">
        <select
          id="gradientName"
          name="gradientName"
          defaultValue={defaults.gradientName}
          className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-ring/20"
        >
          {PRESET_GRADIENTS.map((g) => (
            <option key={g.name} value={g.name}>
              {g.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-3 gap-4">
        <Field label="3-month price (₹/mo)" htmlFor="price3">
          <input
            id="price3"
            name="price3"
            type="number"
            min={1}
            required
            defaultValue={defaults.price3 || ""}
            className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-ring/20"
          />
        </Field>

        <Field label="6-month price (₹/mo)" htmlFor="price6">
          <input
            id="price6"
            name="price6"
            type="number"
            min={1}
            required
            defaultValue={defaults.price6 || ""}
            className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-ring/20"
          />
        </Field>

        <Field label="12-month price (₹/mo)" htmlFor="price12">
          <input
            id="price12"
            name="price12"
            type="number"
            min={1}
            required
            defaultValue={defaults.price12 || ""}
            className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-ring/20"
          />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Deposit (₹)" htmlFor="deposit">
          <input
            id="deposit"
            name="deposit"
            type="number"
            min={0}
            required
            defaultValue={defaults.deposit}
            className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-ring/20"
          />
        </Field>

        <Field label="Rating" htmlFor="rating">
          <input
            id="rating"
            name="rating"
            type="number"
            min={0}
            max={5}
            step={0.1}
            defaultValue={defaults.rating}
            className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-ring/20"
          />
        </Field>

        <Field label="Reviews" htmlFor="reviewCount">
          <input
            id="reviewCount"
            name="reviewCount"
            type="number"
            min={0}
            defaultValue={defaults.reviewCount}
            className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-ring/20"
          />
        </Field>
      </div>

      <label className="flex w-fit items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={defaults.featured}
          className="size-4 rounded border-border accent-brand"
        />
        Featured listing
      </label>

      {error && (
        <p className="rounded-lg bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
          {error}
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand-hover disabled:opacity-60 cursor-pointer"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
