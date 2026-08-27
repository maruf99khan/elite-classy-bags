import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { WishlistButton } from "@/components/wishlist-button";
import { ReviewForm } from "@/components/review-form";
import { ProductCard } from "@/components/product-card";
import { getProduct, getRelatedProducts } from "@/lib/products";
import { formatCurrency } from "@/lib/currency";
import { getReviews } from "@/lib/reviews";
import { isWishlisted } from "@/lib/wishlist";

export async function generateMetadata(props: PageProps<"/shop/[slug]">) {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Elite Classy Bags`,
    description: product.description,
  };
}

const SPEC_LABELS = {
  dimensions: "Dimensions",
  material: "Material",
  strap: "Strap",
  capacity: "Capacity",
} as const;

export default async function ProductPage(props: PageProps<"/shop/[slug]">) {
  const { slug } = await props.params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const [{ reviews, hasReviewed, isLoggedIn }, wishlisted, relatedProducts] =
    await Promise.all([
      getReviews(product.id),
      isWishlisted(product.id),
      getRelatedProducts(product.categorySlug, product.slug),
    ]);
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-border">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-border">
          <Image
            src={product.secondaryImage}
            alt={`${product.name}, detail view`}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-muted">
          {product.category}
        </p>
        <h1 className="mt-2 font-display text-3xl text-foreground">
          {product.name}
        </h1>
        <div className="mt-3 flex items-center gap-3">
          <p className="text-xl font-medium text-foreground">
            {formatCurrency(product.price)}
          </p>
          {avgRating !== null && (
            <span className="text-sm text-muted">
              ★ {avgRating.toFixed(1)} ({reviews.length})
            </span>
          )}
        </div>
        <p className="mt-1 text-xs font-medium">
          {product.stockQuantity > 0 ? (
            <span className="text-green-700">
              In stock ({product.stockQuantity} left)
            </span>
          ) : (
            <span className="text-red-600">Out of stock</span>
          )}
        </p>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
          {product.description}
        </p>

        <dl className="mt-6 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-6 text-sm">
          {(Object.keys(SPEC_LABELS) as Array<keyof typeof SPEC_LABELS>).map(
            (key) => (
              <div key={key}>
                <dt className="text-xs uppercase tracking-wide text-muted">
                  {SPEC_LABELS[key]}
                </dt>
                <dd className="mt-1 text-foreground">{product.specs[key]}</dd>
              </div>
            ),
          )}
        </dl>

        <div className="mt-8 flex max-w-xs items-center gap-3">
          <AddToCartButton product={product} />
          <WishlistButton
            productId={product.id}
            slug={product.slug}
            initialWishlisted={wishlisted}
            loggedIn={isLoggedIn}
          />
        </div>

        <div className="mt-10 max-w-md border-t border-border pt-6">
          <h2 className="font-display text-lg text-foreground">Reviews</h2>

          {reviews.length === 0 && (
            <p className="mt-2 text-sm text-muted">No reviews yet.</p>
          )}
          <ul className="mt-4 flex flex-col gap-4">
            {reviews.map((review) => (
              <li key={review.id} className="border-b border-border pb-4 text-sm">
                <p className="font-medium text-foreground">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                  {review.title && <span className="ml-2">{review.title}</span>}
                </p>
                {review.body && <p className="mt-1 text-muted">{review.body}</p>}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            {isLoggedIn && !hasReviewed && (
              <ReviewForm slug={product.slug} productId={product.id} />
            )}
            {isLoggedIn && hasReviewed && (
              <p className="text-sm text-muted">You&apos;ve already reviewed this product.</p>
            )}
            {!isLoggedIn && (
              <p className="text-sm text-muted">Sign in to leave a review.</p>
            )}
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="sm:col-span-2">
          <h2 className="font-display text-lg text-foreground">You may also like</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
