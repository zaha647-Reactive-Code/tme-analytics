"use client";

import { useEffect, useState } from "react";
import { useFilters } from "@/components/providers/FilterProvider";
import type { AnalyticsSnapshot, RealtimeSnapshot } from "@/lib/types";

/** Loads analytics for the selected date range and dashboard (or a fixed one) */
export function useAnalytics(dashboardOverride?: string) {
  const { range, dashboard } = useFilters();
  const target = dashboardOverride ?? dashboard;
  const [data, setData] = useState<AnalyticsSnapshot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/analytics?range=${range}&dashboard=${encodeURIComponent(target)}`)
      .then((r) => r.json())
      .then((json: AnalyticsSnapshot) => !cancelled && setData(json))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [range, target]);

  return { data, loading };
}

/** Polls the realtime endpoint every `intervalMs` milliseconds */
export function useRealtime(intervalMs = 5000) {
  const [data, setData] = useState<RealtimeSnapshot | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () =>
      fetch("/api/realtime")
        .then((r) => r.json())
        .then((json: RealtimeSnapshot) => !cancelled && setData(json))
        .catch(() => {});
    load();
    const id = setInterval(load, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [intervalMs]);

  return data;
}
