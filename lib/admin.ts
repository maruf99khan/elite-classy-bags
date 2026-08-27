import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") redirect("/");

  return user;
}

export interface DashboardStats {
  orderCount: number;
  revenueCents: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    subtotalCents: number;
    createdAt: string;
  }[];
  lowStockProducts: { id: string; name: string; stockQuantity: number }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const [{ count: orderCount }, { data: paidOrders }, { data: recentOrders }, { data: lowStock }] =
    await Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("subtotal_cents").eq("status", "paid"),
      supabase
        .from("orders")
        .select("id, order_number, status, subtotal_cents, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("products")
        .select("id, name, stock_quantity")
        .lte("stock_quantity", 5)
        .order("stock_quantity", { ascending: true }),
    ]);

  return {
    orderCount: orderCount ?? 0,
    revenueCents: (paidOrders ?? []).reduce((sum, o) => sum + o.subtotal_cents, 0),
    recentOrders: (recentOrders ?? []).map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      status: o.status,
      subtotalCents: o.subtotal_cents,
      createdAt: o.created_at,
    })),
    lowStockProducts: (lowStock ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      stockQuantity: p.stock_quantity,
    })),
  };
}
