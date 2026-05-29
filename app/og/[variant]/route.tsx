/**
 * Dynamic OG image generator — /og/{variant}?slug=...&...
 *
 * Variants:
 *   - default        → CCD logotype + tagline
 *   - event?slug=…   → event title, date, city, venue, lineup chip
 *   - artist?slug=…  → artist name, primary city, genre chips
 *   - scene?city=…   → city scene landing card
 *   - post?slug=…    → blog post title + author + date
 *
 * 1200×630 brutalist chunk-shadow card.  Cached at the edge for 24h.
 */
import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { artists, events, posts } from "@/lib/db/schema";
import {
  CITY_DISPLAY,
  GENRE_DISPLAY,
  isCity,
  isGenre,
} from "@/lib/scenes";


const COLORS = {
  cream: "#e6e3df",
  ink: "#06070a",
  hotPink: "#dc2626",
  acidYellow: "#c8e539",
  electricBlue: "#2563eb",
  lime: "#86efac",
  bubblegum: "#fbcfe8",
} as const;

const SIZE = { width: 1200, height: 630 } as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function safe<T>(fn: () => Promise<T>): Promise<T | null> {
  return fn().catch((err) => {
    console.warn("[og] DB lookup failed:", err);
    return null;
  });
}

async function fetchEvent(slug: string) {
  return safe(() =>
    db.query.events.findFirst({
      where: eq(events.slug, slug),
      with: { venue: true, lineup: { with: { artist: true } } },
    })
  );
}

async function fetchArtist(slug: string) {
  return safe(() => db.query.artists.findFirst({ where: eq(artists.slug, slug) }));
}

async function fetchPost(slug: string) {
  return safe(() => db.query.posts.findFirst({ where: eq(posts.slug, slug) }));
}

function formatDateForOg(date: Date): string {
  const d = date;
  const dow = d.toLocaleDateString("en-IN", { weekday: "short" }).toUpperCase();
  const day = d.getDate();
  const month = d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
  return `${dow} · ${day} ${month}`;
}

// ─── Card primitives (inline-style JSX for Satori) ───────────────────────────

function Frame({
  children,
  bg = COLORS.cream,
}: {
  children: React.ReactNode;
  bg?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: bg,
        backgroundImage: `radial-gradient(${COLORS.ink}11 1px, transparent 1px)`,
        backgroundSize: "8px 8px",
        padding: 64,
        fontFamily: "system-ui, sans-serif",
        color: COLORS.ink,
        position: "relative",
      }}
    >
      {children}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          right: 56,
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: -0.5,
          textTransform: "uppercase",
          color: COLORS.ink,
          display: "flex",
        }}
      >
        catscandance.com
      </div>
    </div>
  );
}

function Eyebrow({ text, bg }: { text: string; bg: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignSelf: "flex-start",
        backgroundColor: bg,
        color: COLORS.ink,
        border: `4px solid ${COLORS.ink}`,
        boxShadow: `8px 8px 0 0 ${COLORS.ink}`,
        padding: "10px 18px",
        fontSize: 22,
        fontWeight: 900,
        letterSpacing: -0.5,
        textTransform: "uppercase",
        marginBottom: 32,
      }}
    >
      {text}
    </div>
  );
}

function Pill({ text, bg }: { text: string; bg: string }) {
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: bg,
        color: COLORS.ink,
        border: `3px solid ${COLORS.ink}`,
        padding: "6px 14px",
        fontSize: 24,
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: -0.4,
        marginRight: 12,
      }}
    >
      {text}
    </div>
  );
}

// ─── Card variants ───────────────────────────────────────────────────────────

function DefaultCard() {
  return (
    <Frame>
      <Eyebrow text="India · Underground · Since 2024" bg={COLORS.acidYellow} />
      <div
        style={{
          fontSize: 180,
          fontWeight: 900,
          letterSpacing: -8,
          lineHeight: 0.9,
          color: COLORS.ink,
          display: "flex",
        }}
      >
        Cats Can
      </div>
      <div
        style={{
          fontSize: 180,
          fontWeight: 900,
          letterSpacing: -8,
          lineHeight: 0.9,
          color: COLORS.hotPink,
          WebkitTextStroke: `4px ${COLORS.ink}`,
          display: "flex",
        }}
      >
        Dance
      </div>
      <div
        style={{
          fontSize: 30,
          marginTop: 32,
          maxWidth: 900,
          color: `${COLORS.ink}cc`,
          display: "flex",
        }}
      >
        Underground electronic music, parties, and culture across India.
      </div>
    </Frame>
  );
}

function EventCard({ event }: { event: NonNullable<Awaited<ReturnType<typeof fetchEvent>>> }) {
  const headlinerNames = event.lineup
    .filter((l) => l.role === "headliner")
    .map((l) => l.artist.name);
  const supportNames = event.lineup
    .filter((l) => l.role !== "headliner")
    .slice(0, 2)
    .map((l) => l.artist.name);
  const lineupChips = [...headlinerNames, ...supportNames].slice(0, 3);

  return (
    <Frame bg={COLORS.cream}>
      <Eyebrow text={`/ ${event.city}`} bg={COLORS.acidYellow} />
      <div
        style={{
          display: "flex",
          fontSize: 32,
          fontWeight: 900,
          color: COLORS.ink,
          marginBottom: 18,
          letterSpacing: -1,
        }}
      >
        {formatDateForOg(event.startsAt)} · {event.venue?.name ?? event.venueLabel ?? "TBA"}
      </div>
      <div
        style={{
          fontSize: 100,
          fontWeight: 900,
          letterSpacing: -3,
          lineHeight: 0.95,
          color: COLORS.ink,
          marginBottom: 28,
          maxWidth: 1100,
          display: "flex",
        }}
      >
        {event.title.length > 60 ? `${event.title.slice(0, 60)}…` : event.title}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 0, marginBottom: 12 }}>
        {lineupChips.map((name, i) => (
          <Pill key={name} text={name} bg={i === 0 ? COLORS.hotPink : COLORS.bubblegum} />
        ))}
      </div>
    </Frame>
  );
}

function ArtistCard({ artist }: { artist: NonNullable<Awaited<ReturnType<typeof fetchArtist>>> }) {
  return (
    <Frame bg={COLORS.cream}>
      <Eyebrow
        text={`/ ${artist.primaryCity ?? "India"}`}
        bg={COLORS.electricBlue}
      />
      <div
        style={{
          fontSize: 140,
          fontWeight: 900,
          letterSpacing: -5,
          lineHeight: 0.9,
          color: COLORS.ink,
          marginBottom: 24,
          maxWidth: 1100,
          display: "flex",
        }}
      >
        {artist.name.length > 24 ? `${artist.name.slice(0, 24)}…` : artist.name}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
        {(artist.genres ?? []).slice(0, 4).map((genre, i) => (
          <Pill
            key={genre}
            text={genre}
            bg={[COLORS.acidYellow, COLORS.bubblegum, COLORS.lime, COLORS.electricBlue][i] ?? COLORS.acidYellow}
          />
        ))}
      </div>
    </Frame>
  );
}

function SceneCard({ city, genre }: { city: string; genre?: string }) {
  return (
    <Frame bg={COLORS.cream}>
      <Eyebrow text={genre ? `/ ${genre} in ${city}` : `/ Scene · ${city}`} bg={COLORS.lime} />
      <div
        style={{
          fontSize: 160,
          fontWeight: 900,
          letterSpacing: -6,
          lineHeight: 0.9,
          color: COLORS.ink,
          display: "flex",
        }}
      >
        {city}
      </div>
      {genre ? (
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            letterSpacing: -4,
            lineHeight: 0.9,
            color: COLORS.hotPink,
            WebkitTextStroke: `3px ${COLORS.ink}`,
            display: "flex",
          }}
        >
          {genre}
        </div>
      ) : (
        <div
          style={{
            fontSize: 30,
            marginTop: 16,
            color: `${COLORS.ink}cc`,
            display: "flex",
          }}
        >
          Underground events, artists, venues, scenes.
        </div>
      )}
    </Frame>
  );
}

function PostCard({ post }: { post: NonNullable<Awaited<ReturnType<typeof fetchPost>>> }) {
  return (
    <Frame bg={COLORS.cream}>
      <Eyebrow text="/ Field notes" bg={COLORS.bubblegum} />
      <div
        style={{
          fontSize: 84,
          fontWeight: 900,
          letterSpacing: -3,
          lineHeight: 1,
          color: COLORS.ink,
          marginBottom: 32,
          maxWidth: 1080,
          display: "flex",
        }}
      >
        {post.title.length > 80 ? `${post.title.slice(0, 80)}…` : post.title}
      </div>
      {post.excerpt ? (
        <div
          style={{
            fontSize: 30,
            color: `${COLORS.ink}aa`,
            maxWidth: 1000,
            display: "flex",
          }}
        >
          {post.excerpt.length > 140 ? `${post.excerpt.slice(0, 140)}…` : post.excerpt}
        </div>
      ) : null}
    </Frame>
  );
}

// ─── Route handler ───────────────────────────────────────────────────────────

export async function GET(request: NextRequest, { params }: { params: Promise<{ variant: string }> }) {
  const { variant } = await params;
  const search = request.nextUrl.searchParams;

  let body: React.ReactElement = <DefaultCard />;

  try {
    if (variant === "event") {
      const slug = search.get("slug");
      if (slug) {
        const event = await fetchEvent(slug);
        if (event) body = <EventCard event={event} />;
      }
    } else if (variant === "artist") {
      const slug = search.get("slug");
      if (slug) {
        const artist = await fetchArtist(slug);
        if (artist) body = <ArtistCard artist={artist} />;
      }
    } else if (variant === "scene") {
      const city = search.get("city") ?? "Bangalore";
      const genre = search.get("genre");
      const cityName = isCity(city) ? CITY_DISPLAY[city] : city;
      const genreName = genre && isGenre(genre) ? GENRE_DISPLAY[genre] : genre ?? undefined;
      body = <SceneCard city={cityName} genre={genreName} />;
    } else if (variant === "post") {
      const slug = search.get("slug");
      if (slug) {
        const post = await fetchPost(slug);
        if (post) body = <PostCard post={post} />;
      }
    }
  } catch (err) {
    console.warn("[og] render failed, falling back to default:", err);
  }

  return new ImageResponse(body, {
    ...SIZE,
    headers: { "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" },
  });
}
