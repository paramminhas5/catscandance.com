import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { bookings, artists } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      artist_slug,
      artist_name,
      requester_name,
      requester_email,
      requester_phone,
      purpose,
      event_date,
      venue,
      budget,
      notes,
    } = body;

    if (!artist_slug || !requester_name?.trim() || !requester_email?.trim() || !purpose?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Try to get the authenticated user id (optional — guests can book too)
    let userId: string | null = null;
    try {
      const session = await auth.api.getSession({ headers: await headers() });
      userId = session?.user?.id ?? null;
    } catch { /* unauthenticated — fine */ }

    // Resolve artist id from slug
    const artist = await db.query.artists.findFirst({
      where: eq(artists.slug, artist_slug),
      columns: { id: true },
    });

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    // Parse budget to minor units (paise) if possible
    let feeBudgetMinor: number | null = null;
    if (budget && typeof budget === "string") {
      const match = budget.match(/[\d,]+/);
      if (match) feeBudgetMinor = parseInt(match[0].replace(/,/g, ""), 10) * 100;
    }

    await db.insert(bookings).values({
      artistId: artist.id,
      requesterUserId: userId,
      requesterEmail: requester_email.trim().toLowerCase(),
      requesterName: requester_name.trim(),
      requesterPhone: requester_phone?.trim() || null,
      eventTitle: purpose?.trim() || null,
      eventCity: venue?.trim() || null,
      eventVenue: venue?.trim() || null,
      eventDate: event_date || null,
      feeBudgetMinor,
      status: "sent",
      messages: [
        {
          from: "fan",
          user_id: userId ?? undefined,
          body: [
            purpose && `Event type: ${purpose}`,
            event_date && `Date: ${event_date}`,
            venue && `Venue/city: ${venue}`,
            budget && `Budget: ${budget}`,
            notes && `Notes: ${notes}`,
          ]
            .filter(Boolean)
            .join("\n"),
          sent_at: new Date().toISOString(),
        },
      ],
      metadata: {
        artist_slug,
        artist_name,
        budget_label: budget || null,
        source: "artist-profile-booking-form",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[BOOKING INQUIRY]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
