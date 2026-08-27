"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "motion/react";
import { animate, spring } from "animejs";
import { useCart } from "@/lib/cart-context";
import { signInWithGoogle, signOut } from "@/lib/auth-actions";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header({ user }: { user: User | null }) {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const cartIconRef = useRef<HTMLAnchorElement>(null);
  const previousCount = useRef(count);
  const fullName = (user?.user_metadata.full_name as string | undefined) ?? user?.email;
  const avatarUrl = user?.user_metadata.avatar_url as string | undefined;

  useEffect(() => {
    if (count > previousCount.current && cartIconRef.current) {
      animate(cartIconRef.current, {
        scale: [1, 1.2, 1],
        duration: 420,
        ease: spring({ stiffness: 300, damping: 12 }),
      });
    }
    previousCount.current = count;
  }, [count]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-display text-xl tracking-tight text-foreground"
        >
          Elite Classy Bags
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent sm:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
                />
              )}
            </svg>
          </button>

          <Link
            ref={cartIconRef}
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3.75h1.5l1.5 12.75h10.5l1.5-9h-13"
              />
              <circle cx="9" cy="20" r="1" />
              <circle cx="16.5" cy="20" r="1" />
            </svg>
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-accent-foreground"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {user ? (
            <div className="relative">
              <button
                type="button"
                aria-label="Account menu"
                aria-expanded={accountOpen}
                onClick={() => setAccountOpen((open) => !open)}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border text-foreground transition-colors hover:border-accent"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-sm font-semibold uppercase">
                    {fullName?.charAt(0) ?? "?"}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 z-50 flex w-48 flex-col overflow-hidden rounded-xl border border-border bg-background text-sm shadow-lg"
                  >
                    <p className="truncate border-b border-border px-4 py-3 text-xs text-muted">
                      {fullName}
                    </p>
                    <Link
                      href="/account"
                      onClick={() => setAccountOpen(false)}
                      className="px-4 py-3 text-foreground hover:bg-card"
                    >
                      Account
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setAccountOpen(false)}
                      className="px-4 py-3 text-foreground hover:bg-card"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/account/wishlist"
                      onClick={() => setAccountOpen(false)}
                      className="px-4 py-3 text-foreground hover:bg-card"
                    >
                      Wishlist
                    </Link>
                    <form action={signOut}>
                      <button
                        type="submit"
                        className="w-full px-4 py-3 text-left text-foreground hover:bg-card"
                      >
                        Sign out
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <form action={signInWithGoogle}>
              <button
                type="submit"
                className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors hover:border-accent"
              >
                Sign in
              </button>
            </form>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex flex-col gap-1 overflow-hidden border-t border-border px-6 text-sm font-medium text-muted sm:hidden"
          >
            <div className="flex flex-col gap-1 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-11 items-center rounded-lg px-2 transition-colors hover:bg-card hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
