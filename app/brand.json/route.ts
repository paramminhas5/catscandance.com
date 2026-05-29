/**
 * /brand.json — single-file machine-readable brand summary for AI agents.
 */
import { absoluteUrl } from "@/lib/utils";
import { SITE } from "@/lib/seo";


export function GET() {
  const body = {
    name: SITE.name,
    short_name: SITE.shortName,
    tagline: SITE.tagline,
    description: SITE.description,
    url: absoluteUrl(),
    domain: SITE.domain,
    email: SITE.email,
    founded: SITE.founded,
    city: SITE.city,
    country: SITE.country,
    language: SITE.language,
    palette: {
      ink: "#06070a",
      cream: "#e6e3df",
      hot_pink: "#dc2626",
      acid_yellow: "#c8e539",
      electric_blue: "#2563eb",
      lime: "#86efac",
      orange: "#ea580c",
      bubblegum: "#fbcfe8",
    },
    typography: { display: "Bowlby One", body: "Space Grotesk" },
    socials: {
      instagram: `https://instagram.com/${SITE.instagram.replace("@", "")}`,
      twitter: `https://twitter.com/${SITE.twitter.replace("@", "")}`,
    },
    surfaces: {
      events: absoluteUrl("/events"),
      artists: absoluteUrl("/artists"),
      discover: absoluteUrl("/discover"),
      blog: absoluteUrl("/blog"),
      shop: absoluteUrl("/shop"),
      embed_widget: absoluteUrl("/embed/upcoming"),
      llms_txt: absoluteUrl("/llms.txt"),
      llms_full_txt: absoluteUrl("/llms-full.txt"),
      rss: absoluteUrl("/rss.xml"),
      sitemap: absoluteUrl("/sitemap.xml"),
    },
    cities: ["Bangalore", "Bombay", "Delhi", "Goa", "Pune", "Hyderabad", "Chennai", "Kolkata"],
    genres: [
      "techno",
      "house",
      "bass",
      "breaks",
      "dnb",
      "garage",
      "ambient",
      "downtempo",
      "minimal",
    ],
  };
  return Response.json(body, {
    headers: { "Cache-Control": "public, max-age=86400, s-maxage=86400" },
  });
}
