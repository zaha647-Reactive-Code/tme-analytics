import type { DashboardStat } from "./types";

/**
 * 0–100 "health" score for a dashboard: how many people use it, how long they stay
 * and whether usage is growing. Helps clients see which reports matter most.
 */
export function healthScore(d: DashboardStat, maxUsers: number) {
  const reach = maxUsers ? d.users / maxUsers : 0;
  const depth = Math.min(1, d.avgTimeSec / 360);
  const growth = Math.max(0, Math.min(1, (d.change + 0.3) / 0.8));
  return Math.round((reach * 0.45 + depth * 0.35 + growth * 0.2) * 100);
}

export function healthLabel(score: number) {
  if (score >= 70) return "Thriving";
  if (score >= 45) return "Healthy";
  return "Needs attention";
}
