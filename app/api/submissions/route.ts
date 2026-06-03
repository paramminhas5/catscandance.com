/**
 * POST /api/submissions — Artist/venue inquiry form handler
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { submissions } from "@/lib/db/schema";

const Schema = z.object({
  type: z.enum(["artist", "venue"]),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  city: z.string().trim().max(60).optional(),
  genre: z.string().trim().max(60).optional(),
  instagram: z.string().trim().max(100).optional(),
  soundcloud: z.string().trim().max(100).optional(),
  message: z.string().trim().max(2000).optional(),
  // Venue specific
  venueName: z.string().trim().max(100).optional(),
  capacity: z.string().trim().max(20).optional(),
  website: z.string().max(0).optional(), // honeypot
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot
    if (body.website) return NextResponse.json({ ok: true });

    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }

    const { type, name, email, ...rest } = parsed.data;

    await db.insert(submissions).values({
      submitterEmail: email,
      submitterName: name,
      payload: {
        type,
        name,
        email,
        ...rest,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[submissions POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
