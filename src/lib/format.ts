export function formatNumber(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 10_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return Math.round(n).toLocaleString("en-US");
}

export function formatDuration(sec: number) {
  const s = Math.round(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m ${r.toString().padStart(2, "0")}s` : `${r}s`;
}

export function formatPercent(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

export function formatValue(n: number, kind: "number" | "duration" | "percent") {
  if (kind === "duration") return formatDuration(n);
  if (kind === "percent") return formatPercent(n);
  return formatNumber(n);
}

export function pctChange(current: number, previous: number) {
  if (!previous) return 0;
  return (current - previous) / previous;
}

export function timeAgo(iso: string) {
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  return `${Math.floor(s / 60)}m ago`;
}
