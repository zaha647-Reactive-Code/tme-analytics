"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TimePoint } from "@/lib/types";
import { COLORS } from "@/lib/colors";
import { formatNumber } from "@/lib/format";
import { ChartTooltip } from "./ChartTooltip";

const METRICS = [
  { key: "users", label: "Users" },
  { key: "sessions", label: "Sessions" },
  { key: "views", label: "Page views" },
] as const;

type MetricKey = (typeof METRICS)[number]["key"];

/** Area for the chosen metric + dashed line for the same metric smoothed over 7 days */
export function TrendChart({ data, height = 300 }: { data: TimePoint[]; height?: number }) {
  const [metric, setMetric] = useState<MetricKey>("users");
  const rows = data.map((d, i) => {
    const win = data.slice(Math.max(0, i - 6), i + 1);
    return {
      label: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: d[metric],
      avg: Math.round(win.reduce((a, p) => a + p[metric], 0) / win.length),
    };
  });

  return (
    <div>
      <div className="mb-4 inline-flex rounded-full bg-soft p-1">
        {METRICS.map((m) => (
          <button key={m.key} onClick={() => setMetric(m.key)} className={`relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${metric === m.key ? "text-white" : "text-muted hover:text-ink"}`}>
            {metric === m.key && <motion.span layoutId="trend-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
            <span className="relative">{m.label}</span>
          </button>
        ))}
      </div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -14 }}>
            <defs>
              <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.grass} stopOpacity={0.45} />
                <stop offset="100%" stopColor={COLORS.lime} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={COLORS.grid} vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: COLORS.axis }} axisLine={false} tickLine={false} minTickGap={28} />
            <YAxis tick={{ fontSize: 11, fill: COLORS.axis }} axisLine={false} tickLine={false} tickFormatter={formatNumber} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: COLORS.slate, strokeDasharray: "3 4" }} />
            <Area key={metric} type="monotone" dataKey="value" name={METRICS.find((m) => m.key === metric)?.label} stroke={COLORS.sage} strokeWidth={2.5} fill="url(#trend-fill)" activeDot={{ r: 5, fill: COLORS.lime, stroke: COLORS.ink, strokeWidth: 2 }} animationDuration={1100} />
            <Line type="monotone" dataKey="avg" name="7-day average" stroke={COLORS.slate} strokeWidth={1.6} strokeDasharray="5 5" dot={false} animationDuration={1300} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
