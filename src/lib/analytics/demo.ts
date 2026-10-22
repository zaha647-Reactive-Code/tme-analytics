import { DASHBOARDS, isConnected } from "@/config/dashboards";
import type {
  AnalyticsSnapshot,
  ChartStat,
  CountryStat,
  DashboardStat,
  Insight,
  Kpi,
  LiveEvent,
  PageStat,
  RangeKey,
  RealtimeSnapshot,
  TimePoint,
} from "@/lib/types";
import { pctChange } from "@/lib/format";

export const RANGE_DAYS: Record<RangeKey, number> = { "7d": 7, "28d": 28, "90d": 90 };

/** Small seeded random generator so demo numbers stay the same on every refresh */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return h >>> 0;
}

const COUNTRIES: Omit<CountryStat, "users">[] = [
  { country: "Pakistan", code: "PK" },
  { country: "United Arab Emirates", code: "AE" },
  { country: "United States", code: "US" },
  { country: "United Kingdom", code: "GB" },
  { country: "Saudi Arabia", code: "SA" },
  { country: "Canada", code: "CA" },
  { country: "Germany", code: "DE" },
  { country: "Australia", code: "AU" },
];
const COUNTRY_WEIGHTS = [0.34, 0.17, 0.14, 0.11, 0.09, 0.06, 0.05, 0.04];

const PAGES = ["Overview", "Trends", "By Region", "Campaign Detail", "Monthly Report", "Targets vs Actual"];
const CHARTS = ["Revenue trend", "Leads by source", "Top products", "Spend vs ROAS", "Region map", "Conversion funnel", "Weekly cohort", "KPI scorecard"];
const ACTIONS = ["opened", "filtered", "clicked chart in", "exported data from", "changed date range on", "viewed page of"];
const NAMES = ["Ayesha", "Bilal", "Sara", "Usman", "Hina", "Omar", "Fatima", "Ali", "Zainab", "Hamza", "Maryam", "Daniyal"];

function dayLabel(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function getDemoSnapshot(range: RangeKey, dashboardId = "all"): AnalyticsSnapshot {
  const days = RANGE_DAYS[range];
  const rand = rng(hash(range + dashboardId));
  const scale = dashboardId === "all" ? 1 : 0.06 + rand() * 0.08;

  const timeseries: TimePoint[] = [];
  const prevSeries: number[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const weekday = d.getDay();
    const weekend = weekday === 0 || weekday === 6 ? 0.55 : 1;
    const growth = 1 + (days - i) / days / 4;
    const base = 420 * scale * weekend * growth * (0.85 + rand() * 0.3);
    const users = Math.round(base);
    const sessions = Math.round(users * (1.35 + rand() * 0.25));
    const views = Math.round(sessions * (2.6 + rand() * 0.8));
    timeseries.push({ date: dayLabel(d), users, newUsers: Math.round(users * (0.34 + rand() * 0.14)), sessions, views });
    prevSeries.push(Math.round(users * (0.78 + rand() * 0.2)));
  }

  const sum = (k: "users" | "sessions" | "views") => timeseries.reduce((a, p) => a + p[k], 0);
  const users = Math.round(sum("users") * 0.62);
  const sessions = sum("sessions");
  const views = sum("views");
  const prevUsers = Math.round(prevSeries.reduce((a, b) => a + b, 0) * 0.62);
  const spark = (k: "users" | "newUsers" | "sessions" | "views") => timeseries.slice(-14).map((p) => p[k]);

  const avgTime = 190 + rand() * 120;
  const engagement = 0.58 + rand() * 0.2;
  const kpis: Kpi[] = [
    { key: "users", label: "Total users", value: users, previous: prevUsers, format: "number", spark: spark("users") },
    { key: "newUsers", label: "New users", value: Math.round(users * 0.41), previous: Math.round(prevUsers * 0.45), format: "number", spark: spark("newUsers") },
    { key: "sessions", label: "Sessions", value: sessions, previous: Math.round(sessions * 0.86), format: "number", spark: spark("sessions") },
    { key: "views", label: "Page views", value: views, previous: Math.round(views * 0.83), format: "number", spark: spark("views") },
    { key: "avgTime", label: "Avg. time on dashboard", value: avgTime, previous: avgTime * 0.92, format: "duration", spark: spark("sessions").map((v, i) => v * (1 + Math.sin(i) * 0.1)) },
    { key: "engagement", label: "Engagement rate", value: engagement, previous: engagement - 0.03, format: "percent", spark: spark("users").map((v, i) => v * (1 + Math.cos(i) * 0.08)) },
  ];

  const pool = dashboardId === "all" ? DASHBOARDS : DASHBOARDS.filter((d) => d.id === dashboardId);
  const dashboards: DashboardStat[] = pool
    .map((d) => {
      const r = rng(hash(d.id + range));
      const weight = dashboardId === "all" ? 0.3 + r() * 1.4 : 1;
      const du = Math.round((users / Math.max(1, pool.length)) * weight * 1.6);
      return {
        id: d.id,
        name: d.name,
        category: d.category,
        users: du,
        views: Math.round(du * (3 + r() * 4)),
        avgTimeSec: 90 + r() * 300,
        change: -0.25 + r() * 0.7,
        trend: Array.from({ length: 14 }, (_, i) => Math.round(du / 14 * (0.7 + r() * 0.6 + i / 30))),
        connected: isConnected(d),
      };
    })
    .sort((a, b) => b.users - a.users);

  const pages: PageStat[] = [];
  for (const d of dashboards.slice(0, 6)) {
    const r = rng(hash(d.id + "pages"));
    for (const p of PAGES.slice(0, dashboards.length === 1 ? 6 : 2)) {
      pages.push({ dashboard: d.name, page: p, views: Math.round(d.views * (0.2 + r() * 0.35)), avgTimeSec: 40 + r() * 260, exitRate: 0.15 + r() * 0.5 });
    }
  }
  pages.sort((a, b) => b.views - a.views);

  const charts: ChartStat[] = CHARTS.map((c, i) => ({
    chart: c,
    dashboard: dashboards[i % dashboards.length].name,
    interactions: Math.round(views * (0.02 + rand() * 0.05)),
  })).sort((a, b) => b.interactions - a.interactions);

  const heatmap = Array.from({ length: 7 }, (_, day) =>
    Array.from({ length: 24 }, (_, h) => {
      const work = h >= 9 && h <= 18 ? 1 : h >= 7 && h <= 22 ? 0.45 : 0.08;
      const weekend = day >= 5 ? 0.35 : 1;
      const lunchDip = h === 13 ? 0.7 : 1;
      return Math.round(60 * scale * work * weekend * lunchDip * (0.6 + rand() * 0.8));
    }),
  );

  const countries = COUNTRIES.map((c, i) => ({ ...c, users: Math.round(users * COUNTRY_WEIGHTS[i] * (0.9 + rand() * 0.2)) }));

  const funnel = [
    { step: "Opened a dashboard", users },
    { step: "Viewed 2+ pages", users: Math.round(users * 0.68) },
    { step: "Interacted with a chart", users: Math.round(users * 0.44) },
    { step: "Applied a filter", users: Math.round(users * 0.27) },
    { step: "Exported / shared", users: Math.round(users * 0.09) },
  ];

  const top = dashboards[0];
  const rising = [...dashboards].sort((a, b) => b.change - a.change)[0];
  const falling = [...dashboards].sort((a, b) => a.change - b.change)[0];
  const busiest = heatmap.flatMap((row, d) => row.map((v, h) => ({ v, d, h }))).sort((a, b) => b.v - a.v)[0];
  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const insights: Insight[] = [
    { tone: "up", title: `${rising.name} is trending`, detail: `Visits up ${Math.round(rising.change * 100)}% compared with the previous period.` },
    { tone: "down", title: `${falling.name} needs attention`, detail: `Visits down ${Math.abs(Math.round(falling.change * 100))}% — consider sharing it with the team again.` },
    { tone: "info", title: `Peak time: ${weekdays[busiest.d]} ${busiest.h}:00`, detail: "Schedule report updates just before this hour so clients see fresh numbers." },
    { tone: "info", title: `${top.name} is the most visited`, detail: `${top.users.toLocaleString()} users spent on average ${Math.round(top.avgTimeSec / 60)} min on it.` },
  ];

  return {
    source: "demo",
    range,
    generatedAt: new Date().toISOString(),
    kpis,
    timeseries,
    channels: [
      { name: "Direct link", value: Math.round(sessions * 0.38) },
      { name: "Email", value: Math.round(sessions * 0.24) },
      { name: "Organic search", value: Math.round(sessions * 0.14) },
      { name: "Referral", value: Math.round(sessions * 0.13) },
      { name: "Social", value: Math.round(sessions * 0.11) },
    ],
    devices: [
      { name: "Desktop", value: Math.round(users * 0.64) },
      { name: "Mobile", value: Math.round(users * 0.29) },
      { name: "Tablet", value: Math.round(users * 0.07) },
    ],
    countries,
    dashboards,
    pages: pages.slice(0, 8),
    charts,
    funnel,
    heatmap,
    newVsReturning: [
      { name: "Returning", value: Math.round(users * 0.59) },
      { name: "New", value: Math.round(users * 0.41) },
    ],
    browsers: [
      { name: "Chrome", value: Math.round(users * 0.63) },
      { name: "Safari", value: Math.round(users * 0.17) },
      { name: "Edge", value: Math.round(users * 0.12) },
      { name: "Firefox", value: Math.round(users * 0.05) },
      { name: "Other", value: Math.round(users * 0.03) },
    ],
    timeOnPage: [
      { name: "0–10s", value: Math.round(views * 0.12) },
      { name: "10–30s", value: Math.round(views * 0.17) },
      { name: "30s–1m", value: Math.round(views * 0.21) },
      { name: "1–3m", value: Math.round(views * 0.26) },
      { name: "3–10m", value: Math.round(views * 0.16) },
      { name: "10m+", value: Math.round(views * 0.08) },
    ],
    insights,
  };
}

let eventCounter = 0;

function makeEvent(r: () => number, at: Date): LiveEvent {
  const c = COUNTRIES[Math.floor(r() * 5)];
  const d = DASHBOARDS[Math.floor(r() * DASHBOARDS.length)];
  return {
    id: `${at.getTime()}-${eventCounter++}`,
    at: at.toISOString(),
    user: NAMES[Math.floor(r() * NAMES.length)],
    country: c.country,
    code: c.code,
    action: ACTIONS[Math.floor(r() * ACTIONS.length)],
    dashboard: d.name,
    device: r() > 0.3 ? "Desktop" : "Mobile",
  };
}

export function getDemoRealtime(): RealtimeSnapshot {
  const now = Date.now();
  const r = rng(Math.floor(now / 4000));
  const wave = Math.sin(now / 60000) * 6;
  const activeNow = Math.round(38 + wave + r() * 8);
  const perMinute = Array.from({ length: 30 }, (_, i) => {
    const rr = rng(Math.floor(now / 60000) - (29 - i));
    return { minute: 29 - i, users: Math.round(18 + rr() * 22 + Math.sin(i / 4) * 5) };
  });
  const activePages = DASHBOARDS.slice(0, 7)
    .map((d) => ({ page: d.name, users: Math.max(1, Math.round(activeNow * (0.05 + r() * 0.25))) }))
    .sort((a, b) => b.users - a.users);
  const countries = COUNTRIES.slice(0, 5).map((c, i) => ({ ...c, users: Math.max(1, Math.round(activeNow * COUNTRY_WEIGHTS[i])) }));
  const events = Array.from({ length: 8 }, (_, i) => makeEvent(r, new Date(now - i * (4000 + r() * 9000))));
  return { source: "demo", activeNow, perMinute, activePages, countries, events };
}

export { pctChange };
