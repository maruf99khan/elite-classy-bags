"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/products";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  if (product.stockQuantity <= 0) {
    return (
      <button
        type="button"
        disabled
        className="w-full rounded-full border border-border px-6 py-3 text-sm font-semibold text-muted"
      >
        Out of stock
      </button>
    );
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      onClick={() => {
        addItem(product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1500);
      }}
      className="relative w-full overflow-hidden rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={added ? "added" : "idle"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
          className="block"
        >
          {added ? "Added to cart" : "Add to cart"}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
