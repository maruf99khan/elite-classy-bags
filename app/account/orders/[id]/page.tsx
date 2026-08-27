import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrderById } from "@/lib/orders";
import { formatCurrency } from "@/lib/currency";

export default async function OrderDetailPage(props: PageProps<"/account/orders/[id]">) {
  const { id } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-14">
      <h1 className="font-display text-2xl text-foreground">Order {order.orderNumber}</h1>
      <p className="mt-1 text-sm text-muted">
        Placed {new Date(order.createdAt).toLocaleDateString()} · status:{" "}
        <span className="font-medium text-foreground">{order.status}</span>
      </p>

      <ul className="mt-6 flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
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

      <div className="mt-6 rounded-2xl border border-border bg-card p-4 text-sm">
        <p className="font-medium text-foreground">Shipping to</p>
        <p className="mt-1 text-muted">
          {order.shippingAddress.name}, {order.shippingAddress.address},{" "}
          {order.shippingAddress.city} {order.shippingAddress.postalCode},{" "}
          {order.shippingAddress.country}
        </p>
      </div>

      {order.bkashTrxId && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-4 text-sm">
          <p className="font-medium text-foreground">bKash payment</p>
          <p className="mt-1 text-muted">
            Sender {order.bkashSenderNumber} · TrxID {order.bkashTrxId}
          </p>
        </div>
      )}
    </div>
  );
}
