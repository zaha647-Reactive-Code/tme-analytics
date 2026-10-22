"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import type { DashboardStat } from "@/lib/types";
import { COLORS } from "@/lib/colors";
import { ChartTooltip } from "./ChartTooltip";

/** Average minutes per visit for each dashboard category */
export function CategoryRadar({ data }: { data: DashboardStat[] }) {
  const map = new Map<string, { t: number; v: number; n: number }>();
  for (const d of data) {
    const c = map.get(d.category) ?? { t: 0, v: 0, n: 0 };
    c.t += d.avgTimeSec;
    c.v += d.users ? d.views / d.users : 0;
    c.n += 1;
    map.set(d.category, c);
  }
  const rows = [...map].map(([category, c]) => ({ category, minutes: +(c.t / c.n / 60).toFixed(1), pages: +(c.v / c.n).toFixed(1) }));
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={rows} outerRadius="72%">
          <PolarGrid stroke={COLORS.grid} />
          <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: COLORS.slate }} />
          <Tooltip content={<ChartTooltip format={(n) => n.toFixed(1)} />} />
          <Radar name="Pages per user" dataKey="pages" stroke={COLORS.slate} fill={COLORS.slate} fillOpacity={0.12} strokeWidth={1.5} animationDuration={1200} />
          <Radar name="Avg minutes" dataKey="minutes" stroke={COLORS.sage} fill={COLORS.grass} fillOpacity={0.45} strokeWidth={2} dot={{ r: 3, fill: COLORS.lime, stroke: COLORS.forest }} animationDuration={1400} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
