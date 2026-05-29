/**
 * /rss.xml — RSS feed for blog posts.
 */
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";
import { absoluteUrl } from "@/lib/utils";
import { SITE } from "@/lib/seo";


function escape(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  let items = "";
  try {
    const rows = await db.query.posts.findMany({
      where: eq(posts.status, "published"),
      orderBy: [desc(posts.publishedAt)],
      limit: 50,
    });
    items = rows
      .map(
        (p) => `
    <item>
      <title>${escape(p.title)}</title>
      <link>${absoluteUrl(`/blog/${p.slug}`)}</link>
      <guid isPermaLink="true">${absoluteUrl(`/blog/${p.slug}`)}</guid>
      <pubDate>${(p.publishedAt ?? p.createdAt).toUTCString()}</pubDate>
      ${p.excerpt ? `<description>${escape(p.excerpt)}</description>` : ""}
      ${p.authorName ? `<dc:creator>${escape(p.authorName)}</dc:creator>` : ""}
      ${(p.tags ?? []).map((t) => `<category>${escape(t)}</category>`).join("\n      ")}
    </item>`
      )
      .join("");
  } catch (err) {
    console.warn("[rss] DB unavailable:", err);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(SITE.name)}</title>
    <link>${absoluteUrl()}</link>
    <description>${escape(SITE.description)}</description>
    <language>${SITE.language}</language>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
