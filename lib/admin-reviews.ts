"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";

export interface AdminReviewRow {
  id: string;
  productName: string;
  productSlug: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: string;
}

export async function getAdminReviews(): Promise<AdminReviewRow[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, rating, title, body, created_at, product:products(name, slug)")
    .order("created_at", { ascending: false });

  return (data ?? []).map((r) => ({
    id: r.id,
    productName: (r.product as { name: string; slug: string } | null)?.name ?? "—",
    productSlug: (r.product as { name: string; slug: string } | null)?.slug ?? "",
    rating: r.rating,
    title: r.title,
    body: r.body,
    createdAt: r.created_at,
  }));
}

export async function deleteReviewAsAdmin(reviewId: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
}
