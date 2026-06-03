/**
 * POST /api/admin/toggle-event-status — Admin only
 */
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { events } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { User } from "@/lib/db/schema";

const Schema = z.object({
  eventId: z.string().min(1),
  status: z.enum(["draft", "upcoming", "live", "past", "cancelled"]),
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

    await db.update(events)
      .set({ status: parsed.data.status, updatedAt: new Date() })
      .where(eq(events.id, parsed.data.eventId));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[toggle-event-status]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
