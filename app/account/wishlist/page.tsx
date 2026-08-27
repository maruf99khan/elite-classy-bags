import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getWishlist } from "@/lib/wishlist";

export default async function WishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const items = await getWishlist();

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-14">
      <h1 className="font-display text-3xl text-foreground">Wishlist</h1>

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-muted">
          No saved items yet. Tap the heart on any product to save it here.
        </p>
      ) : (
        <ul className="mt-8 flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          {items.map((item) => (
            <li key={item.productId}>
              <Link
                href={`/shop/${item.slug}`}
                className="flex items-center gap-4 p-4 hover:bg-background"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-border">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted">{item.priceFormatted}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
