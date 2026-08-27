"use client";

import { useState, useTransition } from "react";
import { toggleWishlist } from "@/lib/wishlist";

export function WishlistButton({
  productId,
  slug,
  initialWishlisted,
  loggedIn,
}: {
  productId: string;
  slug: string;
  initialWishlisted: boolean;
  loggedIn: boolean;
}) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-pressed={wishlisted}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      disabled={pending}
      onClick={() => {
        if (!loggedIn) return;
        setWishlisted((w) => !w);
        startTransition(async () => {
          try {
            await toggleWishlist(productId, slug);
          } catch {
            setWishlisted((w) => !w);
          }
        });
      }}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent disabled:opacity-60"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill={wishlisted ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.5}
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20.25c-.3 0-.6-.1-.85-.28C7.2 17.3 3 13.9 3 9.9 3 7.2 5.1 5 7.7 5c1.4 0 2.75.65 3.6 1.7.85-1.05 2.2-1.7 3.6-1.7C17.5 5 19.6 7.2 19.6 9.9c0 4-4.2 7.4-8.15 10.07-.25.18-.55.28-.85.28Z"
        />
      </svg>
    </button>
  );
}
