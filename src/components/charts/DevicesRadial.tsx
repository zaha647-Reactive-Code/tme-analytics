"use client";

import { PolarAngleAxis, RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import type { NamedValue } from "@/lib/types";
import { COLORS } from "@/lib/colors";
import { formatNumber } from "@/lib/format";

const COLORS_BY_RING = [COLORS.sage, COLORS.grass, COLORS.lime];

/** Concentric rings — one per device type */
export function DevicesRadial({ data }: { data: NamedValue[] }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const rows = data.slice(0, 3).map((d, i) => ({ ...d, pct: Math.round((d.value / total) * 100), fill: COLORS_BY_RING[i] })).reverse();
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="h-52 w-52 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart data={rows} innerRadius="38%" outerRadius="100%" startAngle={90} endAngle={-270} barSize={16}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="pct" background={{ fill: COLORS.mist }} cornerRadius={10} animationDuration={1300} />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <ul className="grid w-full gap-3">
        {[...rows].reverse().map((d) => (
          <li key={d.name} className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ background: d.fill }} />
            <span className="text-sm text-muted">{d.name}</span>
            <span className="ml-auto text-sm font-semibold">{d.pct}%</span>
            <span className="w-14 text-right text-xs text-muted">{formatNumber(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
