# Elite Classy Bags — Full E-Commerce Platform Plan

Supersedes `docs/plan/site-rebuild.md` (complete — static 7-page storefront with
placeholder data, animations, and the P1–P3 accessibility/UX audit fixes already
shipped). This plan turns that static demo into a real, production e-commerce
business: persistent data, real accounts, real payments, and store operations.

Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 (existing),
Supabase (Postgres + Auth + Storage), Stripe (payments).

## Guiding decisions (locked in during brainstorming)

- **Backend**: Supabase — already connected in this environment, gives Postgres +
  Auth + Storage + Row Level Security in one service. No separate ORM/ auth stack.
- **Auth**: Google OAuth only, via Supabase Auth. No password flows to build or
  secure. A `profiles` row auto-creates on first login via a Postgres trigger.
- **Cart**: stays client-side (localStorage), unchanged from today. Not synced to
  a DB table — guest→login cart merging isn't worth solving at this catalog size.
- **Checkout/payments**: Stripe Checkout Sessions, in Stripe test mode for v1.
  Switching to live mode later is an API-key change, not a code change.
- **Admin access**: no self-serve admin signup. The first admin (store owner) gets
  `profiles.role = 'admin'` set directly in Supabase after their first Google
  login; after that, additional admins are promoted from within `/admin/customers`.
- **Admin v1 scope**: core store management only (products, categories, orders,
  customers, review moderation, basic dashboard). Coupons and analytics are v2.
- **Images**: continue using online placeholder images (as today) until real
  product photography exists. The admin panel's product-image upload (Supabase
  Storage) is what real photos get added through, whenever they're supplied.

## Data model (Postgres via Supabase)

| Table | Key columns | Notes |
|---|---|---|
| `profiles` | `id` (=`auth.users.id`), `full_name`, `avatar_url`, `role` (`customer` \| `admin`, default `customer`) | Auto-created by trigger on `auth.users` insert |
| `categories` | `id`, `slug`, `name` | |
| `products` | `id`, `slug`, `name`, `category_id`, `price_cents`, `description`, `specs` (jsonb), `stock_quantity`, `featured`, `created_at` | Replaces the static array in `lib/products.ts` |
| `product_images` | `id`, `product_id`, `url`, `alt`, `position` | Ordered gallery; supports today's primary+secondary image pattern and more |
| `reviews` | `id`, `product_id`, `user_id`, `rating` (1–5), `title`, `body`, `created_at` | Unique on `(product_id, user_id)` — one review per customer per product |
| `wishlists` | `user_id`, `product_id`, `created_at` | Composite PK |
| `orders` | `id`, `user_id` (nullable), `order_number`, `email`, `shipping_address` (jsonb), `subtotal_cents`, `status`, `stripe_session_id`, `created_at` | `status`: `pending` → `paid` → `shipped` → `delivered`, or `cancelled`/`refunded` |
| `order_items` | `id`, `order_id`, `product_id`, `name_snapshot`, `price_cents_snapshot`, `quantity` | Snapshots protect order history if a product is later edited/deleted |

**RLS**: `products`/`categories`/`reviews` are public-read. `orders`, `wishlists`,
and review-writes are restricted to `auth.uid()` matching the row's owner.
Admin-only writes (products, categories, order status, review deletes) are
gated by a `is_admin()` Postgres function checking `profiles.role`.

## Auth & authorization flow

1. Header shows "Sign in" when logged out → Supabase Google OAuth redirect →
   back to the originating page, now with a session.
2. Logged-in header shows an avatar menu: Account · Orders · Wishlist · Sign out.
3. Browsing, cart, and checkout all work fully signed-out (guest checkout).
   Wishlist and "write a review" prompt sign-in only when clicked — no forced
   login wall on the shopping flow.
4. `/admin/*` routes check `profiles.role === 'admin'` server-side and redirect
   non-admins out; matching RLS policies reject direct API calls from
   non-admins too, not just the UI.

## Routes

| Route | Purpose | Auth |
|---|---|---|
| `/` | Home — hero, best-sellers (from `featured=true`), brand story | Public |
| `/shop` | Catalog: search (`?q=`), category filter, price range, sort, page-based pagination (24/page) | Public |
| `/shop/[slug]` | Product detail: gallery, specs, reviews + review form, wishlist heart, related products, live stock | Public (review/wishlist actions prompt login) |
| `/cart` | Cart (unchanged from today) | Public |
| `/checkout` | Checkout form → creates `orders`/`order_items` → redirects to Stripe Checkout | Public (guest or logged-in) |
| `/account` | Profile summary, links to orders/wishlist | Logged-in |
| `/account/orders` | Order history list | Logged-in |
| `/account/orders/[id]` | Single order detail/status | Logged-in, own orders only |
| `/account/wishlist` | Saved items, "move to cart" | Logged-in |
| `/faq` | Static FAQ content | Public |
| `/shipping-returns` | Static shipping/returns policy | Public |
| `/about`, `/contact` | Existing pages, unchanged | Public |
| `/not-found` | 404 | Public |
| `/admin` | Dashboard: revenue, order count, recent orders, low-stock alerts | Admin only |
| `/admin/products` | Product CRUD, photo upload/reorder (Supabase Storage), stock/price/category/specs/featured | Admin only |
| `/admin/categories` | Category CRUD | Admin only |
| `/admin/orders` | List/filter all orders, order detail, status updates | Admin only |
| `/admin/customers` | List customers, view their order history, promote to admin | Admin only |
| `/admin/reviews` | List all reviews, delete inappropriate ones | Admin only |

## Checkout & payment flow (Stripe, test mode)

1. Customer submits the checkout form.
2. Server Action creates an `orders` row (`status: 'pending'`) + `order_items`,
   then creates a Stripe Checkout Session for the cart total and redirects there.
3. Stripe collects payment (test-mode card numbers — no real charge in v1).
4. A Stripe webhook (`checkout.session.completed`) flips the order to
   `status: 'paid'` server-side. This webhook, not the browser redirect back,
   is the source of truth for payment success.
5. Customer lands on the existing order-confirmation UI, now showing the real
   order number and live status.
6. `shipped`/`delivered`/`cancelled`/`refunded` are set manually by an admin in
   `/admin/orders` — there's no real carrier integration in v1.

Switching Stripe from test to live mode later is a key/webhook-endpoint swap,
not a code change.

## V1 — build now

- Supabase schema, RLS policies, Google OAuth, `profiles` auto-provisioning
- Catalog rebuilt on the DB: search, category/price filter, sort, pagination
- Product detail: reviews + review form, wishlist, related products, live stock
- Cart: unchanged
- Checkout: Stripe test-mode integration, real order + order-item persistence,
  webhook-driven status
- Account area: profile, order history + detail, wishlist
- Admin panel: dashboard, products (+ image upload), categories, orders,
  customers, review moderation
- `/faq`, `/shipping-returns` static pages, `/not-found`
- Existing Motion/anime.js animation work extended to all new pages/components

## V2 — next (explicitly deferred)

- Coupon/discount codes
- Sales analytics dashboard (revenue over time, top products)
- Admin-editable FAQ/shipping content (move from hardcoded to DB-backed)
- Order/shipping email notifications (e.g. Resend)
- Multi-admin invite system (beyond the manual role-flag bootstrap)
- Product variants (size/color), if the catalog needs them

## V3 — further out

- Real carrier shipping rates + tracking numbers
- Loyalty/rewards program, abandoned-cart recovery
- Full CMS for site content
- Multi-warehouse/multi-vendor support

## Explicit non-goals for v1

- No CMS — FAQ/shipping content is hardcoded, not admin-editable, until v2
- No coupons, no analytics dashboard beyond basic counts
- No email notifications (order confirmation is web-only in v1)
- No product variants (size/color) — each product is a single SKU
- No real carrier/shipping-rate integration — flat/free shipping assumed
- No DB-synced cart — localStorage only, as today
