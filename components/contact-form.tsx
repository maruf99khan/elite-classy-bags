"use client";

import { useState, type FormEvent } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="rounded-xl border border-border bg-card p-6 text-sm text-foreground">
        Thanks for reaching out — we will get back to you within 1–2
        business days.
      </p>
    );
  }

  return (
    <form
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSent(true);
      }}
      className="flex flex-col gap-4"
    >
      <label className="flex flex-col gap-1 text-sm text-foreground">
        Name
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
      <label className="flex flex-col gap-1 text-sm text-foreground">
        Message
        <textarea
          required
          aria-required="true"
          name="message"
          rows={5}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </label>
      <button
        type="submit"
        className="w-fit rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
      >
        Send message
      </button>
    </form>
  );
}
