CREATE TYPE "public"."booking_status" AS ENUM('draft', 'sent', 'shortlisted', 'negotiating', 'confirmed', 'declined', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."event_source" AS ENUM('own', 'curated', 'submitted');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('draft', 'upcoming', 'live', 'past', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."event_visibility" AS ENUM('public', 'unlisted', 'private');--> statement-breakpoint
CREATE TYPE "public"."interaction_kind" AS ENUM('rsvp', 'follow_artist', 'follow_event', 'like_event', 'save_event', 'share', 'view', 'click', 'xp');--> statement-breakpoint
CREATE TYPE "public"."interaction_target" AS ENUM('event', 'artist', 'venue', 'post', 'promoter');--> statement-breakpoint
CREATE TYPE "public"."lineup_role" AS ENUM('headliner', 'support', 'b2b', 'host', 'selector', 'live');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('pending', 'approved', 'rejected', 'needs_changes');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('fan', 'artist', 'promoter', 'admin');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artists" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"real_name" text,
	"bio" text,
	"primary_city" text,
	"cities" text[] DEFAULT ARRAY[]::text[],
	"genres" text[] DEFAULT ARRAY[]::text[],
	"tags" text[] DEFAULT ARRAY[]::text[],
	"photo_url" text,
	"hero_url" text,
	"socials" jsonb,
	"audio_embeds" jsonb DEFAULT '[]'::jsonb,
	"discography" jsonb DEFAULT '[]'::jsonb,
	"milestones" jsonb DEFAULT '[]'::jsonb,
	"press" jsonb DEFAULT '[]'::jsonb,
	"social_stats" jsonb,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"owner_user_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "availability_blocks" (
	"id" text PRIMARY KEY NOT NULL,
	"artist_id" text NOT NULL,
	"starts_on" date NOT NULL,
	"ends_on" date NOT NULL,
	"kind" text DEFAULT 'available' NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"artist_id" text NOT NULL,
	"requester_user_id" text,
	"requester_email" text NOT NULL,
	"requester_name" text NOT NULL,
	"requester_company" text,
	"requester_phone" text,
	"event_title" text,
	"event_city" text,
	"event_venue" text,
	"event_date" date,
	"set_length_minutes" integer,
	"fee_budget_minor" integer,
	"currency" text DEFAULT 'INR' NOT NULL,
	"status" "booking_status" DEFAULT 'draft' NOT NULL,
	"messages" jsonb DEFAULT '[]'::jsonb,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_lineups" (
	"event_id" text NOT NULL,
	"artist_id" text NOT NULL,
	"role" "lineup_role" DEFAULT 'support' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"note" text,
	CONSTRAINT "event_lineups_event_id_artist_id_pk" PRIMARY KEY("event_id","artist_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"blurb" text,
	"description" text,
	"source" "event_source" DEFAULT 'own' NOT NULL,
	"status" "event_status" DEFAULT 'draft' NOT NULL,
	"visibility" "event_visibility" DEFAULT 'public' NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone,
	"city" text NOT NULL,
	"venue_id" text,
	"venue_label" text,
	"address_line" text,
	"promoter_id" text,
	"poster_url" text,
	"media" jsonb DEFAULT '[]'::jsonb,
	"genres" text[] DEFAULT ARRAY[]::text[],
	"tags" text[] DEFAULT ARRAY[]::text[],
	"tickets" jsonb DEFAULT '[]'::jsonb,
	"rsvp_enabled" boolean DEFAULT true NOT NULL,
	"rsvp_count" integer DEFAULT 0 NOT NULL,
	"capacity" integer,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"ai_score" integer,
	"ai_notes" text,
	"source_url" text,
	"source_meta" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interactions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"session_fingerprint" text,
	"kind" "interaction_kind" NOT NULL,
	"target_type" "interaction_target" NOT NULL,
	"target_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"body" text NOT NULL,
	"cover_url" text,
	"tags" text[] DEFAULT ARRAY[]::text[],
	"author_name" text,
	"author_user_id" text,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"seo_title" text,
	"seo_description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promoters" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL,
	"bio" text,
	"photo_url" text,
	"socials" jsonb,
	"owner_user_id" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signups" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"city" text,
	"tag" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_content" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"description" text,
	"updated_by" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"submitter_user_id" text,
	"submitter_email" text NOT NULL,
	"submitter_name" text,
	"payload" jsonb NOT NULL,
	"status" "submission_status" DEFAULT 'pending' NOT NULL,
	"reviewer_note" text,
	"reviewed_by" text,
	"reviewed_at" timestamp with time zone,
	"event_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" "user_role" DEFAULT 'fan' NOT NULL,
	"city" text,
	"bio" text,
	"socials" jsonb,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "venues" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL,
	"address_line" text,
	"geo_lat" text,
	"geo_lng" text,
	"capacity" integer,
	"description" text,
	"photo_url" text,
	"socials" jsonb,
	"is_partner" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artists" ADD CONSTRAINT "artists_owner_user_id_user_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability_blocks" ADD CONSTRAINT "availability_blocks_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_requester_user_id_user_id_fk" FOREIGN KEY ("requester_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_lineups" ADD CONSTRAINT "event_lineups_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_lineups" ADD CONSTRAINT "event_lineups_artist_id_artists_id_fk" FOREIGN KEY ("artist_id") REFERENCES "public"."artists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_promoter_id_promoters_id_fk" FOREIGN KEY ("promoter_id") REFERENCES "public"."promoters"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interactions" ADD CONSTRAINT "interactions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_user_id_user_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promoters" ADD CONSTRAINT "promoters_owner_user_id_user_id_fk" FOREIGN KEY ("owner_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "site_content" ADD CONSTRAINT "site_content_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_submitter_user_id_user_id_fk" FOREIGN KEY ("submitter_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_user_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "account_provider_idx" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE UNIQUE INDEX "artists_slug_idx" ON "artists" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "artists_city_idx" ON "artists" USING btree ("primary_city");--> statement-breakpoint
CREATE INDEX "artists_featured_idx" ON "artists" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "artists_owner_idx" ON "artists" USING btree ("owner_user_id");--> statement-breakpoint
CREATE INDEX "availability_artist_idx" ON "availability_blocks" USING btree ("artist_id");--> statement-breakpoint
CREATE INDEX "availability_range_idx" ON "availability_blocks" USING btree ("starts_on","ends_on");--> statement-breakpoint
CREATE INDEX "bookings_artist_idx" ON "bookings" USING btree ("artist_id");--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bookings_requester_idx" ON "bookings" USING btree ("requester_user_id");--> statement-breakpoint
CREATE INDEX "event_lineups_artist_idx" ON "event_lineups" USING btree ("artist_id");--> statement-breakpoint
CREATE INDEX "event_lineups_event_idx" ON "event_lineups" USING btree ("event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "events_status_idx" ON "events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "events_starts_idx" ON "events" USING btree ("starts_at");--> statement-breakpoint
CREATE INDEX "events_city_idx" ON "events" USING btree ("city");--> statement-breakpoint
CREATE INDEX "events_source_idx" ON "events" USING btree ("source");--> statement-breakpoint
CREATE INDEX "events_promoter_idx" ON "events" USING btree ("promoter_id");--> statement-breakpoint
CREATE INDEX "events_visibility_idx" ON "events" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "interactions_user_idx" ON "interactions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "interactions_target_idx" ON "interactions" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "interactions_kind_idx" ON "interactions" USING btree ("kind");--> statement-breakpoint
CREATE INDEX "interactions_created_idx" ON "interactions" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "posts_status_idx" ON "posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "posts_published_idx" ON "posts" USING btree ("published_at");--> statement-breakpoint
CREATE UNIQUE INDEX "promoters_slug_idx" ON "promoters" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "promoters_city_idx" ON "promoters" USING btree ("city");--> statement-breakpoint
CREATE INDEX "promoters_owner_idx" ON "promoters" USING btree ("owner_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "session_token_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "session_user_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "signups_email_idx" ON "signups" USING btree ("email");--> statement-breakpoint
CREATE INDEX "signups_tag_idx" ON "signups" USING btree ("tag");--> statement-breakpoint
CREATE UNIQUE INDEX "signups_email_tag_idx" ON "signups" USING btree ("email","tag");--> statement-breakpoint
CREATE INDEX "submissions_status_idx" ON "submissions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "submissions_submitter_idx" ON "submissions" USING btree ("submitter_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_role_idx" ON "user" USING btree ("role");--> statement-breakpoint
CREATE UNIQUE INDEX "venues_slug_idx" ON "venues" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "venues_city_idx" ON "venues" USING btree ("city");--> statement-breakpoint
CREATE INDEX "venues_partner_idx" ON "venues" USING btree ("is_partner");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");