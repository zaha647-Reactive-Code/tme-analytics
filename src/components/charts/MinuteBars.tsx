"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { COLORS } from "@/lib/colors";
import { ChartTooltip } from "./ChartTooltip";

export function MinuteBars({ data }: { data: { minute: number; users: number }[] }) {
  const rows = data.map((p) => ({ ...p, label: p.minute === 0 ? "now" : `${p.minute} min ago` }));
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 0, bottom: 0, left: 0 }} barCategoryGap={3}>
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: COLORS.axis }} axisLine={false} tickLine={false} interval={5} />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(107,170,117,0.08)" }} />
          <Bar dataKey="users" name="Active users" radius={[8, 8, 8, 8]} isAnimationActive={false}>
            {rows.map((b) => (
              <Cell key={b.minute} fill={b.minute === 0 ? COLORS.lime : b.minute < 5 ? COLORS.grass : COLORS.sage} fillOpacity={b.minute < 5 ? 1 : 0.35 + (30 - b.minute) / 60} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
