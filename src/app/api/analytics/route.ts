import { NextResponse, type NextRequest } from "next/server";
import { getSnapshot } from "@/lib/analytics";
import type { RangeKey } from "@/lib/types";

export const dynamic = "force-dynamic";

const RANGES: RangeKey[] = ["7d", "28d", "90d"];

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const range = RANGES.includes(p.get("range") as RangeKey) ? (p.get("range") as RangeKey) : "28d";
  const dashboard = p.get("dashboard") || "all";
  return NextResponse.json(await getSnapshot(range, dashboard));
}
