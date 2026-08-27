"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: string;
  isOwn: boolean;
}

export async function getReviews(productId: string) {
  const supabase = await createClient();
  const [{ data: reviews }, { data: userData }] = await Promise.all([
    supabase
      .from("reviews")
      .select("id, rating, title, body, created_at, user_id")
      .eq("product_id", productId)
      .order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);
  const userId = userData.user?.id;

  return {
    reviews: (reviews ?? []).map(
      (r): Review => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        createdAt: r.created_at,
        isOwn: r.user_id === userId,
      }),
    ),
    hasReviewed: (reviews ?? []).some((r) => r.user_id === userId),
    isLoggedIn: !!userId,
  };
}

export async function submitReview(
  slug: string,
  productId: string,
  rating: number,
  title: string,
  body: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sign in to leave a review");

  const { error } = await supabase.from("reviews").insert({
    product_id: productId,
    user_id: user.id,
    rating,
    title: title || null,
    body: body || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/shop/${slug}`);
}
