import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders";
import { markOrderPaid, rejectOrder } from "@/lib/admin-orders";
import { formatCurrency } from "@/lib/currency";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div>
        <h2 className="font-display text-lg text-foreground">{order.orderNumber}</h2>
        <p className="mt-1 text-sm text-muted">
          {order.email} · <span className="capitalize">{order.status}</span>
        </p>
      </div>

      {order.status === "pending" && (
        <div className="flex gap-3">
          <form action={markOrderPaid.bind(null, order.id)}>
            <button
              type="submit"
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground"
            >
              Mark as paid
            </button>
          </form>
          <form action={rejectOrder.bind(null, order.id)}>
            <button
              type="submit"
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-red-600 hover:border-red-600"
            >
              Reject
            </button>
          </form>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">bKash payment</h3>
        <p className="mt-2 text-sm text-muted">
          Sender number: <span className="text-foreground">{order.bkashSenderNumber ?? "—"}</span>
        </p>
        <p className="mt-1 text-sm text-muted">
          Transaction ID: <span className="text-foreground">{order.bkashTrxId ?? "—"}</span>
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground">Shipping</h3>
        <p className="mt-2 text-sm text-muted">
          {order.shippingAddress.name}
          <br />
          {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
          {order.shippingAddress.postalCode}
          <br />
          {order.shippingAddress.country}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground">Items</h3>
        <ul className="mt-2 flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between p-4 text-sm">
              <span className="text-foreground">
                {item.name} × {item.quantity}
              </span>
              <span className="text-foreground">
                {formatCurrency((item.priceCents * item.quantity) / 100)}
              </span>
            </li>
          ))}
          <li className="flex justify-between p-4 text-base font-medium text-foreground">
            <span>Total</span>
            <span>{formatCurrency(order.subtotalCents / 100)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
