"use client";

import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import type { DashboardStat } from "@/lib/types";
import { COLORS } from "@/lib/colors";
import { formatDuration, formatNumber } from "@/lib/format";

type Point = { name: string; users: number; minutes: number; views: number };

function BubbleTip({ active, payload }: { active?: boolean; payload?: readonly { payload: Point }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-2xl bg-ink px-3.5 py-2.5 text-xs text-white shadow-xl">
      <p className="mb-1 font-semibold">{p.name}</p>
      <p className="text-white/70">{formatNumber(p.users)} users · {formatDuration(p.minutes * 60)} avg · {formatNumber(p.views)} views</p>
    </div>
  );
}

/** Reach (users) vs depth (time spent). Top-right = most valuable dashboards */
export function BubbleChart({ data }: { data: DashboardStat[] }) {
  const rows: Point[] = data.map((d) => ({ name: d.name, users: d.users, minutes: +(d.avgTimeSec / 60).toFixed(1), views: d.views }));
  const avgUsers = rows.reduce((a, r) => a + r.users, 0) / (rows.length || 1);
  const stars = rows.filter((r) => r.users >= avgUsers);
  const others = rows.filter((r) => r.users < avgUsers);
  return (
    <div className="h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 10, right: 16, bottom: 10, left: -8 }}>
          <CartesianGrid stroke={COLORS.grid} />
          <XAxis type="number" dataKey="users" name="Users" tick={{ fontSize: 11, fill: COLORS.axis }} axisLine={false} tickLine={false} tickFormatter={formatNumber} label={{ value: "Users →", position: "insideBottomRight", offset: -4, fontSize: 11, fill: COLORS.axis }} />
          <YAxis type="number" dataKey="minutes" name="Avg minutes" tick={{ fontSize: 11, fill: COLORS.axis }} axisLine={false} tickLine={false} unit="m" />
          <ZAxis type="number" dataKey="views" range={[80, 900]} />
          <Tooltip content={<BubbleTip />} cursor={{ strokeDasharray: "3 4", stroke: COLORS.slate }} />
          <Scatter name="Below average reach" data={others} fill={COLORS.slate} fillOpacity={0.35} stroke={COLORS.slate} animationDuration={1000} />
          <Scatter name="Above average reach" data={stars} fill={COLORS.grass} fillOpacity={0.75} stroke={COLORS.forest} animationDuration={1000} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
