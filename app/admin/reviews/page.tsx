import { getAdminReviews, deleteReviewAsAdmin } from "@/lib/admin-reviews";

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-display text-lg text-foreground">
        Reviews ({reviews.length})
      </h2>
      {reviews.length === 0 ? (
        <p className="text-sm text-muted">No reviews yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          {reviews.map((r) => (
            <li key={r.id} className="flex items-start justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {r.productName} · {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </p>
                {r.title && <p className="mt-1 text-sm text-foreground">{r.title}</p>}
                {r.body && <p className="mt-1 text-sm text-muted">{r.body}</p>}
              </div>
              <form action={deleteReviewAsAdmin.bind(null, r.id)}>
                <button type="submit" className="shrink-0 text-sm text-red-600 hover:opacity-80">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
