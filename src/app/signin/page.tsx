import { SignInForm } from "@/components/auth/sign-in-form";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-brand-foreground font-bold">
            R
          </span>
          <span className="text-lg font-semibold tracking-tight">Rentro</span>
        </div>

        <h1 className="mt-6 text-xl font-bold tracking-tight">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted">
          Sign in to manage listings.
        </p>

        <div className="mt-6">
          <SignInForm callbackUrl={callbackUrl ?? "/admin/listings"} />
        </div>
      </div>
    </main>
  );
}
