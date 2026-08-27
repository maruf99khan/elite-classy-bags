import Link from "next/link";
import type { CategoryOption, ProductSort } from "@/lib/products";

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
];

export function ShopFilters({
  categories,
  activeCategory,
  q,
  minPrice,
  maxPrice,
  sort,
}: {
  categories: CategoryOption[];
  activeCategory?: string;
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
}) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/shop"
          aria-pressed={!activeCategory}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            !activeCategory
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border text-muted hover:text-foreground"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={{ pathname: "/shop", query: { category: c.slug } }}
            aria-pressed={activeCategory === c.slug}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === c.slug
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <form
        method="get"
        action="/shop"
        className="flex flex-wrap items-end gap-3"
      >
        {activeCategory && (
          <input type="hidden" name="category" value={activeCategory} />
        )}
        <label className="flex flex-col gap-1 text-xs text-muted">
          Search
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search bags…"
            className="w-40 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Min price
          <input
            type="number"
            name="min"
            min={0}
            defaultValue={minPrice}
            className="w-24 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Max price
          <input
            type="number"
            name="max"
            min={0}
            defaultValue={maxPrice}
            className="w-24 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted">
          Sort
          <select
            name="sort"
            defaultValue={sort ?? "featured"}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
        >
          Apply
        </button>
      </form>
    </div>
  );
}
