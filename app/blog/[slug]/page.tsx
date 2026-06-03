/**
 * /blog/[slug] — Blog post detail page
 * Renders markdown body as HTML using a simple regex approach
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { getPostBySlug, listPublishedPosts } from "@/lib/db/queries";
import { blogPostingSchema } from "@/lib/seo";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/lib/seo";
import { ShareButton } from "../share-button";
import { absoluteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") {
    return buildMetadata({ title: "Post not found", path: `/blog/${slug}` });
  }
  return buildMetadata({
    title: post.seoTitle ?? `${post.title} — Cats Can Dance Blog`,
    description: post.seoDescription ?? post.excerpt ?? undefined,
    path: `/blog/${slug}`,
    image: post.coverUrl ?? undefined,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    authors: post.authorName ? [post.authorName] : undefined,
    keywords: post.tags ?? undefined,
  });
}

/** Simple markdown → HTML for headings, bold, italic, links, paragraphs */
function markdownToHtml(md: string): string {
  return md
    .replace(/^# (.+)$/gm, '<h1 class="font-display text-ink text-3xl md:text-5xl mt-10 mb-4">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="font-display text-ink text-2xl md:text-4xl mt-8 mb-3">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="font-display text-ink text-xl md:text-3xl mt-6 mb-2">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-ink">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="font-medium text-magenta underline hover:text-ink transition-colors">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc mb-1">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="my-4 space-y-1">$&</ul>')
    .replace(/\n\n+/g, '</p><p class="my-4 text-ink/80 text-lg font-medium leading-relaxed">')
    .replace(/^(?!<[h|u|l])(.+)$/gm, (match) =>
      match.startsWith('<') ? match : `<p class="my-4 text-ink/80 text-lg font-medium leading-relaxed">${match}</p>`
    );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    listPublishedPosts(24),
  ]);

  if (!post || post.status !== "published") notFound();

  const relatedPosts = allPosts.filter(
    (p) => p.slug !== slug && p.tags?.some((t) => post.tags?.includes(t))
  ).slice(0, 3);

  const postUrl = absoluteUrl(`/blog/${slug}`);

  const htmlBody = markdownToHtml(post.body || "");
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <main className="bg-background text-foreground min-h-screen">
      <JsonLd data={blogPostingSchema(post)} />
      <Nav />

      {/* Cover image hero */}
      {post.coverUrl ? (
        <div className="relative w-full aspect-video md:aspect-[21/9] max-h-[600px] bg-ink overflow-hidden border-b-4 border-ink mt-[72px] md:mt-[80px]">
          <img src={post.coverUrl} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-[1200px] px-4 md:px-8 pb-8">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map((t) => (
                  <span key={t} className="font-display text-[10px] bg-magenta text-cream px-2 py-0.5 border-2 border-cream uppercase tracking-widest">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-display text-cream text-3xl md:text-6xl leading-tight max-w-4xl" style={{ filter: "drop-shadow(3px 3px 0 hsl(var(--ink)))" }}>
              {post.title.toUpperCase()}
            </h1>
          </div>
        </div>
      ) : (
        <div className="bg-cream border-b-4 border-ink pt-28 md:pt-36 pb-10">
          <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((t) => (
                  <span key={t} className="font-display text-[10px] bg-magenta text-cream px-2 py-0.5 border-2 border-ink uppercase tracking-widest">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-display text-ink text-3xl md:text-7xl leading-tight max-w-4xl" style={{ filter: "drop-shadow(5px 5px 0 hsl(var(--magenta)))" }}>
              {post.title.toUpperCase()}
            </h1>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]} />
      </div>

      {/* Author byline + share */}
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-4 border-ink bg-acid-yellow chunk-shadow p-4">
          <div>
            {post.authorName && (
              <p className="font-display text-ink text-sm uppercase tracking-widest">By {post.authorName}</p>
            )}
            {publishedDate && (
              <p className="text-ink/60 text-xs mt-0.5">{publishedDate}</p>
            )}
          </div>
          <ShareButton title={post.title} url={postUrl} />
        </div>
      </div>

      {/* Article body */}
      <article className="mx-auto w-full max-w-[800px] px-4 md:px-8 pb-16 md:pb-24">
        {post.excerpt && (
          <p className="font-display text-ink/70 text-xl md:text-2xl leading-snug border-l-4 border-magenta pl-5 mb-8">
            {post.excerpt}
          </p>
        )}
        <div
          className="prose-ccd"
          dangerouslySetInnerHTML={{ __html: htmlBody }}
        />

        {/* Tags footer */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t-4 border-ink">
            <p className="font-display text-xs text-ink/50 uppercase tracking-widest mb-3">Tags</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  href={`/blog?tag=${t}`}
                  className="font-display text-xs uppercase px-3 py-1.5 border-4 border-ink bg-cream chunk-shadow hover:bg-acid-yellow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform"
                >
                  {t}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8">
          <ShareButton title={post.title} url={postUrl} />
        </div>
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-cream border-t-4 border-ink py-12 md:py-16">
          <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
            <p className="font-display text-magenta text-base mb-3">/ RELATED</p>
            <h2 className="font-display text-ink text-3xl md:text-4xl mb-8">MORE FROM THE ARCHIVE</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/blog/${rp.slug}`}
                  className="group border-4 border-ink chunk-shadow overflow-hidden hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-transform"
                >
                  <div className="aspect-video bg-ink border-b-4 border-ink overflow-hidden">
                    {rp.coverUrl ? (
                      <img src={rp.coverUrl} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-magenta flex items-center justify-center">
                        <span className="font-display text-cream/20 text-4xl">✦</span>
                      </div>
                    )}
                  </div>
                  <div className="bg-cream p-4">
                    <h3 className="font-display text-ink text-base leading-tight">{rp.title.toUpperCase()}</h3>
                    {rp.excerpt && <p className="text-ink/60 text-xs mt-1 line-clamp-2">{rp.excerpt}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
