"use client";

import { useTransition } from "react";
import { toggleItemActiveAction } from "./actions";

export function ActiveToggle({
  id,
  title,
  active,
}: {
  id: string;
  title: string;
  active: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={`${active ? "Deactivate" : "Activate"} ${title}`}
      disabled={pending}
      onClick={() => startTransition(() => toggleItemActiveAction(id, !active))}
      className={`relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50 cursor-pointer ${
        active ? "bg-brand" : "bg-surface-muted border border-border"
      }`}
    >
      <span
        className={`absolute size-4 rounded-full bg-white shadow-sm transition-transform ${
          active ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
