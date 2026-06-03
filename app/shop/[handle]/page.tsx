/**
 * /shop/[handle] — Product detail shell
 * Beautiful "DROPS COMING" treatment with email capture
 */
import { buildMetadata } from "@/lib/seo";
import { Nav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ShopComingSoon } from "../shop-coming-soon-client";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props) {
  const { handle } = await params;
  return buildMetadata({
    title: `${handle.split("-").join(" ").toUpperCase()} — Shop — Cats Can Dance`,
    description: "CCD limited drops — coming soon.",
    path: `/shop/${handle}`,
  });
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const name = handle.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <main className="bg-background text-foreground min-h-screen">
      <Nav />

      <section className="mx-auto w-full max-w-[1200px] px-4 md:px-8 pt-28 pb-6">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: name }]} />
      </section>

      <ShopComingSoon />

      <Footer />
    </main>
  );
}
