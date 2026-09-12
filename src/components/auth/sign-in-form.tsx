"use client";

import { useActionState } from "react";
import { signInAction } from "@/app/signin/actions";

export function SignInForm({ callbackUrl }: { callbackUrl: string }) {
  const [error, formAction, pending] = useActionState(
    signInAction,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-ring/20"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none placeholder:text-muted focus:border-brand focus:ring-2 focus:ring-ring/20"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-danger/10 px-3.5 py-2.5 text-sm text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-full bg-brand py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition-colors hover:bg-brand-hover disabled:opacity-60 cursor-pointer"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
