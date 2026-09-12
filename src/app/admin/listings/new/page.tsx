import { ItemForm } from "@/components/admin/item-form";
import { createItemAction } from "../actions";

export default function NewListingPage() {
  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight">Add listing</h1>
      <p className="mt-1 text-sm text-muted">
        Create a new rental item in the catalog.
      </p>

      <div className="mt-6 max-w-2xl rounded-2xl border border-border bg-surface p-6">
        <ItemForm action={createItemAction} submitLabel="Create listing" />
      </div>
    </div>
  );
}
