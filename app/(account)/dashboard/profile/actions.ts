"use server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const Schema = z.object({
  name: z.string().trim().min(1).max(100),
  city: z.string().trim().max(60).optional(),
  bio: z.string().trim().max(500).optional(),
  instagram: z.string().trim().max(60).optional(),
});

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false, error: "unauthenticated" };

  const parsed = Schema.safeParse({
    name: formData.get("name"),
    city: formData.get("city") ?? "",
    bio: formData.get("bio") ?? "",
    instagram: formData.get("instagram") ?? "",
  });

  if (!parsed.success) return { ok: false, error: "validation" };

  try {
    await db.update(user)
      .set({
        name: parsed.data.name,
        city: parsed.data.city || null,
        bio: parsed.data.bio || null,
        socials: parsed.data.instagram
          ? { instagram: `https://instagram.com/${parsed.data.instagram}` }
          : undefined,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    return { ok: true };
  } catch (err) {
    console.error("[updateProfile]", err);
    return { ok: false, error: "db_error" };
  }
}
