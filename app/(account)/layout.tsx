/**
 * Account layout — auth guard for /dashboard routes
 * Uses Better Auth server-side session check; redirects to /sign-in if not authenticated
 */
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Nav } from "@/components/site/nav";

const ACCOUNT_NAV = [
  { href: "/dashboard", label: "Home", icon: "⌂" },
  { href: "/dashboard/rsvps", label: "My RSVPs", icon: "★" },
  { href: "/dashboard/profile", label: "Edit Profile", icon: "✎" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in?next=/dashboard");
  }

  return (
    <div className="bg-cream min-h-screen text-ink">
      <Nav />
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8 pt-24 pb-16">
        {/* Tab-bar style header navigation — cleaner than sidebar */}
        <div className="border-4 border-ink bg-ink mb-8 flex overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {ACCOUNT_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-5 py-3 font-display text-sm text-cream hover:bg-acid-yellow hover:text-ink transition-colors whitespace-nowrap border-r-4 border-ink/20 last:border-r-0"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div className="ml-auto px-5 py-3 font-display text-xs text-cream/50 whitespace-nowrap self-center">
            {session.user.name ?? session.user.email}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
