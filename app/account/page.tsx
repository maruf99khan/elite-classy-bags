import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/auth-actions";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const fullName = (user.user_metadata.full_name as string | undefined) ?? user.email;

  return (
    <div className="mx-auto w-full max-w-lg px-6 py-14">
      <h1 className="font-display text-3xl text-foreground">Account</h1>
      <p className="mt-2 text-sm text-muted">{fullName}</p>
      <p className="text-sm text-muted">{user.email}</p>

      <div className="mt-8 flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
        <Link href="/account/orders" className="p-4 text-sm text-foreground hover:bg-background">
          Order history
        </Link>
        <Link href="/account/wishlist" className="p-4 text-sm text-foreground hover:bg-background">
          Wishlist
        </Link>
      </div>

      <form action={signOut} className="mt-8">
        <button
          type="submit"
          className="rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground hover:border-accent"
        >
          Sign out
        </button>
      </form>
    </div>
  );
}
