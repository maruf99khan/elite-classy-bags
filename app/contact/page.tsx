import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact — Elite Classy Bags",
  description: "Get in touch with Elite Classy Bags.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl text-foreground">Contact us</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        Questions about an order, materials, or care? Send us a message and
        we will follow up by email.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
