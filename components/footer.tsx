import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg text-foreground">Elite Classy Bags</p>
          <p className="mt-3 max-w-xs text-sm text-muted">
            Considered leather goods for everyday carry, made to be lived in
            and to last.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">Shop</p>
          <nav className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <Link href="/shop" className="transition-colors hover:text-foreground">
              All bags
            </Link>
            <Link href="/about" className="transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">
              Contact
            </Link>
            <Link href="/faq" className="transition-colors hover:text-foreground">
              FAQ
            </Link>
            <Link href="/shipping-returns" className="transition-colors hover:text-foreground">
              Shipping & returns
            </Link>
          </nav>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">Contact</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
            <a
              href="mailto:hello@eliteclassybags.example"
              className="transition-colors hover:text-foreground"
            >
              hello@eliteclassybags.example
            </a>
            <p>Mon–Fri, 9am–5pm</p>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-6 py-6 text-center text-xs text-muted">
        © {year} Elite Classy Bags. All rights reserved.
      </div>
    </footer>
  );
}
