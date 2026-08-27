import { createProduct, getAdminCategories } from "@/lib/admin-products";
import { AdminProductForm } from "@/components/admin-product-form";

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-lg text-foreground">New product</h2>
      <AdminProductForm action={createProduct} categories={categories} />
    </div>
  );
}
