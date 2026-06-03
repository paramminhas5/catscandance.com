/**
 * Admin layout — guards admin routes, redirects non-admins to /
 */
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import type { User } from "@/lib/db/schema";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: "⌂" },
  { href: "/admin/events", label: "Events", icon: "★" },
  { href: "/admin/artists", label: "Artists", icon: "♪" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userWithRole = session?.user as (User & { role?: string }) | undefined;

  if (!session || userWithRole?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="bg-ink min-h-screen text-cream">
      {/* Admin header */}
      <header className="bg-ink border-b-4 border-acid-yellow sticky top-0 z-40">
        <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8 flex items-center gap-4 py-3">
          <Link href="/" className="font-display text-acid-yellow text-lg hover:text-cream transition-colors">CCD</Link>
          <span className="font-display text-acid-yellow/40 text-sm">/ ADMIN</span>
          <nav className="flex items-center gap-1 ml-4">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 px-4 py-2 font-display text-sm text-cream/70 hover:text-acid-yellow hover:bg-cream/5 transition-colors border-2 border-transparent hover:border-acid-yellow/20"
              >
                <span className="text-acid-yellow/60">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto font-display text-xs text-cream/40">
            {session.user.email}
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1400px] px-4 md:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
