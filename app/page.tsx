import { getFeaturedProducts } from "@/lib/products";
import { HomeHero } from "@/components/home-hero";
import { ProductCard } from "@/components/product-card";
import { BAG_IMAGES } from "@/lib/bagImages";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const featured = await getFeaturedProducts();

  return (
    <div className="flex flex-col">
      <HomeHero />

      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-foreground">
            Best sellers
          </h2>
          <Link
            href="/shop"
            className="text-sm font-medium text-accent hover:opacity-80"
          >
            View all →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 sm:grid-cols-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-border sm:order-2">
            <Image
              src={BAG_IMAGES.leatherMacro}
              alt="Macro detail of hand-finished leather stitching and edge work"
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="sm:order-1">
            <h2 className="font-display text-2xl text-foreground">
              Made to be carried, not just carried around.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              Every piece starts with full-grain leather or heavyweight
              canvas, hand-finished in small batches. We build fewer bags,
              built better, so the one you buy is the one you keep.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block text-sm font-medium text-accent hover:opacity-80"
            >
              Our story →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
