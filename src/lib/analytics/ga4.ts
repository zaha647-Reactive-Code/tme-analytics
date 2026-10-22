import "server-only";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { DASHBOARDS, isConnected, type DashboardConfig } from "@/config/dashboards";
import type { AnalyticsSnapshot, DashboardStat, Insight, Kpi, RangeKey, RealtimeSnapshot } from "@/lib/types";
import { RANGE_DAYS } from "./demo";

/**
 * Live data from Google Analytics 4 (GA4 Data API).
 *
 * How it works: every Looker Studio report sends visits to a GA4 property
 * through its Measurement ID. Here we read those visits back with a Google
 * Cloud service account and map each visit to a dashboard using the report
 * ID that appears in the page URL (lookerstudio.google.com/reporting/<id>).
 */

type Row = { d: string[]; m: number[] };
type Range = { startDate: string; endDate: string };

let client: BetaAnalyticsDataClient | null = null;

export function ga4Configured() {
  return Boolean(process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY);
}

function getClient() {
  if (!client) {
    client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
    });
  }
  return client;
}

function propertyOf(d: DashboardConfig) {
  return (d.ga4PropertyId || process.env.GA4_PROPERTY_ID || "").trim();
}

/** Groups connected dashboards by the GA4 property they report to */
function targets(dashboardId: string) {
  const list = DASHBOARDS.filter((d) => isConnected(d) && (dashboardId === "all" || d.id === dashboardId));
  const byProperty = new Map<string, DashboardConfig[]>();
  for (const d of list) {
    const p = propertyOf(d);
    if (!p) continue;
    byProperty.set(p, [...(byProperty.get(p) ?? []), d]);
  }
  return byProperty;
}

function reportFilter(dashboards: DashboardConfig[]) {
  return {
    orGroup: {
      expressions: dashboards.map((d) => ({
        filter: { fieldName: "pageLocation", stringFilter: { matchType: "CONTAINS" as const, value: d.lookerReportId } },
      })),
    },
  };
}

async function run(property: string, dashboards: DashboardConfig[], range: Range, dimensions: string[], metrics: string[], limit = 1000): Promise<Row[]> {
  const [res] = await getClient().runReport({
    property: `properties/${property}`,
    dateRanges: [range],
    dimensions: dimensions.map((name) => ({ name })),
    metrics: metrics.map((name) => ({ name })),
    dimensionFilter: reportFilter(dashboards),
    limit,
  });
  return (res.rows ?? []).map((r) => ({
    d: (r.dimensionValues ?? []).map((v) => v.value ?? ""),
    m: (r.metricValues ?? []).map((v) => Number(v.value ?? 0)),
  }));
}

/** Runs the same report on every property and concatenates the rows */
async function runAll(byProperty: Map<string, DashboardConfig[]>, range: Range, dims: string[], metrics: string[], limit?: number) {
  const parts = await Promise.all([...byProperty].map(([p, ds]) => run(p, ds, range, dims, metrics, limit)));
  return parts.flat();
}

function group(rows: Row[], key: (r: Row) => string, metric = 0) {
  const map = new Map<string, number>();
  for (const r of rows) map.set(key(r), (map.get(key(r)) ?? 0) + r.m[metric]);
  return [...map].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

function dashboardFor(url: string) {
  return DASHBOARDS.find((d) => d.lookerReportId && url.includes(d.lookerReportId));
}

export async function getGa4Snapshot(range: RangeKey, dashboardId = "all"): Promise<AnalyticsSnapshot | null> {
  const byProperty = targets(dashboardId);
  if (byProperty.size === 0) return null;

  const days = RANGE_DAYS[range];
  const current = { startDate: `${days - 1}daysAgo`, endDate: "today" };
  const previous = { startDate: `${days * 2 - 1}daysAgo`, endDate: `${days}daysAgo` };
  const totalsMetrics = ["activeUsers", "newUsers", "sessions", "screenPageViews", "userEngagementDuration", "engagementRate"];

  const [tNow, tPrev, daily, channels, devices, countries, pagesNow, pagesPrev, heat, nvr, events, browsers] = await Promise.all([
    runAll(byProperty, current, [], totalsMetrics),
    runAll(byProperty, previous, [], totalsMetrics),
    runAll(byProperty, current, ["date"], ["activeUsers", "sessions", "screenPageViews", "newUsers"]),
    runAll(byProperty, current, ["sessionDefaultChannelGroup"], ["sessions"]),
    runAll(byProperty, current, ["deviceCategory"], ["activeUsers"]),
    runAll(byProperty, current, ["country", "countryId"], ["activeUsers"], 20),
    runAll(byProperty, current, ["pageLocation", "pageTitle"], ["activeUsers", "screenPageViews", "userEngagementDuration"], 5000),
    runAll(byProperty, previous, ["pageLocation"], ["activeUsers"], 5000),
    runAll(byProperty, current, ["dayOfWeek", "hour"], ["activeUsers"]),
    runAll(byProperty, current, ["newVsReturning"], ["activeUsers"]),
    runAll(byProperty, current, ["eventName"], ["eventCount", "activeUsers"]),
    runAll(byProperty, current, ["browser"], ["activeUsers"]),
  ]);

  const sumCol = (rows: Row[], i: number) => rows.reduce((a, r) => a + (r.m[i] ?? 0), 0);
  const avgCol = (rows: Row[], i: number) => (rows.length ? sumCol(rows, i) / rows.length : 0);

  const timeseries = group(daily, (r) => r.d[0])
    .map(({ name }) => {
      const rs = daily.filter((r) => r.d[0] === name);
      const date = `${name.slice(0, 4)}-${name.slice(4, 6)}-${name.slice(6, 8)}`;
      return { date, users: sumCol(rs, 0), newUsers: sumCol(rs, 3), sessions: sumCol(rs, 1), views: sumCol(rs, 2) };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const spark = (k: "users" | "newUsers" | "sessions" | "views") => timeseries.slice(-14).map((p) => p[k]);
  const users = sumCol(tNow, 0);
  const sessions = sumCol(tNow, 2);
  const kpis: Kpi[] = [
    { key: "users", label: "Total users", value: users, previous: sumCol(tPrev, 0), format: "number", spark: spark("users") },
    { key: "newUsers", label: "New users", value: sumCol(tNow, 1), previous: sumCol(tPrev, 1), format: "number", spark: spark("newUsers") },
    { key: "sessions", label: "Sessions", value: sessions, previous: sumCol(tPrev, 2), format: "number", spark: spark("sessions") },
    { key: "views", label: "Page views", value: sumCol(tNow, 3), previous: sumCol(tPrev, 3), format: "number", spark: spark("views") },
    { key: "avgTime", label: "Avg. time on dashboard", value: users ? sumCol(tNow, 4) / users : 0, previous: sumCol(tPrev, 0) ? sumCol(tPrev, 4) / sumCol(tPrev, 0) : 0, format: "duration", spark: spark("sessions") },
    { key: "engagement", label: "Engagement rate", value: avgCol(tNow, 5), previous: avgCol(tPrev, 5), format: "percent", spark: spark("users") },
  ];

  // Map page URLs back to the dashboards in src/config/dashboards.ts
  const stats = new Map<string, DashboardStat>();
  for (const r of pagesNow) {
    const d = dashboardFor(r.d[0]);
    if (!d) continue;
    const s = stats.get(d.id) ?? { id: d.id, name: d.name, category: d.category, users: 0, views: 0, avgTimeSec: 0, change: 0, trend: [], connected: true };
    s.users += r.m[0];
    s.views += r.m[1];
    s.avgTimeSec += r.m[2];
    stats.set(d.id, s);
  }
  const prevUsers = new Map<string, number>();
  for (const r of pagesPrev) {
    const d = dashboardFor(r.d[0]);
    if (d) prevUsers.set(d.id, (prevUsers.get(d.id) ?? 0) + r.m[0]);
  }
  const dashboards = [...stats.values()]
    .map((s) => {
      const prev = prevUsers.get(s.id) ?? 0;
      return { ...s, avgTimeSec: s.users ? s.avgTimeSec / s.users : 0, change: prev ? (s.users - prev) / prev : 0 };
    })
    .sort((a, b) => b.users - a.users);

  const pages = pagesNow
    .map((r) => ({ dashboard: dashboardFor(r.d[0])?.name ?? "—", page: r.d[1] || "(untitled)", views: r.m[1], avgTimeSec: r.m[0] ? r.m[2] / r.m[0] : 0, exitRate: 0 }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  // GA4 dayOfWeek: 0 = Sunday. Our heatmap rows start on Monday.
  const heatmap = Array.from({ length: 7 }, () => Array<number>(24).fill(0));
  for (const r of heat) heatmap[(Number(r.d[0]) + 6) % 7][Number(r.d[1])] += r.m[0];

  const eventUsers = (name: string) => events.filter((r) => r.d[0] === name).reduce((a, r) => a + r.m[1], 0);
  const funnel = [
    { step: "Opened a dashboard", users },
    { step: "Engaged (10s+)", users: eventUsers("user_engagement") },
    { step: "Scrolled the page", users: eventUsers("scroll") },
    { step: "Clicked a link", users: eventUsers("click") },
    { step: "Downloaded a file", users: eventUsers("file_download") },
  ];

  // GA4 has no per-view duration histogram, so pages are bucketed by their average time
  const buckets = [
    { name: "0–10s", max: 10 },
    { name: "10–30s", max: 30 },
    { name: "30s–1m", max: 60 },
    { name: "1–3m", max: 180 },
    { name: "3–10m", max: 600 },
    { name: "10m+", max: Infinity },
  ];
  const timeOnPage = buckets.map((b) => ({ name: b.name, value: 0 }));
  for (const r of pagesNow) {
    const avg = r.m[0] ? r.m[2] / r.m[0] : 0;
    timeOnPage[buckets.findIndex((b) => avg < b.max)].value += r.m[1];
  }

  const insights: Insight[] = [];
  const rising = [...dashboards].sort((a, b) => b.change - a.change)[0];
  const falling = [...dashboards].sort((a, b) => a.change - b.change)[0];
  if (rising && rising.change > 0) insights.push({ tone: "up", title: `${rising.name} is trending`, detail: `Visits up ${Math.round(rising.change * 100)}% compared with the previous period.` });
  if (falling && falling.change < 0) insights.push({ tone: "down", title: `${falling.name} needs attention`, detail: `Visits down ${Math.abs(Math.round(falling.change * 100))}% compared with the previous period.` });
  if (dashboards[0]) insights.push({ tone: "info", title: `${dashboards[0].name} is the most visited`, detail: `${dashboards[0].users.toLocaleString()} users in this period.` });

  return {
    source: "ga4",
    range,
    generatedAt: new Date().toISOString(),
    kpis,
    timeseries,
    channels: group(channels, (r) => r.d[0]),
    devices: group(devices, (r) => r.d[0].replace(/^./, (c) => c.toUpperCase())),
    countries: group(countries, (r) => `${r.d[0]}|${r.d[1]}`).slice(0, 8).map((c) => {
      const [country, code] = c.name.split("|");
      return { country, code, users: c.value };
    }),
    dashboards,
    pages,
    charts: events
      .filter((r) => !["page_view", "session_start", "first_visit", "user_engagement"].includes(r.d[0]))
      .map((r) => ({ chart: r.d[0], dashboard: "All dashboards", interactions: r.m[0] }))
      .sort((a, b) => b.interactions - a.interactions)
      .slice(0, 8),
    funnel,
    heatmap,
    newVsReturning: group(nvr, (r) => (r.d[0] === "new" ? "New" : r.d[0] === "returning" ? "Returning" : "Other")).filter((x) => x.name !== "Other"),
    browsers: group(browsers, (r) => r.d[0]).slice(0, 5),
    timeOnPage,
    insights,
  };
}

export async function getGa4Realtime(): Promise<RealtimeSnapshot | null> {
  const byProperty = targets("all");
  if (byProperty.size === 0) return null;
  const c = getClient();

  const runRt = async (dims: string[], minuteRanges?: { startMinutesAgo: number; endMinutesAgo: number }[]) => {
    const parts = await Promise.all(
      [...byProperty.keys()].map(async (p) => {
        const [res] = await c.runRealtimeReport({
          property: `properties/${p}`,
          dimensions: dims.map((name) => ({ name })),
          metrics: [{ name: "activeUsers" }],
          minuteRanges,
        });
        return (res.rows ?? []).map((r) => ({ d: (r.dimensionValues ?? []).map((v) => v.value ?? ""), m: [Number(r.metricValues?.[0]?.value ?? 0)] }));
      }),
    );
    return parts.flat();
  };

  const [total, minutes, screens, countries] = await Promise.all([
    runRt([]),
    runRt(["minutesAgo"]),
    runRt(["unifiedScreenName"]),
    runRt(["country", "countryId"]),
  ]);

  const perMinute = Array.from({ length: 30 }, (_, i) => ({
    minute: 29 - i,
    users: minutes.filter((r) => Number(r.d[0]) === 29 - i).reduce((a, r) => a + r.m[0], 0),
  }));

  return {
    source: "ga4",
    activeNow: total.reduce((a, r) => a + r.m[0], 0),
    perMinute,
    activePages: group(screens, (r) => r.d[0]).slice(0, 7).map((x) => ({ page: x.name, users: x.value })),
    countries: group(countries, (r) => `${r.d[0]}|${r.d[1]}`).slice(0, 5).map((x) => {
      const [country, code] = x.name.split("|");
      return { country, code, users: x.value };
    }),
    // GA4 realtime has no per-person event stream, so the live feed stays empty in GA4 mode
    events: [],
  };
}
