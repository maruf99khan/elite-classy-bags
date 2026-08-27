"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "@/lib/cart-context";
import { formatCurrency } from "@/lib/currency";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-20 text-center">
        <h1 className="font-display text-2xl text-foreground">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm text-muted">
          Find something worth carrying.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
        >
          Shop the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-6 py-14">
      <h1 className="font-display text-3xl text-foreground">Your cart</h1>

      <ul className="mt-8 flex flex-col divide-y divide-border border-y border-border">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.li
              key={item.slug}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="flex items-center gap-4 py-5"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-border">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-sm text-muted">{formatCurrency(item.price)}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={`Decrease quantity of ${item.name}`}
                  onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground hover:border-accent"
                >
                  −
                </button>
                <span
                  aria-live="polite"
                  className="w-6 text-center text-sm text-foreground"
                >
                  {item.quantity}
                </span>
                <button
                  type="button"
                  aria-label={`Increase quantity of ${item.name}`}
                  onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground hover:border-accent"
                >
                  +
                </button>
              </div>

              <p className="w-20 text-right font-medium text-foreground">
                {formatCurrency(item.price * item.quantity)}
              </p>

              <button
                type="button"
                aria-label={`Remove ${item.name} from cart`}
                onClick={() => removeItem(item.slug)}
                className="text-sm text-muted hover:text-foreground"
              >
                Remove
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="mt-8 flex flex-col items-end gap-4">
        <div className="flex w-full max-w-xs justify-between text-base font-medium text-foreground sm:w-auto">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <Link
          href="/checkout"
          className="inline-flex rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
