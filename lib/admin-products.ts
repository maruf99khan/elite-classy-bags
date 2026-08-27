"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin";

export interface AdminProductRow {
  id: string;
  slug: string;
  name: string;
  categoryName: string;
  priceCents: number;
  stockQuantity: number;
  featured: boolean;
}

export async function getAdminProducts(): Promise<AdminProductRow[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, price_cents, stock_quantity, featured, category:categories(name)")
    .order("created_at", { ascending: false });

  return (data ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    categoryName: (p.category as { name: string } | null)?.name ?? "—",
    priceCents: p.price_cents,
    stockQuantity: p.stock_quantity,
    featured: p.featured,
  }));
}

export interface AdminProductDetail {
  id: string;
  slug: string;
  name: string;
  categoryId: string | null;
  priceCents: number;
  description: string;
  imageUrl: string;
  stockQuantity: number;
  featured: boolean;
  specs: { dimensions: string; material: string; strap: string; capacity: string };
}

export async function getAdminProduct(id: string): Promise<AdminProductDetail | null> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(
      "id, slug, name, price_cents, description, specs, stock_quantity, featured, category_id, product_images(url, position)",
    )
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;

  const images = [...(data.product_images ?? [])].sort((a, b) => a.position - b.position);
  const specs = (data.specs ?? {}) as Partial<AdminProductDetail["specs"]>;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    categoryId: data.category_id,
    priceCents: data.price_cents,
    description: data.description ?? "",
    imageUrl: images[0]?.url ?? "",
    stockQuantity: data.stock_quantity,
    featured: data.featured,
    specs: {
      dimensions: specs.dimensions ?? "",
      material: specs.material ?? "",
      strap: specs.strap ?? "",
      capacity: specs.capacity ?? "",
    },
  };
}

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("id, slug, name").order("name");
  return data ?? [];
}

function slugifyName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function readProductForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "") || null;
  const priceBdt = Number(formData.get("price") ?? 0);
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("imageUrl") ?? "").trim();
  const stockQuantity = Math.max(0, Number(formData.get("stockQuantity") ?? 0));
  const featured = formData.get("featured") === "on";
  const specs = {
    dimensions: String(formData.get("dimensions") ?? "").trim(),
    material: String(formData.get("material") ?? "").trim(),
    strap: String(formData.get("strap") ?? "").trim(),
    capacity: String(formData.get("capacity") ?? "").trim(),
  };
  return { name, categoryId, priceBdt, description, imageUrl, stockQuantity, featured, specs };
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const { name, categoryId, priceBdt, description, imageUrl, stockQuantity, featured, specs } =
    readProductForm(formData);
  if (!name || !priceBdt) throw new Error("Name and price are required");

  const slug = slugifyName(name);
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      slug,
      name,
      category_id: categoryId,
      price_cents: Math.round(priceBdt * 100),
      description,
      specs,
      stock_quantity: stockQuantity,
      featured,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  if (imageUrl) {
    await supabase.from("product_images").insert([
      { product_id: product.id, url: imageUrl, alt: name, position: 0 },
      { product_id: product.id, url: imageUrl, alt: name, position: 1 },
    ]);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const { name, categoryId, priceBdt, description, imageUrl, stockQuantity, featured, specs } =
    readProductForm(formData);
  if (!name || !priceBdt) throw new Error("Name and price are required");

  const { error } = await supabase
    .from("products")
    .update({
      name,
      category_id: categoryId,
      price_cents: Math.round(priceBdt * 100),
      description,
      specs,
      stock_quantity: stockQuantity,
      featured,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  if (imageUrl) {
    const { data: images } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", id)
      .order("position");
    if (images && images.length > 0) {
      await supabase.from("product_images").update({ url: imageUrl }).eq("product_id", id);
    } else {
      await supabase.from("product_images").insert([
        { product_id: id, url: imageUrl, alt: name, position: 0 },
        { product_id: id, url: imageUrl, alt: name, position: 1 },
      ]);
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required");
  const slug = slugifyName(name);
  const { error } = await supabase.from("categories").insert({ slug, name });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
}
