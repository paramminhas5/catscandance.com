import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/db/queries";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (!q.trim() || q.trim().length < 2) {
    return NextResponse.json({ events: [], artists: [], venues: [] });
  }
  try {
    const data = await search(q.trim(), 10);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ events: [], artists: [], venues: [] });
  }
}
