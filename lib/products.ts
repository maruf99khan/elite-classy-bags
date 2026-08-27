import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";

export interface ProductSpecs {
  dimensions: string;
  material: string;
  strap: string;
  capacity: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  price: number;
  image: string;
  secondaryImage: string;
  description: string;
  specs: ProductSpecs;
  stockQuantity: number;
  featured: boolean;
}

export interface CategoryOption {
  slug: string;
  name: string;
}

export type ProductSort = "featured" | "newest" | "price_asc" | "price_desc";

export interface ProductQuery {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
  page?: number;
}

export interface ProductPage {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

const PAGE_SIZE = 24;
const PRODUCT_SELECT =
  "id, slug, name, price_cents, description, specs, stock_quantity, featured, category:categories(slug, name), product_images(url, alt, position)";
const PRODUCT_SELECT_CATEGORY_FILTERABLE =
  "id, slug, name, price_cents, description, specs, stock_quantity, featured, category:categories!inner(slug, name), product_images(url, alt, position)";

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
  description: string | null;
  specs: Json;
  stock_quantity: number;
  featured: boolean;
  category: { slug: string; name: string } | null;
  product_images: { url: string; alt: string | null; position: number }[];
}

function mapRow(row: ProductRow): Product {
  const images = [...row.product_images].sort((a, b) => a.position - b.position);
  const image = images[0]?.url ?? "";
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category?.name ?? "",
    categorySlug: row.category?.slug ?? "",
    price: row.price_cents / 100,
    image,
    secondaryImage: images[1]?.url ?? image,
    description: row.description ?? "",
    specs: row.specs as unknown as ProductSpecs,
    stockQuantity: row.stock_quantity,
    featured: row.featured,
  };
}

export async function getCategories(): Promise<CategoryOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("slug, name")
    .order("name");
  return data ?? [];
}

export async function getProducts(query: ProductQuery = {}): Promise<ProductPage> {
  const supabase = await createClient();
  const page = Math.max(1, query.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let builder = supabase
    .from("products")
    .select(
      query.category ? PRODUCT_SELECT_CATEGORY_FILTERABLE : PRODUCT_SELECT,
      { count: "exact" },
    );

  if (query.q) builder = builder.ilike("name", `%${query.q}%`);
  if (query.category) builder = builder.eq("category.slug", query.category);
  if (query.minPrice !== undefined) {
    builder = builder.gte("price_cents", Math.round(query.minPrice * 100));
  }
  if (query.maxPrice !== undefined) {
    builder = builder.lte("price_cents", Math.round(query.maxPrice * 100));
  }

  switch (query.sort) {
    case "price_asc":
      builder = builder.order("price_cents", { ascending: true });
      break;
    case "price_desc":
      builder = builder.order("price_cents", { ascending: false });
      break;
    case "newest":
      builder = builder.order("created_at", { ascending: false });
      break;
    default:
      builder = builder
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
  }

  const { data, count } = await builder.range(from, to);

  return {
    products: ((data as ProductRow[] | null) ?? []).map(mapRow),
    total: count ?? 0,
    page,
    pageSize: PAGE_SIZE,
  };
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  return ((data as ProductRow[] | null) ?? []).map(mapRow);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .maybeSingle();
  return data ? mapRow(data as ProductRow) : null;
}

export async function getRelatedProducts(
  categorySlug: string,
  excludeSlug: string,
  limit = 4,
): Promise<Product[]> {
  if (!categorySlug) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT_CATEGORY_FILTERABLE)
    .eq("category.slug", categorySlug)
    .neq("slug", excludeSlug)
    .limit(limit);
  return ((data as ProductRow[] | null) ?? []).map(mapRow);
}
