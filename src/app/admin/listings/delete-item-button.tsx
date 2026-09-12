"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteItemAction } from "./actions";

export function DeleteItemButton({ id, title }: { id: string; title: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-label={`Delete ${title}`}
      disabled={pending}
      onClick={() => {
        if (confirm(`Delete "${title}"? This can't be undone.`)) {
          startTransition(() => {
            deleteItemAction(id);
          });
        }
      }}
      className="flex size-8 items-center justify-center rounded-lg border border-border text-danger transition-colors hover:bg-danger/10 disabled:opacity-50 cursor-pointer"
    >
      <Trash2 className="size-3.5" />
    </button>
  );
}
