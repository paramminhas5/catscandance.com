# Cats Can Dance — catscandance.com v2

India's underground electronic music platform. Events, artists, scene guides, streetwear, and the CCD × SOCIAL pet-friendly series.

**Stack:** Next.js 16 (App Router, PPR) · React 19 · TypeScript strict · Tailwind v4 · Drizzle ORM + Supabase Postgres · Better Auth · Resend · Vercel AI SDK + Anthropic · Shopify Storefront API

---

## Project State

### ✅ Built & Live (Phase 1)

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ Live | Hero, Nav, About, Events strip, Stats, EarlyAccess, Contact, Disco mode |
| `/events` | ✅ Live | Season timeline strip, next-up hero card, past episodes grid |
| `/events/[slug]` | ✅ Live | Detail page — headliner card, countdown, lineup, venue, related |
| `/artists` | ✅ Live | Featured editorial hero + 4-col grid, live search/filter/sort |
| `/artists/[slug]` | ✅ Live | Split hero, tabbed profile (HOME/GIGS/STATS/BOOK) |
| `/api/rsvp` | ✅ Live | Guest RSVP → signups + interactions tables |
| `/api/booking-inquiry` | ✅ Live | Artist booking form → bookings table |
| `/sign-in` `/sign-up` | ✅ Live | Better Auth email + Google OAuth |

### 🔜 To Build

| Phase | Routes | Priority |
|---|---|---|
| **2 — Discovery** | `/discover`, `/scenes/[city]`, `/sounds/[genre]` | 🔴 High |
| **3 — Blog** | `/blog`, `/blog/[slug]` | 🟡 Medium |
| **4 — Shop** | `/shop`, `/shop/[handle]`, `/shop/cart` | 🟡 Medium |
| **5 — Account** | `/dashboard`, `/dashboard/rsvps`, `/dashboard/profile` | 🟡 Medium |
| **6 — Admin** | `/admin`, `/admin/events`, `/admin/artists` | 🟡 Medium |
| **7 — Supporting** | `/about`, `/for-artists`, `/for-venues`, `/ccdxsocial`, `/press`, `/book` | 🟢 Lower |

---

## Architecture

```
catscandance.com/
├── app/
│   ├── (auth)/               # Better Auth pages (sign-in, sign-up)
│   ├── (account)/            # Protected user dashboard
│   │   └── dashboard/
│   ├── (admin)/              # Protected admin panel
│   │   └── admin/
│   ├── api/
│   │   ├── auth/[...all]/    # Better Auth handler
│   │   ├── rsvp/             # POST — guest RSVP
│   │   ├── booking-inquiry/  # POST — artist booking
│   │   └── og/[variant]/     # Dynamic OG image generation
│   ├── events/               # /events + /events/[slug]
│   ├── artists/              # /artists + /artists/[slug]
│   ├── discover/             # /discover hub
│   ├── scenes/[city]/        # City scene guides
│   ├── sounds/[genre]/       # Genre deep-dives
│   ├── blog/                 # /blog + /blog/[slug]
│   ├── shop/                 # Shopify storefront
│   ├── about/
│   ├── ccdxsocial/
│   ├── for-artists/
│   ├── for-venues/
│   ├── press/
│   ├── book/
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── rss.xml/
│   └── page.tsx              # Homepage
│
├── components/
│   ├── site/                 # Brand components (Nav, Footer, PageHero, etc.)
│   └── ui/                   # shadcn/ui primitives
│
├── lib/
│   ├── auth.ts               # Better Auth server config
│   ├── auth-client.ts        # Better Auth client config
│   ├── db/
│   │   ├── client.ts         # Drizzle postgres client
│   │   ├── schema.ts         # 16 tables (single source of truth)
│   │   ├── queries.ts        # Reusable RSC query functions
│   │   └── seed.ts           # Local dev seed
│   ├── seo.tsx               # buildMetadata + JSON-LD builders
│   ├── scenes.ts             # Scene/city config
│   └── utils.ts
│
├── scripts/
│   ├── seed-via-api.js       # Stub seed via Supabase Management API
│   └── seed-full.js          # Full CCD data seed (47 artists, 5 events)
│
└── drizzle/
    └── migrations/           # 0000_shiny_nextwave.sql (16 tables, 10 enums)
```

---

## Database (Supabase — ybmjpiopgadyyrxdovrk)

### Tables (16)

**Auth (Better Auth):** `user`, `session`, `account`, `verification`

**Catalogue:** `venues`, `artists`, `promoters`, `events`, `event_lineups`, `availability_blocks`, `posts`, `site_content`

**Activity:** `interactions`, `signups`, `submissions`, `bookings`

### Current Data
| Table | Count |
|---|---|
| venues | 5 |
| promoters | 4 |
| artists | 47 |
| events | 5 (1 past, 4 upcoming) |
| event_lineups | 10 |
| posts | 3 |
| site_content | 4 |

### Key Queries (`lib/db/queries.ts`)
- `listUpcomingEvents(filters)` — city / genre / date / limit
- `getEventBySlug(slug)` — full join: venue + promoter + lineup + artists
- `getRelatedEvents(id, city, genres)` — for event detail sidebar
- `listArtists(filters)` — city / genre / search / featured / limit
- `getArtistBySlug(slug)` — full join with gigography
- `listPublishedPosts(limit)` — blog list
- `getPostBySlug(slug)` — blog detail
- `search(query)` — full-text across events + artists + venues
- `getSceneData(city, genre?)` — events + artists + promoters by city

---

## Design System

All pages use the same token set — never deviate:

| Token | Value | Usage |
|---|---|---|
| `bg-ink` | `#0d0d0d` | Primary background, cards |
| `bg-cream` | `#f5f0e8` | Light backgrounds |
| `bg-magenta` | `#e8186d` | Hero sections, CTAs |
| `bg-electric-blue` | `#0047ff` | Feature sections |
| `bg-acid-yellow` | `#e8f500` | Accents, highlights |
| `bg-orange` | `#ff5c00` | Marquees |
| `font-display` | Editorial sans | All headings + labels |
| `border-4 border-ink` | 4px solid ink | Every card, every button |
| `chunk-shadow` | `6px 6px 0 ink` | Brutalist card shadow |

### Shared Components (built)
`Nav`, `Footer`, `PageHero`, `Breadcrumbs`, `Marquee`, `SectionReveal`, `EventPosterPlaceholder`, `EventLineupCard`, `EventVenueCard`, `EventCountdown`, `RsvpDialog`, `StickyRsvpBar`, `SeriesStrip`

---

## Environment Variables

Copy `.env.example` → `.env.local`:

```bash
# Database
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[REF].supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Auth
BETTER_AUTH_SECRET=""          # openssl rand -base64 32
BETTER_AUTH_URL="https://catscandance.com"

# Email
RESEND_API_KEY=""

# Shopify (Phase 4)
SHOPIFY_STORE_DOMAIN=""
SHOPIFY_STOREFRONT_TOKEN=""

# AI (Phase 6+)
ANTHROPIC_API_KEY=""
```

---

## Dev Setup

```bash
npm install
cp .env.example .env.local   # fill in values
npx drizzle-kit push         # push schema to Supabase
npm run dev
```

### Re-seed database
```bash
SUPABASE_PAT=sbp_... SUPABASE_PROJECT_REF=ybmjpiopgadyyrxdovrk node scripts/seed-full.js
```

---

## Phases Remaining — Implementation Guide

### Phase 2 — Discovery (`/discover`, `/scenes/[city]`, `/sounds/[genre]`)
- **`/discover`** — hub page with search bar, city grid, genre wheel, featured artists strip
- **`/scenes/[city]`** — uses `getSceneData(city)` — upcoming events + local artists + promoters
  - Cities: `bangalore`, `bombay`, `delhi`, `goa`, `hyderabad`, `pune`
  - Global origins: `detroit-techno`, `chicago-house`, `london-jungle`, `berlin-techno`, `goa-trance`
- **`/sounds/[genre]`** — genre deep-dive: history, key artists, upcoming events by genre
  - Genres: `techno`, `house`, `dnb`, `garage`, `downtempo`, `ambient`, `disco`, `bass`

### Phase 3 — Blog (`/blog`, `/blog/[slug]`)
- **`/blog`** — grid of published posts, tag filters
- **`/blog/[slug]`** — article detail with markdown rendering, related posts, author, share
- Data: `listPublishedPosts()` + `getPostBySlug()` already in queries.ts

### Phase 4 — Shop (`/shop`, `/shop/[handle]`)
- **`/shop`** — Shopify storefront product grid (Shopify Storefront API)
- **`/shop/[handle]`** — product detail page
- Credentials: `SHOPIFY_STORE_DOMAIN` + `SHOPIFY_STOREFRONT_TOKEN`
- Shell is fine if credentials aren't ready — show "coming soon" fallback

### Phase 5 — Account (`/dashboard`, `/dashboard/rsvps`, `/dashboard/profile`)
- Protected by Better Auth — redirect to `/sign-in` if not authed
- **`/dashboard`** — user home: upcoming RSVPs, saved events, XP
- **`/dashboard/rsvps`** — full RSVP history from `signups` table (tag: `event:slug`)
- **`/dashboard/profile`** — edit name, city, bio, socials

### Phase 6 — Admin (`/admin`, `/admin/events`, `/admin/artists`)
- Protected: role === 'admin' check via Better Auth session
- **`/admin`** — live dashboard: real DB counts replacing hardcoded stats
- **`/admin/events`** — create / edit / draft / publish events
- **`/admin/artists`** — manage artist roster, toggle featured/verified

### Phase 7 — Supporting Pages
- **`/about`** — brand story, team, manifesto
- **`/ccdxsocial`** — series explainer: 5 chapters, timeline, what to expect
- **`/for-artists`** — get listed, booking inquiries, artist portal CTA
- **`/for-venues`** — partner with CCD, host a night
- **`/press`** — press kit, media coverage
- **`/book`** — artist booking hub (search artists → booking inquiry)

---

## PR History

| PR | Branch | Description |
|---|---|---|
| [#2](https://github.com/paramminhas5/catscandance.com/pull/2) | `phase-1-clean` | Phase 1 — Events, Artists, DB schema, seed data |

---

## Notes for v2 Philosophy

This is the **upgraded v2** — not a straight port of the Replit app. Rules:

1. **Use source as reference, not blueprint.** When porting a page, find a better layout/UX first. Present it. Get approval. Then build.
2. **No placeholder numbers.** Stats, counts — everything comes from DB.
3. **Server Components by default.** Client islands only where interactivity is required.
4. **PPR-compatible.** No `export const revalidate` — cache via `unstable_cache` or fetch options.
5. **TypeScript strict.** No implicit `any`. Explicit types on all arrow function params.
6. **One design system.** No custom colors, no new font classes, no custom shadows.
