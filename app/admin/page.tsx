import { getDashboardStats } from "@/lib/admin";
import { formatCurrency } from "@/lib/currency";

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Total orders</p>
          <p className="mt-1 font-display text-2xl text-foreground">{stats.orderCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wide text-muted">Revenue (paid orders)</p>
          <p className="mt-1 font-display text-2xl text-foreground">
            {formatCurrency(stats.revenueCents / 100)}
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg text-foreground">Recent orders</h2>
        {stats.recentOrders.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No orders yet.</p>
        ) : (
          <ul className="mt-3 flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
            {stats.recentOrders.map((o) => (
              <li key={o.id} className="flex justify-between p-4 text-sm">
                <span className="text-foreground">
                  {o.orderNumber} · {o.status}
                </span>
                <span className="text-foreground">{formatCurrency(o.subtotalCents / 100)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="font-display text-lg text-foreground">Low stock</h2>
        {stats.lowStockProducts.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Nothing running low.</p>
        ) : (
          <ul className="mt-3 flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
            {stats.lowStockProducts.map((p) => (
              <li key={p.id} className="flex justify-between p-4 text-sm">
                <span className="text-foreground">{p.name}</span>
                <span className="text-red-600">{p.stockQuantity} left</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
