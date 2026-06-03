const https = require("https");

const PAT = process.env.SUPABASE_PAT;
const PROJECT = process.env.SUPABASE_PROJECT_REF;

if (!PAT || !PROJECT) {
  console.error("Missing env vars. Run with:\n  SUPABASE_PAT=sbp_... SUPABASE_PROJECT_REF=xxxxxx node scripts/seed-via-api.js");
  process.exit(1);
}

function runSQL(sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const req = https.request(
      {
        hostname: "api.supabase.com",
        path: "/v1/projects/" + PROJECT + "/database/query",
        method: "POST",
        headers: {
          Authorization: "Bearer " + PAT,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300)
            resolve(JSON.parse(d));
          else
            reject(new Error("HTTP " + res.statusCode + ": " + d.slice(0, 400)));
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

const IDS = {
  v1: "11111111-0001-0001-0001-000000000001",
  v2: "11111111-0001-0001-0001-000000000002",
  v3: "11111111-0001-0001-0001-000000000003",
  p1: "22222222-0002-0002-0002-000000000001",
  a1: "33333333-0003-0003-0003-000000000001",
  a2: "33333333-0003-0003-0003-000000000002",
  a3: "33333333-0003-0003-0003-000000000003",
  a4: "33333333-0003-0003-0003-000000000004",
  e1: "44444444-0004-0004-0004-000000000001",
  e2: "44444444-0004-0004-0004-000000000002",
  e3: "44444444-0004-0004-0004-000000000003",
};

const d7 = new Date(Date.now() + 7 * 86400000);
d7.setHours(21, 0, 0, 0);
const d14 = new Date(Date.now() + 14 * 86400000);
d14.setHours(21, 0, 0, 0);
const d21 = new Date(Date.now() + 21 * 86400000);
d21.setHours(21, 0, 0, 0);
const d8 = new Date(d7.getTime() + 21600000);

const heroContent = JSON.stringify({
  eyebrow: "INDIA \u00b7 UNDERGROUND \u00b7 SINCE 2024",
  headline: "Cats Can Dance",
  subhead:
    "Underground electronic music, parties, and culture across India. Discover artists, events, and scenes.",
  ctas: [
    { label: "Find a party", href: "/events", variant: "primary" },
    { label: "Discover artists", href: "/artists", variant: "accent" },
    { label: "Explore scenes", href: "/discover", variant: "outline" },
  ],
});

const marqueeContent = JSON.stringify({
  above_about: {
    variant: "yellow",
    size: "md",
    items: [
      "WHO WE ARE",
      "BANGALORE UNDERGROUND",
      "A CULTURE BRAND",
      "DANCE \u00b7 PETS \u00b7 STREETWEAR",
    ],
  },
  above_events: {
    variant: "pink",
    size: "sm",
    reverse: true,
    items: ["EPISODE 01", "EPISODE 02", "CATCH US LIVE", "BANGALORE", "RSVP NOW"],
  },
});

// Escape single quotes for SQL
function sq(str) {
  return str.replace(/'/g, "''");
}

const sql = [
  // Venues
  "INSERT INTO venues (id, slug, name, city, capacity, description, is_partner, created_at, updated_at) VALUES" +
    " ('" + IDS.v1 + "', 'the-warehouse-bangalore', 'The Warehouse', 'Bangalore', 400, 'An industrial-grade dance floor in HSR. Function-1 sound system, no photos policy.', true, now(), now())," +
    " ('" + IDS.v2 + "', 'antisocial-mumbai', 'antiSOCIAL', 'Mumbai', 350, 'Khar West basement institution.', true, now(), now())," +
    " ('" + IDS.v3 + "', 'hilltop-vagator', 'Hilltop', 'Goa', 1200, 'Open-air, north Goa, sunset-into-sunrise.', false, now(), now())" +
    " ON CONFLICT (slug) DO NOTHING",

  // Promoters
  "INSERT INTO promoters (id, slug, name, city, bio, is_verified, created_at, updated_at) VALUES" +
    " ('" + IDS.p1 + "', 'ccd-bangalore', 'Cats Can Dance', 'Bangalore', 'House parents.', true, now(), now())" +
    " ON CONFLICT (slug) DO NOTHING",

  // Artists
  "INSERT INTO artists (id, slug, name, primary_city, cities, genres, bio, is_featured, is_verified, socials, created_at, updated_at) VALUES" +
    " ('" + IDS.a1 + "', 'malfnktion', 'MALFNKTION', 'Bangalore', ARRAY['Bangalore','Mumbai','Goa'], ARRAY['bass','breaks','footwork'], 'Bangalore''s bass weight ambassador. Two decades of selecting, producing, mentoring.', true, true, '{\"instagram\":\"https://instagram.com/malfnktion\"}', now(), now())," +
    " ('" + IDS.a2 + "', 'kaleekarma', 'Kaleekarma', 'Bangalore', ARRAY['Bangalore'], ARRAY['techno','house','minimal'], 'Bangalore selector with a taste for the deep end.', true, false, null, now(), now())," +
    " ('" + IDS.a3 + "', 'sickflip', 'Sickflip', 'Mumbai', ARRAY['Mumbai','Bangalore','Delhi'], ARRAY['bass','halftime','experimental'], 'India''s bass music architect.', true, false, null, now(), now())," +
    " ('" + IDS.a4 + "', 'zequenx', 'Zequenx', 'Goa', ARRAY['Goa','Mumbai'], ARRAY['techno','minimal'], 'Goa-based techno producer.', false, false, null, now(), now())" +
    " ON CONFLICT (slug) DO NOTHING",

  // Events
  "INSERT INTO events (id, slug, title, blurb, description, city, venue_id, promoter_id, status, source, starts_at, ends_at, genres, rsvp_enabled, ai_score, sort_order, created_at, updated_at) VALUES" +
    " ('" + IDS.e1 + "', 'episode-01-bangalore', 'EPISODE 01 \u2014 BANGALORE', 'MALFNKTION x Kaleekarma. Function-1. No photos.', 'Our first episode. A 6-hour journey from breaks to bass to techno. RSVP only.', 'Bangalore', '" + IDS.v1 + "', '" + IDS.p1 + "', 'upcoming', 'own', '" + d7.toISOString() + "', '" + d8.toISOString() + "', ARRAY['bass','breaks','techno'], true, 10, 1, now(), now())," +
    " ('" + IDS.e2 + "', 'episode-02-mumbai', 'EPISODE 02 \u2014 MUMBAI', 'Sickflip headlines. Bombay''s first proper bass night.', null, 'Mumbai', '" + IDS.v2 + "', '" + IDS.p1 + "', 'upcoming', 'own', '" + d21.toISOString() + "', null, ARRAY['bass','halftime'], true, 9, 2, now(), now())," +
    " ('" + IDS.e3 + "', 'sunset-sessions-goa', 'SUNSET SESSIONS', 'Open-air techno on the cliff.', null, 'Goa', '" + IDS.v3 + "', null, 'upcoming', 'curated', '" + d14.toISOString() + "', null, ARRAY['techno','minimal'], true, 8, 3, now(), now())" +
    " ON CONFLICT (slug) DO NOTHING",

  // Lineups
  "INSERT INTO event_lineups (event_id, artist_id, role, position) VALUES" +
    " ('" + IDS.e1 + "', '" + IDS.a1 + "', 'headliner', 0)," +
    " ('" + IDS.e1 + "', '" + IDS.a2 + "', 'support', 1)," +
    " ('" + IDS.e2 + "', '" + IDS.a3 + "', 'headliner', 0)," +
    " ('" + IDS.e3 + "', '" + IDS.a4 + "', 'headliner', 0)" +
    " ON CONFLICT DO NOTHING",

  // Posts
  "INSERT INTO posts (id, slug, title, excerpt, body, status, published_at, tags, created_at, updated_at) VALUES" +
    " (gen_random_uuid()::text, 'what-is-cats-can-dance', 'What is Cats Can Dance?', 'An ode to the underground we wish we had growing up.', '# What is Cats Can Dance?\\n\\nWe are a Bangalore-born culture company building India underground electronic music platform.', 'published', now(), ARRAY['manifesto'], now(), now())," +
    " (gen_random_uuid()::text, 'bangalore-underground-2026', 'The state of Bangalore underground in 2026', 'Function-1 systems, basement nights, and a generation that does not film.', '# Bangalore underground in 2026\\n\\nA scene report.', 'published', now(), ARRAY['scene-report','bangalore'], now(), now())" +
    " ON CONFLICT (slug) DO NOTHING",

  // Site content
  "INSERT INTO site_content (key, value, description, updated_at) VALUES" +
    " ('homepage.hero', '" + sq(heroContent) + "', 'Homepage hero section.', now())," +
    " ('homepage.marquees', '" + sq(marqueeContent) + "', 'Marquee strips on the homepage.', now())" +
    " ON CONFLICT (key) DO NOTHING",
];

async function main() {
  for (const statement of sql) {
    const label = statement.slice(0, 60).replace(/\n/g, " ");
    try {
      await runSQL(statement);
      console.log("✓", label);
    } catch (e) {
      console.error("✗", label, "\n  ERROR:", e.message);
      process.exit(1);
    }
  }
  console.log("\n✅ Seed complete!");
}

main();
