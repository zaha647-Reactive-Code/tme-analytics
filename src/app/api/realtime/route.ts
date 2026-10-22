import { NextResponse } from "next/server";
import { getRealtime } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getRealtime());
}
