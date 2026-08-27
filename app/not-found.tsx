import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col items-center px-6 py-24 text-center">
      <p className="font-display text-6xl text-foreground">404</p>
      <h1 className="mt-4 font-display text-2xl text-foreground">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-2 text-sm text-muted">
        The bag or page you're looking for may have moved or sold out.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
      >
        Shop the collection
      </Link>
    </div>
  );
}
