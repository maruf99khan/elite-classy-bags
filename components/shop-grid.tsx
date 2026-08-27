import { ProductCard } from "@/components/product-card";
import { StaggerGrid } from "@/components/stagger-grid";
import type { Product } from "@/lib/products";

export function ShopGrid({
  products,
  gridKey,
}: {
  products: Product[];
  gridKey: string;
}) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted">
        No bags match those filters.
      </p>
    );
  }

  return (
    <StaggerGrid
      gridKey={gridKey}
      className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
    >
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} />
      ))}
    </StaggerGrid>
  );
}
