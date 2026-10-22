import "server-only";
import type { AnalyticsSnapshot, RangeKey, RealtimeSnapshot } from "@/lib/types";
import { getDemoRealtime, getDemoSnapshot } from "./demo";
import { ga4Configured, getGa4Realtime, getGa4Snapshot } from "./ga4";

/**
 * Single entry point the API routes use.
 * ANALYTICS_MODE=ga4 → live GA4 data (falls back to demo if nothing is connected yet).
 * Anything else       → demo data.
 */
const liveMode = () => process.env.ANALYTICS_MODE === "ga4";

export async function getSnapshot(range: RangeKey, dashboardId: string): Promise<AnalyticsSnapshot> {
  if (liveMode()) {
    if (!ga4Configured()) {
      return { ...getDemoSnapshot(range, dashboardId), notice: "ANALYTICS_MODE is ga4 but Google credentials are missing in .env.local — showing demo data." };
    }
    try {
      const live = await getGa4Snapshot(range, dashboardId);
      if (live) return live;
      return { ...getDemoSnapshot(range, dashboardId), notice: "No dashboard has a Measurement ID yet — showing demo data. Add one in src/config/dashboards.ts." };
    } catch (err) {
      console.error("[ga4] report failed", err);
      return { ...getDemoSnapshot(range, dashboardId), notice: "Could not reach Google Analytics — showing demo data. Check the server log for details." };
    }
  }
  return getDemoSnapshot(range, dashboardId);
}

export async function getRealtime(): Promise<RealtimeSnapshot> {
  if (liveMode() && ga4Configured()) {
    try {
      const live = await getGa4Realtime();
      if (live) return live;
    } catch (err) {
      console.error("[ga4] realtime failed", err);
    }
  }
  return getDemoRealtime();
}
