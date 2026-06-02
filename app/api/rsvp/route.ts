import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { interactions, signups } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event_slug, name, email, plus_ones = 0, whatsapp, website } = body;

    // Honeypot check
    if (website) {
      return NextResponse.json({ ok: true }); // silently discard bot submissions
    }

    if (!event_slug || !name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const tag = `event:${event_slug}`;

    // Check for duplicate RSVP
    const existing = await db.query.signups.findFirst({
      where: and(eq(signups.email, cleanEmail), eq(signups.tag, tag)),
    });

    if (existing) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    // Insert into signups table (tag = event:<slug>)
    await db.insert(signups).values({
      email: cleanEmail,
      name: name.trim(),
      tag,
      metadata: {
        plus_ones,
        whatsapp: whatsapp ?? null,
        source: "rsvp-dialog",
      },
    });

    // Also log an RSVP interaction
    await db.insert(interactions).values({
      kind: "rsvp",
      targetType: "event",
      targetId: event_slug,
      metadata: {
        name: name.trim(),
        email: cleanEmail,
        plus_ones,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[RSVP]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
