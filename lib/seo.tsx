/**
 * SEO + structured data helpers.
 *
 * Two halves:
 *   1. `buildMetadata()` — composes Next.js Metadata with sane defaults,
 *      canonical URL, OG tags, Twitter card, dynamic OG image URL.
 *   2. JSON-LD builders — typed factories for the schema.org types we use:
 *      Organization, WebSite, MusicEvent, MusicGroup, BlogPosting, Product,
 *      ItemList, BreadcrumbList, FAQPage.
 *
 * Usage:
 *   export const metadata = buildMetadata({ title, description, path, image });
 *   <JsonLd data={musicEventSchema(event)} />
 */
import type { Metadata } from "next";
import { absoluteUrl } from "./utils";
import type { Artist, Event, Post, Venue } from "./db/schema";

// ─────────────────────────────────────────────────────────────────────────────
// Brand constants
// ─────────────────────────────────────────────────────────────────────────────

export const SITE = {
  name: "Cats Can Dance",
  shortName: "CCD",
  domain: "catscandance.com",
  email: "hi@catscandance.com",
  twitter: "@catscandanceco",
  instagram: "@catscandance",
  description:
    "Underground electronic music, parties, and culture across India. Discover artists, events, and scenes in Bombay, Bangalore, Goa, Delhi and beyond.",
  tagline: "India's underground electronic music platform",
  founded: "2024",
  founder: "Cats Can Dance",
  city: "Bangalore",
  country: "IN",
  locale: "en_IN",
  language: "en-IN",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Metadata builder
// ─────────────────────────────────────────────────────────────────────────────

export type BuildMetadataInput = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  ogVariant?: "default" | "event" | "artist" | "scene" | "post";
  ogParams?: Record<string, string>;
  type?: "website" | "article" | "music.song" | "music.album";
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  keywords?: string[];
};

export function buildMetadata({
  title,
  description = SITE.description,
  path = "/",
  image,
  ogVariant = "default",
  ogParams,
  type = "website",
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
  keywords,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogUrl = image ?? buildOgUrl(ogVariant, ogParams);

  return {
    title,
    description,
    keywords,
    authors: authors?.map((name) => ({ name })),
    alternates: { canonical: path === "/" ? "/" : path },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: title }],
      locale: SITE.locale,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
      creator: SITE.twitter,
    },
  };
}

/** Builds an `/og/...` URL hitting our @vercel/og route handler. */
export function buildOgUrl(
  variant: "default" | "event" | "artist" | "scene" | "post",
  params: Record<string, string> = {}
): string {
  const search = new URLSearchParams(params);
  return absoluteUrl(`/og/${variant}${search.toString() ? `?${search.toString()}` : ""}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD component
// ─────────────────────────────────────────────────────────────────────────────

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Stable order, escapes </script> safely.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD builders
// ─────────────────────────────────────────────────────────────────────────────

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: SITE.name,
    alternateName: SITE.shortName,
    url: absoluteUrl(),
    logo: absoluteUrl("/icon-512.png"),
    description: SITE.description,
    foundingDate: SITE.founded,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.city,
      addressCountry: SITE.country,
    },
    sameAs: [
      `https://instagram.com/${SITE.instagram.replace("@", "")}`,
      `https://twitter.com/${SITE.twitter.replace("@", "")}`,
    ],
  } as const;
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: absoluteUrl(),
    name: SITE.name,
    description: SITE.description,
    publisher: { "@id": absoluteUrl("/#organization") },
    inLanguage: SITE.language,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: absoluteUrl("/discover?q={search_term_string}") },
      "query-input": "required name=search_term_string",
    },
  } as const;
}

export type EventForSchema = Event & {
  venue: Venue | null;
  lineup: Array<{ artist: Pick<Artist, "name" | "slug"> }>;
};

export function musicEventSchema(event: EventForSchema) {
  const performers = event.lineup.map((l) => ({
    "@type": "MusicGroup",
    name: l.artist.name,
    url: absoluteUrl(`/artists/${l.artist.slug}`),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    "@id": absoluteUrl(`/events/${event.slug}#event`),
    name: event.title,
    description: event.description ?? event.blurb ?? undefined,
    url: absoluteUrl(`/events/${event.slug}`),
    image: event.posterUrl ?? buildOgUrl("event", { slug: event.slug }),
    startDate: event.startsAt.toISOString(),
    endDate: event.endsAt?.toISOString(),
    eventStatus:
      event.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.venue?.name ?? event.venueLabel ?? "TBA on RSVP",
      address: {
        "@type": "PostalAddress",
        addressLocality: event.city,
        addressCountry: SITE.country,
        streetAddress: event.venue?.addressLine ?? event.addressLine ?? undefined,
      },
    },
    performer: performers.length ? performers : undefined,
    organizer: { "@id": absoluteUrl("/#organization") },
    offers: event.tickets?.length
      ? event.tickets.map((t) => ({
          "@type": "Offer",
          name: t.tier,
          price: t.price,
          priceCurrency: t.currency,
          url: t.url ?? absoluteUrl(`/events/${event.slug}`),
          availability: "https://schema.org/InStock",
          validFrom: new Date().toISOString(),
        }))
      : {
          "@type": "Offer",
          name: "RSVP",
          price: 0,
          priceCurrency: "INR",
          url: absoluteUrl(`/events/${event.slug}`),
          availability: "https://schema.org/InStock",
        },
  } as const;
}

export type ArtistForSchema = Artist & {
  lineups?: Array<{ event: Pick<Event, "title" | "slug" | "startsAt" | "city"> & { venue: Venue | null } }>;
};

export function musicGroupSchema(artist: ArtistForSchema) {
  const upcomingPerformances =
    artist.lineups
      ?.filter((l) => l.event.startsAt > new Date())
      .map((l) => ({
        "@type": "MusicEvent",
        name: l.event.title,
        startDate: l.event.startsAt.toISOString(),
        url: absoluteUrl(`/events/${l.event.slug}`),
        location: {
          "@type": "Place",
          name: l.event.venue?.name ?? "TBA",
          address: { "@type": "PostalAddress", addressLocality: l.event.city, addressCountry: SITE.country },
        },
      })) ?? [];

  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "@id": absoluteUrl(`/artists/${artist.slug}#artist`),
    name: artist.name,
    alternateName: artist.realName ?? undefined,
    url: absoluteUrl(`/artists/${artist.slug}`),
    image: artist.heroUrl ?? artist.photoUrl ?? buildOgUrl("artist", { slug: artist.slug }),
    description: artist.bio ?? undefined,
    genre: artist.genres,
    sameAs: artist.socials
      ? [
          artist.socials.instagram,
          artist.socials.soundcloud,
          artist.socials.spotify,
          artist.socials.youtube,
          artist.socials.bandcamp,
          artist.socials.beatport,
          artist.socials.resident_advisor,
          artist.socials.twitter,
          artist.socials.website,
        ].filter(Boolean)
      : undefined,
    location: artist.primaryCity
      ? {
          "@type": "Place",
          name: artist.primaryCity,
          address: { "@type": "PostalAddress", addressLocality: artist.primaryCity, addressCountry: SITE.country },
        }
      : undefined,
    event: upcomingPerformances.length ? upcomingPerformances : undefined,
  } as const;
}

export function blogPostingSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": absoluteUrl(`/blog/${post.slug}#article`),
    headline: post.title,
    description: post.excerpt ?? post.seoDescription ?? undefined,
    image: post.coverUrl ?? buildOgUrl("post", { slug: post.slug }),
    url: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.publishedAt?.toISOString() ?? post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.authorName
      ? { "@type": "Person", name: post.authorName }
      : { "@id": absoluteUrl("/#organization") },
    publisher: { "@id": absoluteUrl("/#organization") },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
    keywords: post.tags?.join(", "),
    inLanguage: SITE.language,
  } as const;
}

export function breadcrumbSchema(items: Array<{ name: string; href: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  } as const;
}

export function itemListSchema(name: string, items: Array<{ name: string; href: string; image?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.href),
      ...(item.image ? { image: item.image } : {}),
    })),
  } as const;
}

export function faqSchema(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  } as const;
}
