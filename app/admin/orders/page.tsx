import Link from "next/link";
import { getAdminOrders } from "@/lib/admin-orders";
import { formatCurrency } from "@/lib/currency";

const STATUS_COLOR: Record<string, string> = {
  pending: "text-amber-600",
  paid: "text-green-600",
  rejected: "text-red-600",
};

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-lg text-foreground">
        Orders ({orders.length})
      </h2>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3 text-foreground">{o.orderNumber}</td>
                <td className="px-4 py-3 text-muted">{o.email}</td>
                <td className={`px-4 py-3 capitalize ${STATUS_COLOR[o.status] ?? "text-foreground"}`}>
                  {o.status}
                </td>
                <td className="px-4 py-3 text-foreground">
                  {formatCurrency(o.subtotalCents / 100)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="text-sm text-accent hover:opacity-80"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
