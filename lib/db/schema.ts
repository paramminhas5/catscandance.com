/**
 * CCD v2 — Drizzle schema (single source of truth).
 *
 * 12 tables organised in 3 groups:
 *   1. Auth (Better Auth):     user, session, account, verification
 *   2. Catalogue:              venues, artists, promoters, events, event_lineups,
 *                              availability_blocks, posts, site_content
 *   3. Activity:               interactions, signups, submissions, bookings
 *
 * Conventions:
 *   - text("id") + crypto.randomUUID() defaults — friendly with Better Auth.
 *   - timestamps as timestamptz with .defaultNow().
 *   - JSONB columns are typed via $type<T>() for full inference downstream.
 *   - Indexes on every filter/sort surface (slug, city, status, date, ...).
 */

import { sql } from "drizzle-orm";
import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

const createdAt = () => timestamp("created_at", { withTimezone: true }).defaultNow().notNull();
const updatedAt = () => timestamp("updated_at", { withTimezone: true }).defaultNow().notNull();

// ─────────────────────────────────────────────────────────────────────────────
// Enums
// ─────────────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", ["fan", "artist", "promoter", "admin"]);

export const eventSourceEnum = pgEnum("event_source", ["own", "curated", "submitted"]);
export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "upcoming",
  "live",
  "past",
  "cancelled",
]);
export const eventVisibilityEnum = pgEnum("event_visibility", ["public", "unlisted", "private"]);

export const lineupRoleEnum = pgEnum("lineup_role", [
  "headliner",
  "support",
  "b2b",
  "host",
  "selector",
  "live",
]);

export const interactionKindEnum = pgEnum("interaction_kind", [
  "rsvp",
  "follow_artist",
  "follow_event",
  "like_event",
  "save_event",
  "share",
  "view",
  "click",
  "xp",
]);

export const interactionTargetEnum = pgEnum("interaction_target", [
  "event",
  "artist",
  "venue",
  "post",
  "promoter",
]);

export const submissionStatusEnum = pgEnum("submission_status", [
  "pending",
  "approved",
  "rejected",
  "needs_changes",
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "draft",
  "sent",
  "shortlisted",
  "negotiating",
  "confirmed",
  "declined",
  "completed",
  "cancelled",
]);

export const postStatusEnum = pgEnum("post_status", ["draft", "published", "archived"]);

// ─────────────────────────────────────────────────────────────────────────────
// JSONB shapes
// ─────────────────────────────────────────────────────────────────────────────

export type Socials = {
  instagram?: string;
  soundcloud?: string;
  spotify?: string;
  youtube?: string;
  bandcamp?: string;
  beatport?: string;
  resident_advisor?: string;
  twitter?: string;
  website?: string;
};

export type DiscographyItem = {
  title: string;
  type: "single" | "ep" | "album" | "remix" | "compilation";
  year: number;
  label?: string;
  url?: string;
  artwork?: string;
};

export type Milestone = {
  year: number;
  text: string;
  url?: string;
};

export type PressItem = {
  outlet: string;
  title: string;
  url: string;
  date?: string;
  excerpt?: string;
};

export type SocialStats = {
  instagram_followers?: number;
  soundcloud_followers?: number;
  spotify_listeners?: number;
  fetched_at?: string;
};

export type MediaItem = {
  type: "image" | "video" | "audio";
  url: string;
  caption?: string;
  poster?: string;
};

export type AudioEmbed = {
  platform: "soundcloud" | "spotify" | "bandcamp" | "youtube";
  url: string;
  embed_id?: string;
  title?: string;
};

export type BookingMessage = {
  from: "fan" | "artist" | "promoter" | "ccd";
  user_id?: string;
  body: string;
  attachments?: string[];
  sent_at: string;
};

export type EventTicket = {
  tier: string;
  price: number;
  currency: "INR" | "USD";
  url?: string;
  capacity?: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. Auth (Better Auth canonical schema)
// ─────────────────────────────────────────────────────────────────────────────

export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    role: userRoleEnum("role").default("fan").notNull(),
    city: text("city"),
    bio: text("bio"),
    socials: jsonb("socials").$type<Socials>(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("user_email_idx").on(t.email), index("user_role_idx").on(t.role)]
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    token: text("token").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("session_token_idx").on(t.token), index("session_user_idx").on(t.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
    scope: text("scope"),
    password: text("password"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("account_user_idx").on(t.userId),
    uniqueIndex("account_provider_idx").on(t.providerId, t.accountId),
  ]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("verification_identifier_idx").on(t.identifier)]
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. Catalogue
// ─────────────────────────────────────────────────────────────────────────────

export const venues = pgTable(
  "venues",
  {
    id: id(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    city: text("city").notNull(),
    addressLine: text("address_line"),
    geoLat: text("geo_lat"),
    geoLng: text("geo_lng"),
    capacity: integer("capacity"),
    description: text("description"),
    photoUrl: text("photo_url"),
    socials: jsonb("socials").$type<Socials>(),
    isPartner: boolean("is_partner").default(false).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("venues_slug_idx").on(t.slug),
    index("venues_city_idx").on(t.city),
    index("venues_partner_idx").on(t.isPartner),
  ]
);

export const promoters = pgTable(
  "promoters",
  {
    id: id(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    city: text("city").notNull(),
    bio: text("bio"),
    photoUrl: text("photo_url"),
    socials: jsonb("socials").$type<Socials>(),
    /** When non-null, this promoter row is owned by a user account (artist portal). */
    ownerUserId: text("owner_user_id").references(() => user.id, { onDelete: "set null" }),
    isVerified: boolean("is_verified").default(false).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("promoters_slug_idx").on(t.slug),
    index("promoters_city_idx").on(t.city),
    index("promoters_owner_idx").on(t.ownerUserId),
  ]
);

export const artists = pgTable(
  "artists",
  {
    id: id(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    realName: text("real_name"),
    bio: text("bio"),
    primaryCity: text("primary_city"),
    cities: text("cities").array().$type<string[]>().default(sql`ARRAY[]::text[]`),
    genres: text("genres").array().$type<string[]>().default(sql`ARRAY[]::text[]`),
    tags: text("tags").array().$type<string[]>().default(sql`ARRAY[]::text[]`),
    photoUrl: text("photo_url"),
    heroUrl: text("hero_url"),
    socials: jsonb("socials").$type<Socials>(),
    audioEmbeds: jsonb("audio_embeds").$type<AudioEmbed[]>().default(sql`'[]'::jsonb`),
    discography: jsonb("discography").$type<DiscographyItem[]>().default(sql`'[]'::jsonb`),
    milestones: jsonb("milestones").$type<Milestone[]>().default(sql`'[]'::jsonb`),
    press: jsonb("press").$type<PressItem[]>().default(sql`'[]'::jsonb`),
    socialStats: jsonb("social_stats").$type<SocialStats>(),
    isVerified: boolean("is_verified").default(false).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    /** When non-null, the artist's portal account. */
    ownerUserId: text("owner_user_id").references(() => user.id, { onDelete: "set null" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("artists_slug_idx").on(t.slug),
    index("artists_city_idx").on(t.primaryCity),
    index("artists_featured_idx").on(t.isFeatured),
    index("artists_owner_idx").on(t.ownerUserId),
  ]
);

export const events = pgTable(
  "events",
  {
    id: id(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    blurb: text("blurb"),
    description: text("description"),

    source: eventSourceEnum("source").default("own").notNull(),
    status: eventStatusEnum("status").default("draft").notNull(),
    visibility: eventVisibilityEnum("visibility").default("public").notNull(),

    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),

    city: text("city").notNull(),
    venueId: text("venue_id").references(() => venues.id, { onDelete: "set null" }),
    /** Free-form venue label when we don't have a venues row (curated/scraped). */
    venueLabel: text("venue_label"),
    addressLine: text("address_line"),

    promoterId: text("promoter_id").references(() => promoters.id, { onDelete: "set null" }),

    posterUrl: text("poster_url"),
    media: jsonb("media").$type<MediaItem[]>().default(sql`'[]'::jsonb`),
    genres: text("genres").array().$type<string[]>().default(sql`ARRAY[]::text[]`),
    tags: text("tags").array().$type<string[]>().default(sql`ARRAY[]::text[]`),

    /** Tickets in INR by tier. Empty array == free / RSVP-only. */
    tickets: jsonb("tickets").$type<EventTicket[]>().default(sql`'[]'::jsonb`),
    rsvpEnabled: boolean("rsvp_enabled").default(true).notNull(),
    rsvpCount: integer("rsvp_count").default(0).notNull(),
    capacity: integer("capacity"),
    sortOrder: integer("sort_order").default(0).notNull(),

    /** AI-scored quality (0–10) for curated/scraped events. */
    aiScore: integer("ai_score"),
    aiNotes: text("ai_notes"),

    /** Provenance for scraped events. */
    sourceUrl: text("source_url"),
    sourceMeta: jsonb("source_meta").$type<Record<string, unknown>>(),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("events_slug_idx").on(t.slug),
    index("events_status_idx").on(t.status),
    index("events_starts_idx").on(t.startsAt),
    index("events_city_idx").on(t.city),
    index("events_source_idx").on(t.source),
    index("events_promoter_idx").on(t.promoterId),
    index("events_visibility_idx").on(t.visibility),
  ]
);

export const eventLineups = pgTable(
  "event_lineups",
  {
    eventId: text("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    artistId: text("artist_id")
      .notNull()
      .references(() => artists.id, { onDelete: "cascade" }),
    role: lineupRoleEnum("role").default("support").notNull(),
    /** Display order within the event (smaller = top of the bill). */
    position: integer("position").default(0).notNull(),
    /** Free-form note shown on the event page (e.g. "live", "B2B with X"). */
    note: text("note"),
  },
  (t) => [
    primaryKey({ columns: [t.eventId, t.artistId] }),
    index("event_lineups_artist_idx").on(t.artistId),
    index("event_lineups_event_idx").on(t.eventId),
  ]
);

export const availabilityBlocks = pgTable(
  "availability_blocks",
  {
    id: id(),
    artistId: text("artist_id")
      .notNull()
      .references(() => artists.id, { onDelete: "cascade" }),
    startsOn: date("starts_on").notNull(),
    endsOn: date("ends_on").notNull(),
    kind: text("kind").default("available").notNull(), // available | hold | booked | unavailable
    note: text("note"),
    createdAt: createdAt(),
  },
  (t) => [
    index("availability_artist_idx").on(t.artistId),
    index("availability_range_idx").on(t.startsOn, t.endsOn),
  ]
);

export const posts = pgTable(
  "posts",
  {
    id: id(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    /** MDX-compatible markdown content. */
    body: text("body").notNull(),
    coverUrl: text("cover_url"),
    tags: text("tags").array().$type<string[]>().default(sql`ARRAY[]::text[]`),
    /** Optional author (folds into footer). */
    authorName: text("author_name"),
    authorUserId: text("author_user_id").references(() => user.id, { onDelete: "set null" }),

    status: postStatusEnum("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),

    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("posts_slug_idx").on(t.slug),
    index("posts_status_idx").on(t.status),
    index("posts_published_idx").on(t.publishedAt),
  ]
);

/**
 * Site-wide content / configuration the admin can edit:
 *   key = "homepage.hero" | "homepage.marquees" | "homepage.featured_events" |
 *         "homepage.featured_artists" | "scenes.bombay" | "playlists" | …
 */
export const siteContent = pgTable(
  "site_content",
  {
    key: text("key").primaryKey(),
    value: jsonb("value").$type<Record<string, unknown>>().notNull(),
    description: text("description"),
    updatedBy: text("updated_by").references(() => user.id, { onDelete: "set null" }),
    updatedAt: updatedAt(),
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. Activity
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Polymorphic interactions: RSVPs, follows, likes, shares, page-views, XP events.
 * One table replaces v1's user_event_interactions + xp_events + follows + saves.
 *
 * Anonymous interactions (e.g. RSVP from a guest) carry email/name in metadata,
 * not user_id.
 */
export const interactions = pgTable(
  "interactions",
  {
    id: id(),
    userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
    sessionFingerprint: text("session_fingerprint"),

    kind: interactionKindEnum("kind").notNull(),
    targetType: interactionTargetEnum("target_type").notNull(),
    targetId: text("target_id").notNull(),

    metadata: jsonb("metadata").$type<Record<string, unknown>>().default(sql`'{}'::jsonb`),

    createdAt: createdAt(),
  },
  (t) => [
    index("interactions_user_idx").on(t.userId),
    index("interactions_target_idx").on(t.targetType, t.targetId),
    index("interactions_kind_idx").on(t.kind),
    index("interactions_created_idx").on(t.createdAt),
  ]
);

/**
 * Generic email-capture: early access, newsletter, RSVP-as-guest, scene-specific
 * city alerts. The `tag` column makes one table serve every list.
 */
export const signups = pgTable(
  "signups",
  {
    id: id(),
    email: text("email").notNull(),
    name: text("name"),
    city: text("city"),
    tag: text("tag").notNull(), // newsletter | early_access | scene:bombay | event:slug | …
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: createdAt(),
  },
  (t) => [
    index("signups_email_idx").on(t.email),
    index("signups_tag_idx").on(t.tag),
    uniqueIndex("signups_email_tag_idx").on(t.email, t.tag),
  ]
);

/**
 * Promoter-submitted events queue. Once approved, an event row is created
 * in `events` and `submissionId` references it.
 */
export const submissions = pgTable(
  "submissions",
  {
    id: id(),
    submitterUserId: text("submitter_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    submitterEmail: text("submitter_email").notNull(),
    submitterName: text("submitter_name"),

    /** Raw payload mirrors the events table columns. Lives here until approved. */
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),

    status: submissionStatusEnum("status").default("pending").notNull(),
    reviewerNote: text("reviewer_note"),
    reviewedBy: text("reviewed_by").references(() => user.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),

    /** Set when the submission is approved → an event row is created. */
    eventId: text("event_id").references(() => events.id, { onDelete: "set null" }),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("submissions_status_idx").on(t.status),
    index("submissions_submitter_idx").on(t.submitterUserId),
  ]
);

/**
 * Artist booking pipeline. One row per (artist, requester) thread.
 * Messages live in JSONB; full thread view server-renders the array.
 */
export const bookings = pgTable(
  "bookings",
  {
    id: id(),
    artistId: text("artist_id")
      .notNull()
      .references(() => artists.id, { onDelete: "cascade" }),

    requesterUserId: text("requester_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    requesterEmail: text("requester_email").notNull(),
    requesterName: text("requester_name").notNull(),
    requesterCompany: text("requester_company"),
    requesterPhone: text("requester_phone"),

    eventTitle: text("event_title"),
    eventCity: text("event_city"),
    eventVenue: text("event_venue"),
    eventDate: date("event_date"),
    setLengthMinutes: integer("set_length_minutes"),
    feeBudgetMinor: integer("fee_budget_minor"), // INR paise
    currency: text("currency").default("INR").notNull(),

    status: bookingStatusEnum("status").default("draft").notNull(),
    messages: jsonb("messages").$type<BookingMessage[]>().default(sql`'[]'::jsonb`),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),

    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("bookings_artist_idx").on(t.artistId),
    index("bookings_status_idx").on(t.status),
    index("bookings_requester_idx").on(t.requesterUserId),
  ]
);

// ─────────────────────────────────────────────────────────────────────────────
// Relations (so RSC queries can use `with: { lineup: { artist: true } }`)
// ─────────────────────────────────────────────────────────────────────────────

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  ownedArtist: one(artists, { fields: [user.id], references: [artists.ownerUserId] }),
  ownedPromoter: one(promoters, { fields: [user.id], references: [promoters.ownerUserId] }),
  interactions: many(interactions),
  submissions: many(submissions),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const venueRelations = relations(venues, ({ many }) => ({
  events: many(events),
}));

export const promoterRelations = relations(promoters, ({ one, many }) => ({
  owner: one(user, { fields: [promoters.ownerUserId], references: [user.id] }),
  events: many(events),
}));

export const artistRelations = relations(artists, ({ one, many }) => ({
  owner: one(user, { fields: [artists.ownerUserId], references: [user.id] }),
  lineups: many(eventLineups),
  bookings: many(bookings),
  availability: many(availabilityBlocks),
}));

export const eventRelations = relations(events, ({ one, many }) => ({
  venue: one(venues, { fields: [events.venueId], references: [venues.id] }),
  promoter: one(promoters, { fields: [events.promoterId], references: [promoters.id] }),
  lineup: many(eventLineups),
  submission: one(submissions, { fields: [events.id], references: [submissions.eventId] }),
}));

export const eventLineupRelations = relations(eventLineups, ({ one }) => ({
  event: one(events, { fields: [eventLineups.eventId], references: [events.id] }),
  artist: one(artists, { fields: [eventLineups.artistId], references: [artists.id] }),
}));

export const availabilityRelations = relations(availabilityBlocks, ({ one }) => ({
  artist: one(artists, { fields: [availabilityBlocks.artistId], references: [artists.id] }),
}));

export const postRelations = relations(posts, ({ one }) => ({
  author: one(user, { fields: [posts.authorUserId], references: [user.id] }),
}));

export const interactionRelations = relations(interactions, ({ one }) => ({
  user: one(user, { fields: [interactions.userId], references: [user.id] }),
}));

export const submissionRelations = relations(submissions, ({ one }) => ({
  submitter: one(user, { fields: [submissions.submitterUserId], references: [user.id] }),
  reviewer: one(user, { fields: [submissions.reviewedBy], references: [user.id] }),
  event: one(events, { fields: [submissions.eventId], references: [events.id] }),
}));

export const bookingRelations = relations(bookings, ({ one }) => ({
  artist: one(artists, { fields: [bookings.artistId], references: [artists.id] }),
  requester: one(user, { fields: [bookings.requesterUserId], references: [user.id] }),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Inferred types
// ─────────────────────────────────────────────────────────────────────────────

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Verification = typeof verification.$inferSelect;
export type Venue = typeof venues.$inferSelect;
export type Promoter = typeof promoters.$inferSelect;
export type Artist = typeof artists.$inferSelect;
export type Event = typeof events.$inferSelect;
export type EventLineup = typeof eventLineups.$inferSelect;
export type AvailabilityBlock = typeof availabilityBlocks.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type SiteContent = typeof siteContent.$inferSelect;
export type Interaction = typeof interactions.$inferSelect;
export type Signup = typeof signups.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
