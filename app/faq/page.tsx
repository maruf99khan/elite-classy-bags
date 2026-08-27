import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Elite Classy Bags",
  description: "Frequently asked questions about orders, payment, and materials.",
};

const FAQS = [
  {
    q: "How do I pay?",
    a: "We accept bKash. At checkout, send the total to our bKash merchant number via \"Send Money\", then enter your sender number and the Transaction ID (TrxID) from the confirmation SMS. We verify each payment manually before confirming your order.",
  },
  {
    q: "How long does verification take?",
    a: "Most orders are verified within a few hours during business hours (9am–5pm, Sun–Thu). You'll see the order status change from Pending to Paid in your account once confirmed.",
  },
  {
    q: "What if I entered the wrong Transaction ID?",
    a: "Contact us with your order number and we'll help you correct it — see the Contact page.",
  },
  {
    q: "What are your bags made from?",
    a: "Full-grain leather, pebbled leather, or heavyweight canvas depending on the style — each product page lists its exact material under Specs.",
  },
  {
    q: "Do you ship outside Bangladesh?",
    a: "Currently we ship within Bangladesh only. See Shipping & Returns for details.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl text-foreground">
        Frequently asked questions
      </h1>
      <div className="mt-8 flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
        {FAQS.map((item) => (
          <div key={item.q} className="p-5">
            <p className="font-medium text-foreground">{item.q}</p>
            <p className="mt-2 text-sm text-muted">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
