import Link from "next/link";

export type Crumb = { label: string; href?: string };

const SITE = "https://catscandance.com";

export function Breadcrumbs({ items, light = false }: { items: Crumb[]; light?: boolean }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: `${SITE}${c.href}` } : {}),
    })),
  };

  const text = light
    ? "text-cream/80 hover:text-acid-yellow"
    : "text-ink/70 hover:text-magenta";
  const sep = light ? "text-cream/40" : "text-ink/40";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <nav aria-label="Breadcrumb" className="font-display text-sm tracking-wide mb-6">
        <ol className="flex flex-wrap items-center gap-2">
          {items.map((c, i) => (
            <li key={`${c.label}-${i}`} className="flex items-center gap-2">
              {c.href ? (
                <Link
                  href={c.href}
                  className={`${text} underline decoration-2 underline-offset-2 transition-colors`}
                >
                  {c.label}
                </Link>
              ) : (
                <span className={light ? "text-cream" : "text-ink"} aria-current="page">
                  {c.label}
                </span>
              )}
              {i < items.length - 1 && <span className={sep}>›</span>}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
