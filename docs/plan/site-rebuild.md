# Elite Classy Bags — Full Site Rebuild Plan

Rebuild the site from the untouched `create-next-app` scaffold into a complete
e-commerce storefront for a bags brand. Product data and images are static
placeholders for now (hardcoded array + online placeholder image URLs, e.g.
Unsplash) — no backend/CMS in this pass.

Stack: Next.js 16 (App Router), React 19, TypeScript, Tailwind v4.

## Step 1 — Audit the current scaffold and define design direction

**Intent**: The app currently contains only the default `create-next-app`
welcome page. Evaluate what exists, choose a visual direction (typography,
color palette, spacing scale, component conventions) appropriate for a
premium bags e-commerce brand, and decide the shared layout structure
(header/nav, footer, page shell) all pages will use.

**Tags**: design

**Acceptance**:
- Written direction covering palette, type scale, and shared layout shape
- Confirms static-placeholder-data approach and online image sourcing (Unsplash)

## Step 2 — Build the design system foundation and shared layout

**Intent**: Implement the design direction from Step 1 as Tailwind tokens,
plus the shared `layout.tsx` shell: header with nav (Home, Shop, About,
Contact, Cart icon), footer, and base typography. Replace the default
template content entirely.

**Tags**: impl

**Acceptance**:
- Default Next.js template markup fully removed
- Header/footer render on every route via the root layout
- Design tokens (colors, fonts, spacing) centralized in Tailwind config/CSS

## Step 3 — Build the Home page

**Intent**: Build a real landing page: hero section, featured/best-selling
products grid pulling from static placeholder data, and a brand story
section. Use online placeholder images for all product/hero imagery.

**Tags**: impl

**Acceptance**:
- Hero, featured products grid, and brand section all render with real content
- No leftover template text or Next.js/Vercel starter links

## Step 4 — Build the Shop/Catalog page with static product data

**Intent**: Create a static product dataset (id, name, price, category,
image URL, description) and a `/shop` page listing all products in a
responsive grid with basic category filtering.

**Tags**: impl

**Acceptance**:
- Static product data module exists and is typed
- `/shop` renders all products with working category filter
- Each product links to its detail page

## Step 5 — Build the Product Detail page

**Intent**: Dynamic route `/shop/[slug]` showing full product info (images,
price, description, add-to-cart control) sourced from the static product
data.

**Tags**: impl

**Acceptance**:
- Dynamic route resolves every product from Step 4's dataset
- Add-to-cart control present and wired to cart state (Step 6)
- 404s gracefully for unknown slugs

## Step 6 — Build cart state and cart UI

**Intent**: Add client-side cart state (context or lightweight store),
a cart drawer or `/cart` page listing line items with quantity controls
and a running total.

**Tags**: impl

**Acceptance**:
- Adding a product from Step 5 updates cart state and visible cart count
- Cart view lists items, quantities, and a correct total
- Cart state persists across navigation (session-level is sufficient)

**Out of scope**: real payment processing, persistent server-side cart storage.

## Step 7 — Build the checkout flow (placeholder)

**Intent**: A `/checkout` page presenting order summary and a shipping/contact
form. Submission is a placeholder (no real payment gateway) that shows an
order-confirmation state.

**Tags**: impl

**Acceptance**:
- Checkout form validates required fields client-side
- Submitting shows a confirmation screen/state
- Order summary total matches cart total from Step 6

**Out of scope**: real payment gateway integration, order persistence/backend.

## Step 8 — Build the About page

**Intent**: A brand story / about page consistent with the Step 2 design
system, using online placeholder imagery.

**Tags**: impl

**Acceptance**:
- Page uses shared layout and design tokens, no template leftovers

## Step 9 — Build the Contact page

**Intent**: A contact page with a form (name, email, message) and static
contact info, client-side validated (no backend submission required yet).

**Tags**: impl

**Acceptance**:
- Form validates required fields client-side
- Page uses shared layout and design tokens

## Step 10 — Full-site review and verification pass

**Intent**: Audit every page built in Steps 2–9 together for visual and
functional consistency: shared layout applied everywhere, no leftover
template content, responsive behavior, and working navigation/cart/checkout
flow end to end.

**Tags**: review
