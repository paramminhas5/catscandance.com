/**
 * /dashboard/profile — Edit profile (client form with server action)
 */
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { ProfileForm } from "./profile-form";

export const metadata = buildMetadata({
  title: "Edit Profile — Cats Can Dance",
  description: "Edit your CCD profile.",
  path: "/dashboard/profile",
});

const CITIES = ["Bengaluru", "Mumbai", "Delhi", "Goa", "Hyderabad", "Pune", "Other"];

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const userWithExtra = session.user as typeof session.user & { city?: string; bio?: string };

  return (
    <>
      <Breadcrumbs items={[
        { label: "Home", href: "/" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Edit Profile" },
      ]} />

      <div className="mb-8">
        <p className="font-display text-magenta text-base mb-2">/ SETTINGS</p>
        <h1 className="font-display text-ink text-3xl md:text-5xl leading-none">EDIT PROFILE</h1>
      </div>

      <div className="max-w-2xl">
        <ProfileForm
          initialName={session.user.name ?? ""}
          initialCity={userWithExtra.city ?? ""}
          initialBio={userWithExtra.bio ?? ""}
          cities={CITIES}
        />
      </div>
    </>
  );
}
