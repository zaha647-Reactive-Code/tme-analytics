"use client";

import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DashboardStat } from "@/lib/types";
import { COLORS } from "@/lib/colors";
import { formatNumber } from "@/lib/format";
import { ChartTooltip } from "./ChartTooltip";

/** Users per category (bars) with average minutes per visit (line) */
export function CategoryChart({ data }: { data: DashboardStat[] }) {
  const map = new Map<string, { category: string; users: number; time: number; n: number }>();
  for (const d of data) {
    const c = map.get(d.category) ?? { category: d.category, users: 0, time: 0, n: 0 };
    c.users += d.users;
    c.time += d.avgTimeSec;
    c.n += 1;
    map.set(d.category, c);
  }
  const rows = [...map.values()].map((c) => ({ category: c.category, users: c.users, minutes: +(c.time / c.n / 60).toFixed(1) })).sort((a, b) => b.users - a.users);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rows} margin={{ top: 10, right: 0, bottom: 0, left: -14 }}>
          <defs>
            <linearGradient id="cat-bar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.grass} />
              <stop offset="100%" stopColor={COLORS.sage} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={COLORS.grid} vertical={false} />
          <XAxis dataKey="category" tick={{ fontSize: 11, fill: COLORS.axis }} axisLine={false} tickLine={false} interval={0} />
          <YAxis yAxisId="u" tick={{ fontSize: 11, fill: COLORS.axis }} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
          <YAxis yAxisId="m" orientation="right" hide />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(203,255,77,0.18)" }} />
          <Bar yAxisId="u" dataKey="users" name="Users" fill="url(#cat-bar)" radius={[10, 10, 4, 4]} barSize={34} animationDuration={1000} />
          <Line yAxisId="m" type="monotone" dataKey="minutes" name="Avg minutes" stroke={COLORS.ink} strokeWidth={2} dot={{ r: 4, fill: COLORS.lime, stroke: COLORS.ink, strokeWidth: 2 }} animationDuration={1300} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
