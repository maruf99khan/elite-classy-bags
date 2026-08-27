"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/currency";
import type { Product } from "@/lib/products";

export async function isWishlisted(productId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();
  return !!data;
}

export async function toggleWishlist(productId: string, slug: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in to save items to your wishlist");

  const { data: existing } = await supabase
    .from("wishlists")
    .select("product_id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);
  } else {
    await supabase.from("wishlists").insert({ user_id: user.id, product_id: productId });
  }

  revalidatePath(`/shop/${slug}`);
  revalidatePath("/account/wishlist");
  return !existing;
}

export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  priceFormatted: string;
}

export async function getWishlist(): Promise<WishlistItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("wishlists")
    .select(
      "product_id, products(slug, name, price_cents, product_images(url, position))",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data ?? []).flatMap((row) => {
    const product = row.products as unknown as
      | (Pick<Product, "slug" | "name"> & {
          price_cents: number;
          product_images: { url: string; position: number }[];
        })
      | null;
    if (!product) return [];
    const images = [...product.product_images].sort((a, b) => a.position - b.position);
    const price = product.price_cents / 100;
    return [
      {
        productId: row.product_id,
        slug: product.slug,
        name: product.name,
        image: images[0]?.url ?? "",
        price,
        priceFormatted: formatCurrency(price),
      },
    ];
  });
}
