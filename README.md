# Cats Can Dance — v2

India's underground electronic music platform. Server-first Next.js 16 rebuild — minimal, opinionated, fast.

## Stack

- **Next.js 16** (App Router, RSC, PPR, Turbopack)
- **React 19**
- **TypeScript** strict
- **Tailwind CSS v4** + **shadcn/ui** (chunk-shadow brutalist design system)
- **Drizzle ORM** + **Postgres** (Supabase)
- **Better Auth** (own users in your DB; native Drizzle adapter)
- **Resend** + **react-email**
- **Vercel AI SDK** + Anthropic (Catbot, event scoring)
- **Shopify Storefront API** (drops)
- **Vercel** (deploy + cron + edge)

## Quickstart

```bash
cp .env.example .env.local      # fill in DATABASE_URL, BETTER_AUTH_SECRET, etc.
npm install
npm run db:push                 # apply Drizzle schema to your DB
npm run db:seed                 # optional sample data
npm run dev
```

Open <http://localhost:3000>.

## Project layout

```
app/                            App Router routes
  (marketing)/                  Public marketing surfaces
  (discovery)/                  Events, artists, scenes, discover
  (commerce)/                   Shop, product, cart
  (account)/                    Dashboard, submit-event, my-tickets
  admin/                        Role-gated CMS
  api/                          Route handlers (cron, catbot, og)
components/
  ui/                           shadcn primitives (Button, …)
  site/                         Header, Footer, Marquee, ChunkCard
  event/  artist/  shop/        Domain components
  admin/                        Admin tables + forms
content/posts/                  MDX blog posts
lib/
  db/                           Drizzle schema, client, queries, migrations
  auth.ts                       Better Auth config
  seo.ts                        generateMetadata + JSON-LD helpers
  shopify.ts                    Storefront client
  email/                        react-email templates
  ai.ts                         Vercel AI SDK config
public/                         Static assets
```

## Design system

Tokens in `app/globals.css` via Tailwind v4 `@theme inline`. Override at runtime through the admin CMS — every brand color is a CSS variable.

Motion language:
- `--ease-pop` — bouncy CTAs
- `--ease-glide` — page transitions
- `--ease-snap` — UI affordances
- `--duration-snap | cruise | glide` — 150ms / 280ms / 480ms

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Turbopack dev server |
| `npm run build` | Production build |
| `npm run db:generate` | Generate Drizzle migration from schema diff |
| `npm run db:push` | Push schema directly (dev) |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:studio` | Drizzle Studio |
| `npm run db:seed` | Seed sample data |
| `npm run typecheck` | TS strict check |
| `npm run lint` | ESLint |

## SEO

- `app/sitemap.ts` — generated from DB
- `app/robots.ts` — public allow, admin/dashboard disallow
- `app/og/[...slug]/route.ts` — dynamic OG cards via `@vercel/og`
- `lib/seo.ts` — `generateMetadata` builders + JSON-LD (`MusicEvent`, `MusicGroup`, `BlogPosting`, `Product`, `ItemList`)
- Programmatic SEO: `/scenes/[city]`, `/scenes/[city]/[genre]`, `/sounds/[genre]`

## License

Proprietary — © Cats Can Dance.
