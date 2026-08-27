import type { AdminCategory, AdminProductDetail } from "@/lib/admin-products";

export function AdminProductForm({
  action,
  categories,
  product,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: AdminCategory[];
  product?: AdminProductDetail;
}) {
  return (
    <form action={action} className="flex max-w-2xl flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-foreground">
        Name
        <input
          required
          name="name"
          defaultValue={product?.name}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-foreground">
          Category
          <select
            name="categoryId"
            defaultValue={product?.categoryId ?? ""}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-foreground">
          Price (BDT)
          <input
            required
            type="number"
            min="0"
            step="1"
            name="price"
            defaultValue={product ? product.priceCents / 100 : undefined}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-foreground">
        Description
        <textarea
          name="description"
          rows={3}
          defaultValue={product?.description}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-foreground">
        Image URL
        <input
          name="imageUrl"
          placeholder="https://images.unsplash.com/..."
          defaultValue={product?.imageUrl}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-foreground">
          Stock quantity
          <input
            type="number"
            min="0"
            name="stockQuantity"
            defaultValue={product?.stockQuantity ?? 0}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
        <label className="mt-6 flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured}
            className="h-4 w-4"
          />
          Featured
        </label>
      </div>

      <fieldset className="grid gap-4 rounded-lg border border-border p-4 sm:grid-cols-2">
        <legend className="px-1 text-xs uppercase tracking-wide text-muted">
          Specs
        </legend>
        <label className="flex flex-col gap-1 text-sm text-foreground">
          Dimensions
          <input
            name="dimensions"
            defaultValue={product?.specs.dimensions}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-foreground">
          Material
          <input
            name="material"
            defaultValue={product?.specs.material}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-foreground">
          Strap
          <input
            name="strap"
            defaultValue={product?.specs.strap}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-foreground">
          Capacity
          <input
            name="capacity"
            defaultValue={product?.specs.capacity}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>
      </fieldset>

      <button
        type="submit"
        className="mt-2 w-fit rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
      >
        {product ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
