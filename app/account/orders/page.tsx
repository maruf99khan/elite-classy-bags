import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrdersForUser } from "@/lib/orders";
import { formatCurrency } from "@/lib/currency";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const orders = await getOrdersForUser();

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-14">
      <h1 className="font-display text-3xl text-foreground">Order history</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-sm text-muted">You haven&apos;t placed any orders yet.</p>
      ) : (
        <ul className="mt-8 flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between p-4 text-sm hover:bg-background"
              >
                <div>
                  <p className="font-medium text-foreground">{order.orderNumber}</p>
                  <p className="text-xs text-muted">
                    {new Date(order.createdAt).toLocaleDateString()} · {order.status}
                  </p>
                </div>
                <span className="font-medium text-foreground">
                  {formatCurrency(order.subtotalCents / 100)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
