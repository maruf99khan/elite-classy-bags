import type { Metadata } from "next";
import Link from "next/link";
import { ShopGrid } from "@/components/shop-grid";
import { ShopFilters } from "@/components/shop-filters";
import { getCategories, getProducts, type ProductSort } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop — Elite Classy Bags",
  description: "Browse totes, crossbodies, clutches, and backpacks.",
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function toNumber(value: string | undefined) {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const q = first(params.q);
  const category = first(params.category);
  const minPrice = toNumber(first(params.min));
  const maxPrice = toNumber(first(params.max));
  const sort = first(params.sort) as ProductSort | undefined;
  const page = toNumber(first(params.page)) ?? 1;

  const [categories, { products, total, pageSize }] = await Promise.all([
    getCategories(),
    getProducts({ q, category, minPrice, maxPrice, sort, page }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const gridKey = `${category ?? "all"}-${sort ?? "featured"}-${q ?? ""}-${page}`;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-14">
      <h1 className="font-display text-3xl text-foreground">Shop all bags</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        {total} piece{total === 1 ? "" : "s"}, made in small batches from
        full-grain leather and heavyweight canvas.
      </p>

      <ShopFilters
        categories={categories}
        activeCategory={category}
        q={q}
        minPrice={minPrice}
        maxPrice={maxPrice}
        sort={sort}
      />

      <div className="mt-8">
        <ShopGrid products={products} gridKey={gridKey} />
      </div>

      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="mt-10 flex items-center justify-center gap-2"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={{ pathname: "/shop", query: { ...params, page: p } }}
              aria-current={p === page ? "page" : undefined}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                p === page
                  ? "bg-accent text-accent-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {p}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
