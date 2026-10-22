export type RangeKey = "7d" | "28d" | "90d";

export type Kpi = {
  key: string;
  label: string;
  value: number;
  previous: number;
  format: "number" | "duration" | "percent";
  spark: number[];
};

export type TimePoint = { date: string; users: number; newUsers: number; sessions: number; views: number };
export type NamedValue = { name: string; value: number };

export type DashboardStat = {
  id: string;
  name: string;
  category: string;
  users: number;
  views: number;
  avgTimeSec: number;
  change: number;
  trend: number[];
  connected: boolean;
};

export type PageStat = { dashboard: string; page: string; views: number; avgTimeSec: number; exitRate: number };
export type CountryStat = { country: string; code: string; users: number };
export type ChartStat = { chart: string; dashboard: string; interactions: number };
export type FunnelStep = { step: string; users: number };
export type Insight = { tone: "up" | "down" | "info"; title: string; detail: string };

export type AnalyticsSnapshot = {
  source: "demo" | "ga4";
  notice?: string;
  range: RangeKey;
  generatedAt: string;
  kpis: Kpi[];
  timeseries: TimePoint[];
  channels: NamedValue[];
  devices: NamedValue[];
  countries: CountryStat[];
  dashboards: DashboardStat[];
  pages: PageStat[];
  charts: ChartStat[];
  funnel: FunnelStep[];
  /** 7 rows (Mon..Sun) × 24 columns (hours) */
  heatmap: number[][];
  newVsReturning: NamedValue[];
  browsers: NamedValue[];
  /** How long a page view lasts, grouped into buckets (0–10s, 10–30s …) */
  timeOnPage: NamedValue[];
  insights: Insight[];
};

export type LiveEvent = {
  id: string;
  at: string;
  user: string;
  country: string;
  code: string;
  action: string;
  dashboard: string;
  device: string;
};

export type RealtimeSnapshot = {
  source: "demo" | "ga4";
  activeNow: number;
  perMinute: { minute: number; users: number }[];
  activePages: { page: string; users: number }[];
  countries: CountryStat[];
  events: LiveEvent[];
};
