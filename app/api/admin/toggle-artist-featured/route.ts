/**
 * POST /api/admin/toggle-artist-featured — Admin only
 * Toggles isFeatured or isVerified on an artist
 */
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { artists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "@/lib/db/schema";

const Schema = z.object({
  artistId: z.string().min(1),
  field: z.enum(["isFeatured", "isVerified"]),
  value: z.boolean(),
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userWithRole = session?.user as (User & { role?: string }) | undefined;

  if (!session || userWithRole?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = Schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

    const updateData =
      parsed.data.field === "isFeatured"
        ? { isFeatured: parsed.data.value, updatedAt: new Date() }
        : { isVerified: parsed.data.value, updatedAt: new Date() };

    await db.update(artists)
      .set(updateData)
      .where(eq(artists.id, parsed.data.artistId));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[toggle-artist-featured]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
