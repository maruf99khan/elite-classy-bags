"use server";

import { createClient } from "@/lib/supabase/server";
import { createOrder, type ShippingAddress } from "@/lib/orders";
import type { CartItem } from "@/lib/cart-context";

export async function submitOrder(
  shipping: ShippingAddress,
  items: CartItem[],
  bkashSenderNumber: string,
  bkashTrxId: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return createOrder({
    shipping,
    items,
    bkashSenderNumber,
    bkashTrxId,
    userId: user?.id ?? null,
  });
}
