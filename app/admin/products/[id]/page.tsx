import { notFound } from "next/navigation";
import { getAdminProduct, getAdminCategories, updateProduct } from "@/lib/admin-products";
import { AdminProductForm } from "@/components/admin-product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProduct(id),
    getAdminCategories(),
  ]);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-lg text-foreground">Edit {product.name}</h2>
      <AdminProductForm
        action={updateProduct.bind(null, id)}
        categories={categories}
        product={product}
      />
    </div>
  );
}
