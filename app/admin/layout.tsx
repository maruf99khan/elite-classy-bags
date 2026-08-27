import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <h1 className="font-display text-2xl text-foreground">Admin</h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}
