import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns — Elite Classy Bags",
  description: "Shipping timelines and our return policy.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl text-foreground">Shipping & returns</h1>

      <section className="mt-8">
        <h2 className="font-display text-xl text-foreground">Shipping</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          We currently ship within Bangladesh only. Orders are dispatched once
          your bKash payment is verified, typically within 1–2 business days.
          Delivery takes 2–4 business days inside Dhaka and 4–7 business days
          outside Dhaka via courier.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl text-foreground">Returns & exchanges</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          If a bag arrives damaged or isn't what you ordered, contact us
          within 3 days of delivery with your order number and photos. We'll
          arrange a replacement or refund. Items must be unused, in original
          condition, to qualify.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl text-foreground">Order issues</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          For anything else — a wrong Transaction ID, a delayed delivery, or
          a general question — reach out via the Contact page and we'll get
          back to you.
        </p>
      </section>
    </div>
  );
}
