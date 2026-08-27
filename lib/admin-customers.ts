"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";

export interface AdminCustomerRow {
  id: string;
  fullName: string;
  role: string;
  createdAt: string;
}

export async function getAdminCustomers(): Promise<AdminCustomerRow[]> {
  await requireAdmin();
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: false });

  return (data ?? []).map((p) => ({
    id: p.id,
    fullName: p.full_name ?? "—",
    role: p.role,
    createdAt: p.created_at,
  }));
}

export async function setCustomerRole(userId: string, role: "admin" | "customer") {
  const admin = await requireAdmin();
  if (userId === admin.id && role !== "admin") {
    throw new Error("You cannot remove your own admin access");
  }
  // profiles has no admin UPDATE policy (only self/admin SELECT), so this
  // needs the service-role client rather than the RLS-scoped one.
  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.from("profiles").update({ role }).eq("id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/customers");
}
