# Restora — Furniture & Sleep Store

Premium furniture and mattress storefront with a React/Vite frontend and a Convex commerce backend.

## Application stack
- React + Vite storefront and admin interface
- Tailwind CSS + Bootstrap utilities
- Convex database, indexed queries, mutations and file storage
- Vercel hosting
- Authentication provider must be configured before enabling admin access

## Local development

1. Install dependencies: `npm install`
2. Sign in to your Convex account: `npx convex login`
3. Create and link a **cloud** development deployment: `npx convex dev --configure new --dev-deployment cloud --project restora-furniture-store`
4. Copy the generated deployment URL into `.env.local` as `VITE_CONVEX_URL=https://YOUR-DEPLOYMENT.convex.cloud`.
5. Keep the generated `CONVEX_DEPLOYMENT` value in `.env.local`; do not commit credentials or deployment keys.
6. Start the frontend: `npm run dev`

Convex CLI generates the `convex/_generated` files automatically. Run `npx convex dev` whenever you change backend functions or schema.

## Production deployment

1. Create/select a production Convex deployment and deploy functions with `npx convex deploy`.
2. Set the production `VITE_CONVEX_URL` in Vercel project environment variables.
3. Set the Convex production deploy key as a Vercel secret only if your deployment workflow needs it. Never expose deploy keys with a `VITE_` prefix.
4. Redeploy the Vercel application after changing build-time environment variables.
5. Configure an authentication provider and its JWT issuer in Convex before granting admin access.
6. Add the first administrator record to the `admins` table from the Convex dashboard, using the exact authenticated identity `subject`. There is deliberately no public admin-bootstrap mutation.

## Database model

The Convex schema covers products, customers, addresses, orders, order items, inventory movements, leads, newsletter subscribers, admin roles, content, coupons and activity logs. Public catalogue/lead/newsletter functions are separate from admin-only queries and mutations. Admin functions require an authenticated identity whose subject is present in the active `admins` table.

Large lists use Convex pagination and indexes. Product images should be stored in Convex file storage (or a dedicated image CDN); store storage IDs or stable asset references in product records, not raw image binaries in database documents.

## Important integration status

The backend schema and server functions are committed, but this repository does **not** contain a provisioned Convex cloud deployment, configured identity provider/JWT issuer, generated Convex client bindings, or live Vercel environment variables yet. The current storefront/admin UI still contains demo data and must not be used for real orders or customer information until those setup and client-integration steps are completed. Payment processing, tax calculation, shipping integrations, webhook verification, transactional checkout, and privacy/retention workflows are also not yet implemented.
