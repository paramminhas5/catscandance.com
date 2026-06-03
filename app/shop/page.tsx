/**
 * /shop — Shop listing
 * If SHOPIFY_STORE_DOMAIN is not set: bold editorial "DROPS COMING" holding page
 * If set: Shopify product grid
 * UX improvement: "DROPS COMING" is a full editorial countdown with rotating
 * color backgrounds and the early-access signup integrated into the hero.
 */
import { buildMetadata } from "@/lib/seo";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Marquee } from "@/components/site/marquee";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ShopComingSoon } from "./shop-coming-soon-client";

export const metadata = buildMetadata({
  title: "Shop — Cats Can Dance | Drops Coming",
  description:
    "CCD limited drops — apparel and goods for humans and pets. Wearable dance music culture.",
  path: "/shop",
});

export default async function ShopPage() {
  const shopifyEnabled = !!(
    process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  );

  if (shopifyEnabled) {
    // TODO Phase 5: Fetch from Shopify Storefront API
    // For now fall through to coming soon
  }

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />

      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 pt-28 pb-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
      </section>

      <ShopComingSoon />

      <Marquee
        bg="bg-ink"
        items={["LIMITED DROPS", "PET APPAREL", "STREETWEAR", "CULTURE GOODS", "WEARABLE MUSIC"]}
      />

      {/* Editorial teaser grid */}
      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 py-12 md:py-20">
        <p className="font-display text-magenta text-base mb-4">/ WHAT&apos;S COMING</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "HUMAN APPAREL", desc: "Tees, hoodies, accessories", bg: "bg-magenta", text: "text-cream" },
            { label: "PET APPAREL", desc: "Bandanas, harnesses, collars", bg: "bg-acid-yellow", text: "text-ink" },
            { label: "PRINTS", desc: "Event posters, limited editions", bg: "bg-electric-blue", text: "text-cream" },
            { label: "RECORDS", desc: "Curated vinyl drops", bg: "bg-ink", text: "text-cream" },
          ].map((item) => (
            <div
              key={item.label}
              className={`border-4 border-ink chunk-shadow p-5 min-h-[160px] flex flex-col justify-between ${item.bg}`}
            >
              <p className={`font-display text-xl md:text-2xl leading-tight ${item.text}`}>{item.label}</p>
              <p className={`text-sm font-medium ${item.text} opacity-70`}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
