import { getAdminCustomers, setCustomerRole } from "@/lib/admin-customers";

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-lg text-foreground">
        Customers ({customers.length})
      </h2>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-card text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 text-foreground">{c.fullName}</td>
                <td className="px-4 py-3 capitalize text-muted">{c.role}</td>
                <td className="px-4 py-3 text-right">
                  <form
                    action={setCustomerRole.bind(
                      null,
                      c.id,
                      c.role === "admin" ? "customer" : "admin",
                    )}
                  >
                    <button type="submit" className="text-sm text-accent hover:opacity-80">
                      {c.role === "admin" ? "Revoke admin" : "Promote to admin"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
