"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useCart, type CartItem } from "@/lib/cart-context";
import { OrderConfirmedCheck } from "@/components/order-confirmed-check";
import { submitOrder } from "@/app/checkout/actions";
import { formatCurrency } from "@/lib/currency";

const BKASH_MERCHANT_NUMBER =
  process.env.NEXT_PUBLIC_BKASH_MERCHANT_NUMBER ?? "";

interface ConfirmedOrder {
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const shipping = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      address: String(form.get("address") ?? ""),
      city: String(form.get("city") ?? ""),
      postalCode: String(form.get("postalCode") ?? ""),
      country: String(form.get("country") ?? ""),
    };
    const bkashSenderNumber = String(form.get("bkashSenderNumber") ?? "");
    const bkashTrxId = String(form.get("bkashTrxId") ?? "");

    setSubmitting(true);
    try {
      const { orderNumber } = await submitOrder(
        shipping,
        items,
        bkashSenderNumber,
        bkashTrxId,
      );
      setConfirmedOrder({ orderNumber, items, subtotal });
      clear();
    } catch {
      setError("Something went wrong placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mx-auto flex w-full max-w-xl flex-col items-center px-6 py-24 text-center"
      >
        <OrderConfirmedCheck />
        <h1 className="mt-4 font-display text-3xl text-foreground">
          Order received
        </h1>
        <p className="mt-2 text-sm text-muted">
          Order <span className="font-medium text-foreground">
            {confirmedOrder.orderNumber}
          </span>{" "}
          — we&apos;re verifying your bKash payment and will confirm shortly.
        </p>

        <ul className="mt-8 flex w-full flex-col divide-y divide-border rounded-2xl border border-border bg-card text-left">
          {confirmedOrder.items.map((item) => (
            <li key={item.slug} className="flex items-center gap-3 p-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-border">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <span className="flex-1 text-sm text-muted">
                {item.name} × {item.quantity}
              </span>
              <span className="text-sm text-foreground">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </li>
          ))}
          <li className="flex justify-between p-4 text-base font-medium text-foreground">
            <span>Total</span>
            <span>{formatCurrency(confirmedOrder.subtotal)}</span>
          </li>
        </ul>

        <p className="mt-6 max-w-sm text-xs text-muted">
          Keep your Transaction ID handy in case we need to reach out about
          your payment.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground"
        >
          Continue shopping
        </Link>
      </motion.div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-6 py-24 text-center">
        <h1 className="font-display text-2xl text-foreground">
          Your cart is empty
        </h1>
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
    <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-14 sm:grid-cols-[1.4fr_1fr]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <h1 className="font-display text-2xl text-foreground">Checkout</h1>
          <p className="mt-1 text-xs text-muted">
            Pay with bKash, then submit your Transaction ID below.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-foreground">
            Full name
            <input
              required
              aria-required="true"
              name="name"
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-foreground">
            Email
            <input
              required
              aria-required="true"
              type="email"
              name="email"
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm text-foreground">
          Shipping address
          <input
            required
            aria-required="true"
            name="address"
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm text-foreground">
            City
            <input
              required
              aria-required="true"
              name="city"
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-foreground">
            Postal code
            <input
              required
              aria-required="true"
              name="postalCode"
              placeholder="e.g. 10001"
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none placeholder:text-muted/60 focus:border-accent"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-foreground">
            Country
            <input
              required
              aria-required="true"
              name="country"
              placeholder="e.g. United States"
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none placeholder:text-muted/60 focus:border-accent"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="font-display text-base text-foreground">
            Pay with bKash
          </h2>
          <p className="mt-1 text-sm text-muted">
            Send{" "}
            <span className="font-medium text-foreground">
              {formatCurrency(subtotal)}
            </span>{" "}
            via bKash &ldquo;Send Money&rdquo; to{" "}
            <span className="font-medium text-foreground">
              {BKASH_MERCHANT_NUMBER || "our bKash number"}
            </span>
            , then enter the Transaction ID from the confirmation SMS below.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm text-foreground">
              Your bKash number
              <input
                required
                aria-required="true"
                name="bkashSenderNumber"
                placeholder="01XXXXXXXXX"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-foreground">
              Transaction ID (TrxID)
              <input
                required
                aria-required="true"
                name="bkashTrxId"
                placeholder="e.g. 8N7A6B5C4D"
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-3 w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Placing order…" : `Place order — ${formatCurrency(subtotal)}`}
        </button>
      </form>

      <div className="h-fit rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg text-foreground">Order summary</h2>
        <ul className="mt-4 flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.slug} className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-border">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <span className="flex-1 text-sm text-muted">
                {item.name} × {item.quantity}
              </span>
              <span className="text-sm text-foreground">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4 text-base font-medium text-foreground">
          <span>Total</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
      </div>
    </div>
  );
}
