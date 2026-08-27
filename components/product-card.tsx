"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Product } from "@/lib/products";
import { sanitizeBagImage } from "@/lib/bagImages";
import { formatCurrency } from "@/lib/currency";

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-accent"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-border">
          <Image
            src={sanitizeBagImage(product.image)}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            {product.category}
          </p>
          <p className="font-display text-lg text-foreground">{product.name}</p>
          <p className="mt-auto text-sm font-medium text-foreground">
            {formatCurrency(product.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
