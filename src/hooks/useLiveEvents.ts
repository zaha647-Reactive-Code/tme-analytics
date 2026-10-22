"use client";

import { useEffect, useRef, useState } from "react";
import type { LiveEvent, RealtimeSnapshot } from "@/lib/types";

/** Merges each realtime poll into a running list so new events animate in */
export function useLiveEvents(rt: RealtimeSnapshot | null, keep = 12) {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const seen = useRef(new Set<string>());

  useEffect(() => {
    if (!rt) return;
    const fresh = rt.events.filter((e) => !seen.current.has(e.id));
    if (fresh.length === 0) return;
    fresh.forEach((e) => seen.current.add(e.id));
    setEvents((prev) => [...(prev.length ? fresh.slice(0, 2) : fresh), ...prev].slice(0, keep));
  }, [rt, keep]);

  return events;
}
