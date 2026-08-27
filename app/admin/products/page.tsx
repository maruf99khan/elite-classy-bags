import Link from "next/link";
import { getAdminProducts, deleteProduct } from "@/lib/admin-products";
import { formatCurrency } from "@/lib/currency";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg text-foreground">
          Products ({products.length})
        </h2>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
        >
          New product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3 text-foreground">
                  {p.name}
                  {p.featured && (
                    <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted">{p.categoryName}</td>
                <td className="px-4 py-3 text-foreground">
                  {formatCurrency(p.priceCents / 100)}
                </td>
                <td
                  className={
                    p.stockQuantity <= 5
                      ? "px-4 py-3 text-red-600"
                      : "px-4 py-3 text-foreground"
                  }
                >
                  {p.stockQuantity}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-sm text-accent hover:opacity-80"
                  >
                    Edit
                  </Link>
                  <form action={deleteProduct.bind(null, p.id)} className="inline">
                    <button
                      type="submit"
                      className="ml-3 text-sm text-red-600 hover:opacity-80"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
