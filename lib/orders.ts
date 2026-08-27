import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/lib/cart-context";

export interface ShippingAddress {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderInput {
  shipping: ShippingAddress;
  items: CartItem[];
  bkashSenderNumber: string;
  bkashTrxId: string;
  userId: string | null;
}

export interface CreateOrderResult {
  orderNumber: string;
}

function generateOrderNumber() {
  return `ECB-${Date.now().toString(36).toUpperCase()}`;
}

export async function createOrder({
  shipping,
  items,
  bkashSenderNumber,
  bkashTrxId,
  userId,
}: CreateOrderInput): Promise<CreateOrderResult> {
  if (items.length === 0) throw new Error("Cannot place an order with an empty cart");

  const admin = createAdminClient();

  // Cart data comes from the client (localStorage) and is never trusted for
  // price/name/quantity — re-look-up each product server-side so a tampered
  // cart can't forge prices or abuse stock decrement with a negative quantity.
  const productIds = [...new Set(items.map((item) => item.id))].filter(Boolean);
  const { data: products, error: productsError } = await admin
    .from("products")
    .select("id, name, price_cents")
    .in("id", productIds);
  if (productsError) throw productsError;

  const productById = new Map((products ?? []).map((p) => [p.id, p]));

  const validatedItems = items
    .map((item) => {
      const product = productById.get(item.id);
      const quantity = Math.floor(item.quantity);
      if (!product || !Number.isFinite(quantity) || quantity <= 0) return null;
      return {
        productId: product.id,
        name: product.name,
        priceCents: product.price_cents,
        quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (validatedItems.length === 0) {
    throw new Error("Cannot place an order with an empty cart");
  }

  const subtotalCents = validatedItems.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0,
  );
  const orderNumber = generateOrderNumber();

  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: userId,
      order_number: orderNumber,
      email: shipping.email,
      shipping_address: shipping as unknown as Record<string, string>,
      subtotal_cents: subtotalCents,
      status: "pending",
      payment_method: "bkash",
      bkash_sender_number: bkashSenderNumber,
      bkash_trx_id: bkashTrxId,
    })
    .select("id")
    .single();

  if (orderError) throw orderError;

  const { error: itemsError } = await admin.from("order_items").insert(
    validatedItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      name_snapshot: item.name,
      price_cents_snapshot: item.priceCents,
      quantity: item.quantity,
    })),
  );

  if (itemsError) throw itemsError;

  return { orderNumber };
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  subtotalCents: number;
  createdAt: string;
}

export async function getOrdersForUser(): Promise<OrderSummary[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("orders")
    .select("id, order_number, status, subtotal_cents, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data ?? []).map((o) => ({
    id: o.id,
    orderNumber: o.order_number,
    status: o.status,
    subtotalCents: o.subtotal_cents,
    createdAt: o.created_at,
  }));
}

export interface OrderDetail extends OrderSummary {
  email: string;
  shippingAddress: ShippingAddress;
  bkashSenderNumber: string | null;
  bkashTrxId: string | null;
  items: { name: string; priceCents: number; quantity: number }[];
}

export async function getOrderById(id: string): Promise<OrderDetail | null> {
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select(
      "id, order_number, status, subtotal_cents, created_at, email, shipping_address, bkash_sender_number, bkash_trx_id",
    )
    .eq("id", id)
    .maybeSingle();
  if (!order) return null;

  const { data: items } = await supabase
    .from("order_items")
    .select("name_snapshot, price_cents_snapshot, quantity")
    .eq("order_id", id);

  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    subtotalCents: order.subtotal_cents,
    createdAt: order.created_at,
    email: order.email,
    shippingAddress: order.shipping_address as unknown as ShippingAddress,
    bkashSenderNumber: order.bkash_sender_number,
    bkashTrxId: order.bkash_trx_id,
    items: (items ?? []).map((i) => ({
      name: i.name_snapshot,
      priceCents: i.price_cents_snapshot,
      quantity: i.quantity,
    })),
  };
}
