/**
 * /blog — Blog listing page
 * UX improvement: Featured hero (2/3 + 1/3) then 3-col grid, with client tag filter island
 */
import { buildMetadata } from "@/lib/seo";
import { listPublishedPosts } from "@/lib/db/queries";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { PageHero } from "@/components/site/page-hero";
import { Marquee } from "@/components/site/marquee";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { TagFilterClient } from "./tag-filter-client";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Blog — Cats Can Dance | Underground Music Writing",
  description:
    "Scene reports, manifestos, artist profiles, and deep-dives into India's underground electronic music culture.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await listPublishedPosts(24);

  // Collect all unique tags
  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags ?? []))
  ).sort();

  // Serialize for client
  const serialized = posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt ?? null,
    coverUrl: p.coverUrl ?? null,
    tags: p.tags ?? [],
    authorName: p.authorName ?? null,
    publishedAt: p.publishedAt ?? null,
  }));

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />

      <PageHero
        eyebrow="BLOG"
        title={<>SCENE<br/>REPORTS.</>}
        bg="bg-cream"
        textColor="text-ink"
        eyebrowColor="text-magenta"
        shadowColor="hsl(var(--magenta))"
      >
        <p className="text-ink/70 font-medium text-lg mt-2 max-w-xl">
          Manifestos, scene deep-dives, artist profiles and dispatches from India&apos;s underground.
        </p>
      </PageHero>

      <Marquee
        bg="bg-ink"
        items={["MANIFESTOS", "SCENE REPORTS", "ARTIST PROFILES", "UNDERGROUND", "CULTURE"]}
      />

      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 pb-16 md:pb-24">
        {posts.length === 0 ? (
          <div className="border-4 border-ink bg-acid-yellow chunk-shadow p-10 text-center">
            <p className="font-display text-ink text-4xl mb-3">NOTHING POSTED YET</p>
            <p className="text-ink/70 font-medium">The first dispatch is being written. Check back soon.</p>
          </div>
        ) : (
          <TagFilterClient posts={serialized} allTags={allTags} />
        )}
      </section>

      <Footer />
    </main>
  );
}
