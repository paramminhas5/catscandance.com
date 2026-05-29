/**
 * /llms.txt — short-form brand summary for AI crawlers (GPT, Claude, Perplexity).
 * Spec: https://llmstxt.org
 */
import { absoluteUrl } from "@/lib/utils";
import { SITE } from "@/lib/seo";


export function GET() {
  const body = `# ${SITE.name}

> ${SITE.tagline}. ${SITE.description}

Cats Can Dance (CCD) is a Bangalore-born culture company building India's
underground electronic music platform. We curate parties, profile artists,
and document scenes across Bombay, Bangalore, Goa, Delhi, and beyond.

## Discover
- [Events](${absoluteUrl("/events")}) — upcoming underground parties, AI-scored, curated.
- [Artists](${absoluteUrl("/artists")}) — Indian electronic artists across techno, house, bass, breaks, dnb, ambient.
- [Discover](${absoluteUrl("/discover")}) — search across events, artists, scenes.
- [Blog](${absoluteUrl("/blog")}) — scene reports, interviews, manifestos.

## Cities
- [Bangalore scene](${absoluteUrl("/scenes/bangalore")})
- [Bombay scene](${absoluteUrl("/scenes/bombay")})
- [Delhi scene](${absoluteUrl("/scenes/delhi")})
- [Goa scene](${absoluteUrl("/scenes/goa")})
- [Pune scene](${absoluteUrl("/scenes/pune")})

## Genres
- [Techno](${absoluteUrl("/sounds/techno")})
- [House](${absoluteUrl("/sounds/house")})
- [Bass](${absoluteUrl("/sounds/bass")})
- [Breaks](${absoluteUrl("/sounds/breaks")})
- [DnB](${absoluteUrl("/sounds/dnb")})

## Partners
- [For artists](${absoluteUrl("/for-artists")}) — submit your music, get booked.
- [For venues](${absoluteUrl("/for-venues")}) — host an episode.
- [For investors](${absoluteUrl("/for-investors")}) — the thesis.

## Optional
- Contact: ${SITE.email}
- Founded: ${SITE.founded} in ${SITE.city}, India.
- Brand JSON: ${absoluteUrl("/brand.json")}
- Long-form: ${absoluteUrl("/llms-full.txt")}
- RSS: ${absoluteUrl("/rss.xml")}
`;
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
