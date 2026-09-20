import { LayoutGrid, LogOut } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { signOutAction } from "@/lib/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/admin/listings" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-brand-foreground font-bold">
              V
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Voko Admin
            </span>
          </Link>

          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-muted sm:inline">
              {session?.user?.email}
            </span>
            <Link href="/" className="text-muted transition-colors hover:text-brand">
              Back to site
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-medium transition-colors hover:bg-surface-muted cursor-pointer"
              >
                <LogOut className="size-3.5" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-6">
        <aside className="w-48 shrink-0">
          <nav className="flex flex-col gap-1 text-sm font-medium">
            <Link
              href="/admin/listings"
              className="flex items-center gap-2 rounded-lg bg-surface-muted px-3 py-2 text-foreground"
            >
              <LayoutGrid className="size-4" />
              Listings
            </Link>
          </nav>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
