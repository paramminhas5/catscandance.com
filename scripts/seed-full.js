/**
 * seed-full.js — ports all CCD source data into the new Drizzle schema
 * Run: SUPABASE_PAT=sbp_... SUPABASE_PROJECT_REF=... node scripts/seed-full.js
 */
const https = require("https");

const PAT = process.env.SUPABASE_PAT;
const PROJECT = process.env.SUPABASE_PROJECT_REF;

if (!PAT || !PROJECT) {
  console.error("Usage: SUPABASE_PAT=sbp_... SUPABASE_PROJECT_REF=xxx node scripts/seed-full.js");
  process.exit(1);
}

function runSQL(label, sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const req = https.request(
      {
        hostname: "api.supabase.com",
        path: `/v1/projects/${PROJECT}/database/query`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAT}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let d = "";
        res.on("data", (c) => (d += c));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const r = JSON.parse(d);
            console.log(`  ✓ ${label} (${Array.isArray(r) ? r.length : "ok"} rows)`);
            resolve(r);
          } else {
            reject(new Error(`HTTP ${res.statusCode} [${label}]: ${d.slice(0, 300)}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}


// ── IDs ──────────────────────────────────────────────────────
const V = {
  indiranagar_social: "v0000001-0000-0000-0000-000000000001",
  social_blr:         "v0000001-0000-0000-0000-000000000002",
  bar_wild:           "v0000001-0000-0000-0000-000000000003",
  antisocial_bandra:  "v0000001-0000-0000-0000-000000000004",
  tba_large:          "v0000001-0000-0000-0000-000000000005",
};
const P = {
  ccd:   "p0000001-0000-0000-0000-000000000001",
  krunk: "p0000001-0000-0000-0000-000000000002",
  dnb:   "p0000001-0000-0000-0000-000000000003",
  qilla: "p0000001-0000-0000-0000-000000000004",
};
const E = {
  bar_wild_ep1:   "e0000001-0000-0000-0000-000000000001",
  ccdxsocial_01:  "e0000001-0000-0000-0000-000000000002",
  ccdxsocial_02:  "e0000001-0000-0000-0000-000000000003",
  ccdxsocial_03:  "e0000001-0000-0000-0000-000000000004",
  ccdxsocial_mega:"e0000001-0000-0000-0000-000000000005",
};

// Artist IDs — deterministic
const A = {};
const ARTIST_SLUGS = [
  "startdawg","merman","kohra","nikki-nair","indo-warehouse","sandunes",
  "dualist-inquiry","dotdat","lost-stories","bullzeye","sickflip","ak-sports",
  "kandy-kuri","sheral","prismer","girls-night-out","midnight-traffic","suchi",
  "murthovic","dj-sartek","anish-sood","monophonik","kaleekarma","sid-vashi",
  "karan-kanchan","komorebi","prabh-deep","hamza-rahimtula","jatayu","the-f16s",
  "madame-gandhi","sunju-hargun","lush-lata","yung-raj","spryk","jbabe",
  "stalvart-john","chrms","dreamstates","mogasu","bawra","shantam",
  "weird-sounding-dude","long-distances","dj-ravetek","project-91","dj-ravator",
];
ARTIST_SLUGS.forEach((s, i) => {
  const n = String(i + 1).padStart(8, "0");
  A[s] = `a${n}-0000-0000-0000-${n}${n}`;
});


// ── Date helpers ─────────────────────────────────────────────
const d = (y, m, day, h = 21) => new Date(Date.UTC(y, m - 1, day, h - 5, 30)).toISOString(); // IST→UTC

async function main() {
  console.log("\n🌱  CCD Full Seed — Supabase\n");

  // ── 1. CLEAR OLD STUB DATA ──────────────────────────────
  console.log("§0  Clearing stub seed data…");
  await runSQL("clear events",       "DELETE FROM events WHERE id LIKE '4%'");
  await runSQL("clear artists",      "DELETE FROM artists WHERE id LIKE '3%'");
  await runSQL("clear venues",       "DELETE FROM venues WHERE id LIKE '1%'");
  await runSQL("clear promoters",    "DELETE FROM promoters WHERE id LIKE '2%'");
  await runSQL("clear event_lineups","DELETE FROM event_lineups WHERE 1=1");
  await runSQL("clear posts",        "DELETE FROM posts WHERE 1=1");
  await runSQL("clear site_content", "DELETE FROM site_content WHERE 1=1");

  // ── 2. VENUES ───────────────────────────────────────────
  console.log("\n§1  Venues…");
  await runSQL("venues", `
    INSERT INTO venues (id, slug, name, city, capacity, description, is_partner, created_at, updated_at) VALUES
      ('${V.indiranagar_social}','indiranagar-social','Indiranagar Social','Bengaluru',300,'Bengaluru''s landmark outdoor Social venue in Indiranagar. Wide outdoor space, pet-friendly, central location.',true,now(),now()),
      ('${V.social_blr}','social-blr','Social BLR','Bengaluru',400,'Social BLR Koramangala. Larger format outdoor venue for the series finale chapters.',true,now(),now()),
      ('${V.bar_wild}','bar-wild','Bar Wild','Bengaluru',200,'Intimate bar in Indiranagar that hosted the first ever Cats Can Dance episode in April 2025. Where it all started.',true,now(),now()),
      ('${V.antisocial_bandra}','antisocial-bandra','antiSOCIAL Bandra','Mumbai',350,'Khar West basement institution. Mumbai''s most consistent underground room.',true,now(),now()),
      ('${V.tba_large}','tba-large-format','TBA — Large Format','Bengaluru',2000,'Venue TBA for the MEGA season finale. Outdoor, large capacity.',false,now(),now())
    ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, capacity=EXCLUDED.capacity, updated_at=now()
  `);


  // ── 3. PROMOTERS ────────────────────────────────────────
  console.log("\n§2  Promoters…");
  await runSQL("promoters", `
    INSERT INTO promoters (id, slug, name, city, bio, is_verified, created_at, updated_at) VALUES
      ('${P.ccd}',  'cats-can-dance','Cats Can Dance','Bengaluru','India''s first pet-friendly dance music series. Underground selectors, outdoor pet zones, intimate rooms.',true,now(),now()),
      ('${P.krunk}','krunk','Krunk','Mumbai','Founded in 2009, Krunk is one of India''s oldest and most respected booking agencies. Architects of Bass Camp Festival and Echoes of Earth. 2,000+ events.',true,now(),now()),
      ('${P.dnb}',  'drum-and-bass-india','Drum and Bass India','Bengaluru','India''s longest-running D&B and Jungle collective. Running DnBIndia × SOCIAL nights and regular underground sessions.',true,now(),now()),
      ('${P.qilla}','qilla-records','Qilla Records','Delhi','Founded by Madhav Shorey (Kohra). The label and collective at the heart of India''s techno scene. Internationally connected — Tresor, Berghain, Movement.',true,now(),now())
    ON CONFLICT (slug) DO UPDATE SET name=EXCLUDED.name, bio=EXCLUDED.bio, updated_at=now()
  `);


  // ── 4. ARTISTS (47 artists from source) ─────────────────
  console.log("\n§3  Artists…");

  // Build values string — map old schema fields to new schema
  const artists = [
    // slug, name, primaryCity, genres[], bio, isFeatured, isVerified, socials{}, photoUrl
    ["startdawg","STARTDAWG","Bengaluru",["House","Disco","Garage","Funk"],"Bangalore staple. House selector with a soft spot for disco edits and the long build. CCD resident DJ — co-founder of the CCD × SOCIAL series. Plays Bar Wild, Social, and underground club nights across the city. Headlined CCD at Bar Wild in April 2025 and returns to Indiranagar Social for CCDXSOCIAL 01 on 29 Jun 2026.",true,true,{instagram:"startdawg"}],
    ["merman","MERMAN","Bengaluru",["Garage","Jungle","D&B","Bass"],"Garage, jungle, and the kind of low-end that fixes posture problems. CCD resident DJ — co-founder of the CCD × SOCIAL series alongside Startdawg. Known for sets that move through UK Garage, Jungle and the darker end of D&B with conviction and taste. B2b partner at every CCD episode.",true,true,{instagram:"mermanblr"}],
    ["kohra","KOHRA","New Delhi",["Techno","House","Minimal"],"Most Boiler Room appearances by an Indian solo electronic artist. Founder of Qilla Records and the defining voice of India's credible techno scene for over a decade. Performed at Tresor Berlin, Watergate, Movement Detroit, Magnetic Fields, DGTL, and Echoes of Earth. The standard-setter.",true,true,{instagram:"kohra",website:"https://artistivity.com"}],
    ["nikki-nair","NIKKI NAIR","USA",["Breakbeat","Techno","Electro"],"Most booked Indian-origin producer in the global underground. Boiler Room Hyderabad 2022. Dekmantel, Movement Detroit, fabric London, Drumsheds. Pure electronic — no Bollywood, no EDM. Represents Indian-origin talent at the highest level.",true,false,{instagram:"nikkinair"}],
    ["indo-warehouse","INDO WAREHOUSE","New York",["Indo House","Melodic Techno"],"First South Asian electronic collective at Coachella 2025 (both weekends). Coined 'Indo House' — a globally recognised genre blending Indian classical and folk with house and techno. Also played Hï Ibiza and F1 Singapore GP. The biggest Indian electronic export right now.",true,false,{instagram:"indowarehouse",website:"https://indowarehouse.com"}],
    ["sandunes","SANDUNES","Mumbai",["Electronic","Experimental","Live"],"Mumbai-based producer, keyboardist, and DJ. Headlined the first Boiler Room India in Mumbai in 2019. Apple Music Up Next Artist 2022. Red Bull Music Academy BaseCamp Dubai. OneBeat Residency USA. NH7 Weekender regular. One of the most critically recognised voices in contemporary Indian electronic music.",true,false,{instagram:"sandunesmusic"}],
    ["dualist-inquiry","DUALIST INQUIRY","Goa",["Indie Electronic","Experimental"],"Goa-based producer and live performer (Sahej Bakshi). A defining voice in India's indie electronic scene since the early 2010s. Founder of Field Works label. Lollapalooza India 2024 as an 8-piece live A/V show. Echoes of Earth, Ziro Festival 2025.",false,false,{instagram:"dualistinquiry",website:"https://intersect9.in"}],
    ["dotdat","DOTDAT","Goa",["Techno"],"Goa-based techno DJ and producer committed to the harder, more industrial textures of contemporary techno. Watergate Berlin, Womb Tokyo, Sonar Barcelona, Echoes of Earth 2025 — bringing a European-grade approach to South Asian dancefloors.",false,false,{instagram:"dotdatofficial",website:"https://oddx.in"}],
    ["lost-stories","LOST STORIES","Mumbai",["Indian Folk Electronic","Progressive House"],"Pioneers of Indian folk-electronic fusion. Hits 'Mahi', 'Bombay Dreams'. Spinnin' Records artists. Tomorrowland 2018 main stage. DGTL, Lollapalooza India, Sunburn regulars. India's most consistent festival headliners with 500K+ followers.",true,false,{instagram:"loststoriesmusic"}],
    ["bullzeye","BULLZEYE","India",["Techno","House"],"One of the most-booked DJs in India. The only Indian DJ to play the Ellum Audio showcase in Goa. Played alongside Carl Cox, Dixon, Nina Kraviz, and Maceo Plex. Paradiso Amsterdam, Feel Festival Berlin, Ritter Butzke Berlin. DGTL 2025, Sunburn, VH1 Supersonic headliner.",false,false,{instagram:"bullzeye"}],
    ["sickflip","SICKFLIP","Bengaluru",["Bass","Jungle","Electronic"],"Bengaluru-based DJ and producer known for energetic, bass-heavy sets spanning jungle, house, and bass music. Managed by Across Artists. NH7 Weekender, DGTL circuit. Strong South Indian bass scene following.",false,false,{instagram:"sickflip",website:"https://acrossartists.com"}],
    ["ak-sports","AK SPORTS","India",["Electronic","Techno"],"Appeared at both Boiler Room Bengaluru and Boiler Room Delhi NCR in June 2024 — one of the few Indian artists featured at multiple Boiler Room India 2024 dates. Magnetic Fields regular. New generation breaking into global platforms.",false,false,{instagram:"aksports"}],
    ["kandy-kuri","KANDY KURI","Bengaluru",["Electronic","House"],"Bengaluru-based DJ who appeared at Boiler Room Bengaluru in 2024, representing South India at the global livestream platform. Magnetic Fields regular. Sets navigate deep, functional electronics.",false,false,{instagram:"kandykuri"}],
    ["sheral","SHERAL","Delhi",["Techno","Electronic"],"Rising DJ and producer who performed at Boiler Room Delhi NCR in June 2024. Among a select group of Indian women commanding international platform exposure. Sets navigate the intersection of driving techno and atmospheric electronics.",false,false,{instagram:"sheral"}],
    ["prismer","PRISMER","India",["Electronic"],"Emerging Indian electronic producer. Boiler Room Delhi NCR 2024. Magnetic Fields regular. Melodic and atmospheric electronic music from the new wave of Indian producers.",false,false,{instagram:"prismer"}],
    ["girls-night-out","GIRLS NIGHT OUT","India",["Electronic"],"Indian electronic collective pushing the underground sound forward. Boiler Room Delhi NCR 2024. Community-driven ethos, challenging the male-dominated landscape of Indian electronic music.",false,false,{}],
    ["midnight-traffic","MIDNIGHT TRAFFIC","Hyderabad",["Electronic","House"],"Active Hyderabad electronic duo who performed at Boiler Room Hyderabad in May 2022. One of the first acts from the city to gain global platform exposure. Key figures in South Indian underground music.",false,false,{instagram:"midnighttraffic"}],
    ["suchi","SUCHI","India",["Electronic"],"Early Indian electronic artist to get a Boiler Room platform. Boiler Room Hyderabad 2022. Krunk events regular.",false,false,{}],
    ["murthovic","MURTHOVIC","India",["Electronic"],"Part of India's original Boiler Room class. Boiler Room Hyderabad 2022. Magnetic Fields multiple-year regular.",false,false,{instagram:"murthovic"}],
    ["dj-sartek","DJ SARTEK","New Delhi",["Folk House","Desi Techno","Progressive"],"First Indian on Hardwell's Revealed Recordings. All releases on Beatport Top 100. Opened for David Guetta, Martin Garrix, Tiësto, Steve Aoki. Meta Awards winner 2024.",false,false,{instagram:"sartek",website:"https://sartekmusic.in"}],
    ["anish-sood","ANISH SOOD","Goa",["Progressive Trance","Deep House"],"The only Indian on Anjunadeep (UK). Credible progressive sound, not commercial EDM. Performed alongside David Guetta, Kygo, Tiësto. 15+ years experience. Also known as Anyasa.",false,false,{instagram:"anyasa.music",website:"https://anyasa.com"}],
    ["monophonik","MONOPHONIK","India",["Analog Synth","Electronic"],"Analog synth enthusiast. Magnetic Fields (multiple years), DGTL, Lollapalooza regular. Qilla Records artist. Hardware-focused experimental performances with a distinctive presence on the underground circuit.",false,false,{instagram:"monophonik"}],
    ["kaleekarma","KALEEKARMA","India",["Electronic","House"],"Magnetic Fields multiple-year regular. Part of India's forward-thinking electronic community at Alsisar. Deep, functional electronics.",false,false,{instagram:"kaleekarma"}],
    ["sid-vashi","SID VASHI","Mumbai",["Jazz","Electronic","Experimental"],"Trained jazz saxophonist and electronic producer. Signed to Only Much Louder (OML). Lollapalooza India 2025. One of India's most distinctive electronic voices for listeners who want depth alongside rhythm.",false,false,{instagram:"sidvashi"}],
    ["karan-kanchan","KARAN KANCHAN","Mumbai",["Hip-Hop","Electronic","Beats"],"Beatmaker and producer bridging hip-hop and electronic. Lollapalooza India 2024. Battleground Mobile India composer. 100K+ followers.",false,false,{instagram:"karankanchan",website:"https://karankanchan.com"}],
    ["komorebi","KOMOREBI","India",["Electronic","Indie"],"Singer-producer (Tarana Marwah) bridging electronic and indie. Lollapalooza India 2024. NH7 Weekender performer. Dreamy, layered electronic soundscapes.",false,false,{instagram:"komorebimind"}],
    ["prabh-deep","PRABH DEEP","New Delhi",["Hip-Hop","Electronic"],"Delhi-based rapper and producer. Azadi Records. One of India's most uncompromising independent hip-hop voices. Lollapalooza India 2024, NH7 Weekender, Echoes of Earth.",false,false,{website:"https://azadirecords.com"}],
    ["hamza-rahimtula","HAMZA RAHIMTULA","India",["Folk","Electronic","House"],"Indian DJ and music curator known for eclectic genre-spanning sets. Echoes of Earth multiple years. Magnetic Fields regular. Deep knowledge of global dance music history.",false,false,{instagram:"hamzarahimtula"}],
    ["jatayu","JATAYU","Chennai",["Carnatic Jazz","Funk","Electronic"],"Chennai band expanding to six-piece with horns. Carnatic foundations with funk, rock, jazz, and math rock. Lollapalooza India 2024 and Echoes of Earth 2025.",false,false,{instagram:"jatayu"}],
    ["the-f16s","THE F16s","Chennai",["Rock","Electronic"],"Chennai rock act with electronic elements. Echoes of Earth 2025. NH7 Weekender regular.",false,false,{instagram:"thef16s"}],
    ["madame-gandhi","MADAME GANDHI","USA",["Electronic","Percussion"],"Indian-origin producer and drummer (Kiran Gandhi). Rhythm-driven sets tied to empowerment and activism. Echoes of Earth 2025.",false,false,{instagram:"madamegandhi"}],
    ["sunju-hargun","SUNJU HARGUN","India",["Electronic"],"Magnetic Fields multiple-year regular. Part of India's forward-thinking electronic scene.",false,false,{instagram:"sunjuhargun"}],
    ["lush-lata","LUSH LATA","India",["Electronic"],"Magnetic Fields regular.",false,false,{instagram:"lushlata"}],
    ["yung-raj","YUNG.RAJ","India",["Electronic","Hip-Hop"],"Part of India's electronic and hip-hop crossover scene. Magnetic Fields, NH7 Weekender.",false,false,{instagram:"yung.raj"}],
    ["spryk","SPRYK","India",["Electronic"],"Part of India's electronic scene. Magnetic Fields, Lollapalooza 2025.",false,false,{instagram:"spryk"}],
    ["jbabe","JBABE","India",["Electronic"],"Part of India's electronic community. Magnetic Fields, Lollapalooza 2024.",false,false,{instagram:"jbabe"}],
    ["stalvart-john","STALVART JOHN","India",["Electronic","House"],"Part of India's electronic DJ-producer community. Lollapalooza 2024.",false,false,{instagram:"stalvartjohn"}],
    ["chrms","CHRMS","India",["Future Bass","Electro"],"Future bass and electro producer. Lollapalooza 2024, NH7 Weekender. Krunk affiliated.",false,false,{instagram:"chrms"}],
    ["dreamstates","DREAMSTATES","India",["Electronic","Psychedelic"],"Psychedelic electronic producer. DGTL India 2025, Echoes of Earth.",false,false,{instagram:"dreamstates"}],
    ["mogasu","MOGASU","India",["Electronic"],"Part of DGTL India 2025 and Echoes of Earth 2024 lineup.",false,false,{instagram:"mogasu"}],
    ["bawra","BAWRA","India",["Electronic"],"Part of DGTL India 2025 domestic lineup.",false,false,{instagram:"bawra"}],
    ["shantam","SHANTAM","India",["Electronic"],"Part of India's electronic scene. Echoes of Earth 2024, Magnetic Fields regular.",false,false,{instagram:"shantam"}],
    ["weird-sounding-dude","WEIRD SOUNDING DUDE","India",["Electronic","House"],"Part of India's electronic producer community. Echoes of Earth 2024.",false,false,{instagram:"weirdsoundingdude"}],
    ["long-distances","LONG DISTANCES","Mumbai",["Post-Punk","Shoegaze","Electronic"],"Mumbai post-punk and shoegaze band with electronic elements. Lollapalooza India 2024, Echoes of Earth 2025.",false,false,{instagram:"longdistances"}],
    ["dj-ravetek","DJ RAVETEK","Mumbai",["EDM","Big Room"],"First Indian signed to Tiësto's Musical Freedom label. Shared stage with the world's top DJs. Rare achievement for an Indian artist.",false,false,{instagram:"theartisteco"}],
    ["project-91","PROJECT 91","Pune",["EDM","House"],"India's most credible electronic duo on international labels — Revealed Recordings, Generation Smash. Performed in 8 countries.",false,false,{instagram:"project91music"}],
    ["dj-ravator","DJ RAVATOR","New Delhi",["Independent","EDM","Bass"],"Represents India's independent artist movement. Delhi underground electronic scene. DGTL circuit.",false,false,{instagram:"saprasap",website:"https://sapwroks.co"}],
  ];


  const artistRows = artists.map(([slug, name, city, genres, bio, featured, verified, socials]) => {
    const id = A[slug] || `a${slug.replace(/[^a-z0-9]/g,"").slice(0,8).padEnd(8,"0")}-0000-0000-0000-${"0".repeat(12)}`;
    const g = genres.map(x => `'${x.replace(/'/g,"''")}'`).join(",");
    const socialJson = JSON.stringify(socials).replace(/'/g,"''");
    const bioEsc = (bio||"").replace(/'/g,"''");
    const nameEsc = name.replace(/'/g,"''");
    const cityEsc = (city||"India").replace(/'/g,"''");
    return `('${id}','${slug}','${nameEsc}','${bioEsc}','${cityEsc}',ARRAY[${g}],NULL,${featured},${verified},'${socialJson}',now(),now())`;
  });

  // Insert in batches of 10
  for (let i = 0; i < artistRows.length; i += 10) {
    const batch = artistRows.slice(i, i + 10);
    await runSQL(`artists batch ${i/10+1}`, `
      INSERT INTO artists (id,slug,name,bio,primary_city,genres,photo_url,is_featured,is_verified,socials,created_at,updated_at)
      VALUES ${batch.join(",")}
      ON CONFLICT (slug) DO UPDATE SET
        name=EXCLUDED.name, bio=EXCLUDED.bio, primary_city=EXCLUDED.primary_city,
        genres=EXCLUDED.genres, is_featured=EXCLUDED.is_featured,
        is_verified=EXCLUDED.is_verified, socials=EXCLUDED.socials, updated_at=now()
    `);
  }


  // ── 5. EVENTS ────────────────────────────────────────────
  console.log("\n§4  Events…");
  await runSQL("events", `
    INSERT INTO events (id,slug,title,blurb,description,city,venue_id,promoter_id,status,source,starts_at,ends_at,genres,tags,rsvp_enabled,sort_order,created_at,updated_at)
    VALUES
      ('${E.bar_wild_ep1}','episode-1','CCD AT BAR WILD',
       'The first Cats Can Dance episode. House, disco, garage, and the kind of floor that makes you forget what time it is. Startdawg and Merman held it down from open to close.',
       'The night that started everything. April 2025, Bar Wild, Indiranagar. A small room, a full floor, and six hours of music that Bengaluru''s underground had been waiting for.',
       'Bengaluru','${V.bar_wild}','${P.ccd}','past','own',
       '${d(2025,4,2,21)}','${d(2025,4,3,3)}',
       ARRAY['House','Disco','Garage'],ARRAY['ccd-resident','intimate','pet-friendly'],
       false,0,now(),now()),

      ('${E.ccdxsocial_01}','ccdxsocial-01','CCDXSOCIAL 01',
       'The first chapter of CCD × SOCIAL. Wide open — portrait booth, lookalike contest, vendor market all afternoon. Startdawg b2b Merman take the floor at 9. The pack meets for the first time.',
       'India''s first curated pet lifestyle series meets underground dance music. Outdoor pet zone from 4 PM, vendor market, portrait booth. Six hours of house, disco, garage, and D&B.',
       'Bengaluru','${V.indiranagar_social}','${P.ccd}','upcoming','own',
       '${d(2026,6,29,21)}',NULL,
       ARRAY['House','Disco','Garage'],ARRAY['ccdxsocial','pet-friendly','series'],
       true,10,now(),now()),

      ('${E.ccdxsocial_02}','ccdxsocial-02','CCDXSOCIAL 02',
       'The style chapter. Live grooming demo on stage, best-dressed contest for pets and parents, dedicated photography corner. Startdawg b2b Merman bring the floor into the night.',
       'Midsummer, outdoors, everyone at their best. The second chapter of the CCD × SOCIAL series — the style edition. Live grooming demo, best-dressed contest, photography corner. Startdawg b2b Merman take the floor at 9.',
       'Bengaluru','${V.social_blr}','${P.ccd}','upcoming','own',
       '${d(2026,7,27,21)}',NULL,
       ARRAY['House','Disco'],ARRAY['ccdxsocial','pet-friendly','series','style'],
       true,20,now(),now()),

      ('${E.ccdxsocial_03}','ccdxsocial-03','CCDXSOCIAL 03',
       'The most physical show. Two agility courses, timed speed runs, performance contest. MEGA tickets drop exclusively at this show. Startdawg b2b Merman one last time before the finale.',
       'Chapter three. The agility edition. Two full courses, timed speed runs, performance contest open to any breed. MEGA tickets drop exclusively at this show. The biggest floor yet.',
       'Bengaluru','${V.social_blr}','${P.ccd}','upcoming','own',
       '${d(2026,8,30,21)}',NULL,
       ARRAY['House','Jungle','Garage'],ARRAY['ccdxsocial','pet-friendly','series','agility'],
       true,30,now(),now()),

      ('${E.ccdxsocial_mega}','ccdxsocial-mega','MEGA',
       'Everything the series has been building to. Full outdoor stage. 2,000+ people. Pet runway. Agility finals. The whole pack in one place.',
       'The CCD × SOCIAL season finale. Everything we''ve been building to since April 2025. Full outdoor stage, 2,000+ people, pet runway, agility finals, complete DJ lineup TBA. The whole pack in one place.',
       'Bengaluru','${V.tba_large}','${P.ccd}','upcoming','own',
       '${d(2026,10,1,18)}',NULL,
       ARRAY['House','Disco','Jungle','Garage'],ARRAY['ccdxsocial','pet-friendly','series','finale','mega'],
       true,40,now(),now())

    ON CONFLICT (slug) DO UPDATE SET
      title=EXCLUDED.title, blurb=EXCLUDED.blurb, description=EXCLUDED.description,
      status=EXCLUDED.status, starts_at=EXCLUDED.starts_at, tags=EXCLUDED.tags,
      genres=EXCLUDED.genres, sort_order=EXCLUDED.sort_order, updated_at=now()
  `);


  // ── 6. LINEUPS ──────────────────────────────────────────
  console.log("\n§5  Event lineups…");
  await runSQL("lineups", `
    INSERT INTO event_lineups (event_id, artist_id, role, position, note) VALUES
      ('${E.bar_wild_ep1}', '${A["startdawg"]}', 'headliner', 0, 'b2b with Merman · open to close'),
      ('${E.bar_wild_ep1}', '${A["merman"]}',    'headliner', 1, 'b2b with Startdawg · open to close'),
      ('${E.ccdxsocial_01}','${A["startdawg"]}', 'headliner', 0, 'b2b with Merman from 9 PM'),
      ('${E.ccdxsocial_01}','${A["merman"]}',    'headliner', 1, 'b2b with Startdawg from 9 PM'),
      ('${E.ccdxsocial_02}','${A["startdawg"]}', 'headliner', 0, 'b2b with Merman'),
      ('${E.ccdxsocial_02}','${A["merman"]}',    'headliner', 1, 'b2b with Startdawg'),
      ('${E.ccdxsocial_03}','${A["startdawg"]}', 'headliner', 0, 'b2b with Merman'),
      ('${E.ccdxsocial_03}','${A["merman"]}',    'headliner', 1, 'b2b with Startdawg'),
      ('${E.ccdxsocial_mega}','${A["startdawg"]}','headliner',0, 'Full lineup TBA'),
      ('${E.ccdxsocial_mega}','${A["merman"]}',   'headliner',1, 'Full lineup TBA')
    ON CONFLICT DO NOTHING
  `);


  // ── 7. POSTS ─────────────────────────────────────────────
  console.log("\n§6  Posts…");
  await runSQL("posts", `
    INSERT INTO posts (id,slug,title,excerpt,body,status,published_at,tags,author_name,created_at,updated_at) VALUES
      (gen_random_uuid()::text,'what-is-cats-can-dance','What is Cats Can Dance?',
       'An ode to the underground we wish we had growing up.',
       E'# What is Cats Can Dance?\n\nWe''re a Bangalore-born culture company building India''s underground electronic music platform. We started because we wanted a night where the music was right, the room was right, and your dog was allowed in.\n\nCats Can Dance is about three things: **music**, **pets**, and **culture**. The music is underground — house, disco, garage, jungle, D&B. The pets are welcome everywhere. The culture is ours to build.\n\nWe launched with Episode 1 at Bar Wild in April 2025. CCDXSOCIAL is the series. MEGA is the season finale.\n\nSee you on the floor.',
       'published',now(),ARRAY['manifesto','about'],'CCD',now(),now()),

      (gen_random_uuid()::text,'bangalore-underground-2026','The state of Bangalore''s underground in 2026',
       'Function-1 systems, basement nights, and a generation that doesn''t film.',
       E'# Bangalore''s underground in 2026\n\nSomething shifted in Bangalore''s electronic music scene around 2024. The rooms got smaller, the sound systems got better, and the crowd stopped filming.\n\nBar Wild started it. Counterculture kept it going. Now CCDXSOCIAL is taking it outside — pets, vendors, proper sound, wide-open space.\n\nThe scene report: four cities, twenty-odd promoters, and a generation of selectors who grew up on Boiler Room and learned the difference between house and tech-house before they turned twenty.\n\nHere''s where things stand.',
       'published',now(),ARRAY['scene-report','bangalore','editorial'],'CCD',now(),now()),

      (gen_random_uuid()::text,'ccdxsocial-series-explainer','CCD × SOCIAL: Why Pet-Friendly Underground?',
       'The thinking behind India''s first pet-friendly dance music series.',
       E'# CCD × SOCIAL: the thinking\n\nEvery city has its underground. Bengaluru''s has always been basement bars and late nights. But we kept asking: what if it was outside? What if you could bring your dog?\n\nCCDXSOCIAL is the answer. Four shows across a season. Outdoor venues, proper sound, afternoon pet zones, night floor. The music is the same — house, disco, garage, jungle. The difference is who''s invited.\n\nEpisode 01: Jun 29, Indiranagar Social. Startdawg b2b Merman from 9 PM.\n\nRSVP is free. Bring your pack.',
       'published',now(),ARRAY['series','ccdxsocial','pet-friendly'],'CCD',now(),now())
    ON CONFLICT (slug) DO NOTHING
  `);


  // ── 8. SITE CONTENT ──────────────────────────────────────
  console.log("\n§7  Site content…");
  await runSQL("site_content", `
    INSERT INTO site_content (key, value, description, updated_at) VALUES
      ('homepage.hero', '${JSON.stringify({
        eyebrow: "INDIA · UNDERGROUND · SINCE 2024",
        headline: "Cats Can Dance",
        subhead: "Underground electronic music, parties, and culture across India. House, Disco, Jungle, Garage — and your pets are welcome.",
        ctas: [
          { label: "Find a party", href: "/events", variant: "primary" },
          { label: "Discover artists", href: "/artists", variant: "accent" },
          { label: "Explore scenes", href: "/discover", variant: "outline" },
        ],
      }).replace(/'/g,"''")}', 'Homepage hero section', now()),

      ('homepage.stats', '${JSON.stringify({
        events: 5,
        artists: 47,
        cities: 6,
        rsvps: 0,
      }).replace(/'/g,"''")}', 'Homepage stat counters', now()),

      ('homepage.marquees', '${JSON.stringify({
        above_about: { variant: "yellow", items: ["WHO WE ARE","BANGALORE UNDERGROUND","A CULTURE BRAND","DANCE · PETS · STREETWEAR","SINCE 2024"] },
        above_events: { variant: "pink", reverse: true, items: ["CCDXSOCIAL 01","29 JUN 2026","INDIRANAGAR SOCIAL","STARTDAWG B2B MERMAN","FREE RSVP","9 PM SHARP","PETS WELCOME"] },
      }).replace(/'/g,"''")}', 'Marquee strips on the homepage', now()),

      ('series.ccdxsocial', '${JSON.stringify({
        label: "CCD × SOCIAL",
        tagline: "India's first curated pet lifestyle series meets underground dance music.",
        season: "Season 1 — 2026",
        shows: [
          { slug: "episode-1",       number: "EP.0",  label: "BAR WILD",   date: "Apr 2025", status: "past" },
          { slug: "ccdxsocial-01",   number: "01",    label: "BROAD",      date: "29 Jun",   status: "upcoming", tagline: "BROAD · WELCOMING · FIRST IMPRESSION" },
          { slug: "ccdxsocial-02",   number: "02",    label: "STYLE",      date: "27 Jul",   status: "upcoming", tagline: "STYLE · FASHION · MIDSUMMER ENERGY" },
          { slug: "ccdxsocial-03",   number: "03",    label: "AGILITY",    date: "30 Aug",   status: "upcoming", tagline: "AGILITY · FINALE PREVIEW · ONE MORE" },
          { slug: "ccdxsocial-mega", number: "MEGA",  label: "GRAND FINALE",date: "Oct 2026",status: "upcoming", isFinale: true, tagline: "GRAND FINALE · SEASON CLOSER" },
        ],
      }).replace(/'/g,"''")}', 'CCD × SOCIAL series metadata', now())

    ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, updated_at=now()
  `);


  // ── 9. VERIFY ────────────────────────────────────────────
  console.log("\n§8  Verifying…");
  const checks = [
    ["venues",       "SELECT count(*) FROM venues"],
    ["promoters",    "SELECT count(*) FROM promoters"],
    ["artists",      "SELECT count(*) FROM artists"],
    ["events",       "SELECT count(*) FROM events"],
    ["event_lineups","SELECT count(*) FROM event_lineups"],
    ["posts",        "SELECT count(*) FROM posts"],
    ["site_content", "SELECT count(*) FROM site_content"],
  ];
  for (const [label, sql] of checks) {
    const r = await runSQL(label + " count", sql);
    console.log(`     → ${label}: ${r[0].count}`);
  }

  const evts = await runSQL("event list", "SELECT title, status, starts_at FROM events ORDER BY sort_order");
  console.log("\n  Events in DB:");
  evts.forEach(e => console.log(`     • ${e.title} | ${e.status} | ${new Date(e.starts_at).toDateString()}`));

  const arts = await runSQL("featured artists", "SELECT name, primary_city FROM artists WHERE is_featured=true ORDER BY name");
  console.log(`\n  Featured artists (${arts.length}):`);
  arts.forEach(a => console.log(`     • ${a.name} — ${a.primary_city}`));

  console.log("\n✅  Seed complete!\n");
}

main().catch(e => { console.error("\n✗  Seed failed:", e.message); process.exit(1); });
