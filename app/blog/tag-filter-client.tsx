"use client";

import { useState } from "react";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverUrl: string | null;
  tags: string[];
  authorName: string | null;
  publishedAt: Date | null;
};

type Props = {
  posts: Post[];
  allTags: string[];
};

function formatDate(d: Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function TagFilterClient({ posts, allTags }: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  const [hero, ...rest] = filtered;

  return (
    <div>
      {/* Tag filter pills */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTag(null)}
            className={`font-display text-xs px-4 py-2 border-4 border-ink transition-colors chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform ${
              activeTag === null ? "bg-ink text-cream" : "bg-cream text-ink hover:bg-acid-yellow"
            }`}
          >
            ALL
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`font-display text-xs px-4 py-2 border-4 border-ink transition-colors chunk-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-transform ${
                activeTag === tag ? "bg-magenta text-cream" : "bg-cream text-ink hover:bg-acid-yellow"
              }`}
            >
              {tag.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="border-4 border-ink bg-acid-yellow chunk-shadow p-8">
          <p className="font-display text-ink text-2xl mb-2">NO POSTS FOR THIS TAG</p>
          <button onClick={() => setActiveTag(null)} className="font-display text-sm text-ink/70 hover:text-ink underline">Clear filter</button>
        </div>
      )}

      {hero && (
        <div className="mb-8">
          {/* UX improvement: editorial featured hero — 2/3 + 1/3 layout */}
          <a
            href={`/blog/${hero.slug}`}
            className="group grid md:grid-cols-3 border-4 border-ink chunk-shadow overflow-hidden hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-transform"
          >
            <div className="md:col-span-2 relative aspect-video md:aspect-auto min-h-[240px] bg-ink overflow-hidden">
              {hero.coverUrl ? (
                <img
                  src={hero.coverUrl}
                  alt={hero.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-magenta flex items-center justify-center">
                  <span className="font-display text-cream text-6xl md:text-8xl opacity-20">✦</span>
                </div>
              )}
            </div>
            <div className="bg-cream p-6 md:p-8 flex flex-col justify-between border-t-4 md:border-t-0 md:border-l-4 border-ink">
              <div>
                {hero.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hero.tags.slice(0, 3).map((t) => (
                      <span key={t} className="font-display text-[10px] uppercase tracking-widest px-2 py-0.5 bg-magenta text-cream border-2 border-ink">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <span className="inline-block font-display text-[10px] bg-acid-yellow text-ink px-2 py-0.5 border-2 border-ink uppercase tracking-widest mb-3">
                  ✦ FEATURED
                </span>
                <h2 className="font-display text-ink text-2xl md:text-3xl leading-tight mb-3">{hero.title.toUpperCase()}</h2>
                {hero.excerpt && (
                  <p className="text-ink/70 text-sm font-medium line-clamp-3">{hero.excerpt}</p>
                )}
              </div>
              <div className="mt-4">
                {hero.authorName && <p className="font-display text-xs text-ink/50 uppercase tracking-widest">{hero.authorName}</p>}
                {hero.publishedAt && <p className="text-xs text-ink/40 mt-0.5">{formatDate(hero.publishedAt)}</p>}
                <p className="font-display text-magenta text-xs mt-3 uppercase tracking-widest group-hover:text-ink transition-colors">READ →</p>
              </div>
            </div>
          </a>
        </div>
      )}

      {/* Rest in 3-col grid */}
      {rest.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((post) => (
            <a
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group border-4 border-ink chunk-shadow overflow-hidden bg-cream hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-transform flex flex-col"
            >
              <div className="relative aspect-video bg-ink overflow-hidden border-b-4 border-ink">
                {post.coverUrl ? (
                  <img
                    src={post.coverUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-electric-blue flex items-center justify-center">
                    <span className="font-display text-cream/20 text-4xl">✦</span>
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.slice(0, 2).map((t) => (
                      <span key={t} className="font-display text-[10px] uppercase tracking-widest px-2 py-0.5 bg-ink text-cream border border-ink">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <h3 className="font-display text-ink text-lg leading-tight mb-2">{post.title.toUpperCase()}</h3>
                {post.excerpt && <p className="text-ink/60 text-sm font-medium line-clamp-2 flex-1">{post.excerpt}</p>}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    {post.authorName && <p className="font-display text-xs text-ink/40 uppercase">{post.authorName}</p>}
                    {post.publishedAt && <p className="text-[11px] text-ink/30">{formatDate(post.publishedAt)}</p>}
                  </div>
                  <span className="font-display text-xs text-magenta group-hover:text-ink transition-colors">READ →</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
