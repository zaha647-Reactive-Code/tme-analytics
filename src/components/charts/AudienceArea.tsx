"use client";

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TimePoint } from "@/lib/types";
import { COLORS } from "@/lib/colors";
import { formatNumber } from "@/lib/format";
import { ChartTooltip } from "./ChartTooltip";

/** Stacked area: returning users at the bottom, new users on top */
export function AudienceArea({ data }: { data: TimePoint[] }) {
  const rows = data.map((d) => ({
    label: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    returning: Math.max(0, d.users - d.newUsers),
    new: d.newUsers,
  }));
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -14 }}>
          <defs>
            <linearGradient id="aud-ret" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.sage} stopOpacity={0.9} />
              <stop offset="100%" stopColor={COLORS.sage} stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="aud-new" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.lime} stopOpacity={0.95} />
              <stop offset="100%" stopColor={COLORS.lime} stopOpacity={0.55} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={COLORS.grid} vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: COLORS.axis }} axisLine={false} tickLine={false} minTickGap={28} />
          <YAxis tick={{ fontSize: 11, fill: COLORS.axis }} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
          <Tooltip content={<ChartTooltip />} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: COLORS.slate, paddingTop: 8 }} />
          <Area type="monotone" stackId="a" dataKey="returning" name="Returning users" stroke={COLORS.sage} strokeWidth={2} fill="url(#aud-ret)" animationDuration={1100} />
          <Area type="monotone" stackId="a" dataKey="new" name="New users" stroke="#A9D93A" strokeWidth={2} fill="url(#aud-new)" animationDuration={1300} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
