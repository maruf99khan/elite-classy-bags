"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  email: string;
  status: string;
  subtotalCents: number;
  createdAt: string;
}

export async function getAdminOrders(): Promise<AdminOrderRow[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("id, order_number, email, status, subtotal_cents, created_at")
    .order("created_at", { ascending: false });

  return (data ?? []).map((o) => ({
    id: o.id,
    orderNumber: o.order_number,
    email: o.email,
    status: o.status,
    subtotalCents: o.subtotal_cents,
    createdAt: o.created_at,
  }));
}

export async function markOrderPaid(orderId: string) {
  await requireAdmin();
  const supabase = await createClient();

  // Guard the transition atomically so a double form-submit (or resubmitting
  // an already-paid order) can't decrement stock twice: only proceed to the
  // stock loop if this call is the one that actually flipped pending->paid.
  const { data: updated, error: statusError } = await supabase
    .from("orders")
    .update({ status: "paid" })
    .eq("id", orderId)
    .eq("status", "pending")
    .select("id");
  if (statusError) throw new Error(statusError.message);

  if (updated && updated.length > 0) {
    const { data: items } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId);

    for (const item of items ?? []) {
      if (!item.product_id) continue;
      const { data: product } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", item.product_id)
        .maybeSingle();
      if (!product) continue;
      const nextStock = Math.max(0, product.stock_quantity - item.quantity);
      await supabase.from("products").update({ stock_quantity: nextStock }).eq("id", item.product_id);
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
}

export async function rejectOrder(orderId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: "rejected" })
    .eq("id", orderId)
    .eq("status", "pending");
  if (error) throw new Error(error.message);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
}
