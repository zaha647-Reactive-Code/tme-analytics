"use client";

import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { NamedValue } from "@/lib/types";
import { COLORS } from "@/lib/colors";
import { formatNumber } from "@/lib/format";
import { ChartTooltip } from "./ChartTooltip";

/** Distribution of time spent per page view; the most common bucket is highlighted */
export function Histogram({ data }: { data: NamedValue[] }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const peak = data.reduce((m, d, i) => (d.value > data[m].value ? i : m), 0);
  const rows = data.map((d) => ({ ...d, pct: `${Math.round((d.value / total) * 100)}%` }));
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 24, right: 0, bottom: 0, left: -14 }} barCategoryGap={10}>
          <CartesianGrid stroke={COLORS.grid} vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: COLORS.axis }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: COLORS.axis }} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(203,255,77,0.18)" }} />
          <Bar dataKey="value" name="Page views" radius={[12, 12, 4, 4]} animationDuration={1100}>
            {rows.map((_, i) => (
              <Cell key={i} fill={i === peak ? COLORS.lime : COLORS.sage} fillOpacity={i === peak ? 1 : 0.55 + i * 0.05} stroke={i === peak ? COLORS.ink : "none"} strokeWidth={1.5} />
            ))}
            <LabelList dataKey="pct" position="top" style={{ fontSize: 11, fill: COLORS.slate, fontWeight: 600 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
