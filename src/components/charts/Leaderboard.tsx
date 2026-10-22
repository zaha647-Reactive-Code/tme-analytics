"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CircleCheck, CircleDashed } from "lucide-react";
import type { DashboardStat } from "@/lib/types";
import { COLORS } from "@/lib/colors";
import { formatDuration, formatNumber } from "@/lib/format";
import { healthLabel, healthScore } from "@/lib/score";
import { Delta } from "@/components/ui/Delta";
import { Sparkline } from "./Sparkline";

export function Leaderboard({ rows }: { rows: DashboardStat[] }) {
  const max = Math.max(1, ...rows.map((r) => r.users));
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[860px] text-sm">
        <thead>
          <tr className="text-left text-xs font-medium text-muted">
            <th className="pb-3 pl-2 font-medium">#</th>
            <th className="pb-3 font-medium">Dashboard</th>
            <th className="pb-3 font-medium">Users</th>
            <th className="pb-3 font-medium">Avg. time</th>
            <th className="pb-3 font-medium">Change</th>
            <th className="pb-3 font-medium">Health</th>
            <th className="pb-3 font-medium">Trend</th>
            <th className="pb-3 pr-2 text-right font-medium">Source</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const score = healthScore(r, max);
            return (
              <motion.tr key={r.id} className="group border-t border-line" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: Math.min(i, 10) * 0.03 }}>
                <td className="py-3 pl-2 text-xs font-semibold text-muted">{String(i + 1).padStart(2, "0")}</td>
                <td className="py-3 pr-4">
                  <Link href={`/dashboards/${r.id}`} className="font-medium transition-colors group-hover:text-forest">
                    {r.name}
                  </Link>
                  <p className="text-xs text-muted">{r.category}</p>
                </td>
                <td className="py-3 pr-4 font-semibold tabular-nums">{formatNumber(r.users)}</td>
                <td className="py-3 pr-4 text-muted">{formatDuration(r.avgTimeSec)}</td>
                <td className="py-3 pr-4">
                  <Delta value={r.change} />
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-soft">
                      <motion.div className="h-full rounded-full" style={{ background: score >= 70 ? COLORS.lime : score >= 45 ? COLORS.grass : COLORS.slate }} initial={{ width: 0 }} whileInView={{ width: `${score}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }} />
                    </div>
                    <span className="w-24 text-xs text-muted">
                      <b className="text-ink">{score}</b> · {healthLabel(score)}
                    </span>
                  </div>
                </td>
                <td className="w-28 py-1 pr-4">
                  <Sparkline data={r.trend} color={r.change >= 0 ? COLORS.sage : COLORS.slate} height={32} />
                </td>
                <td className="py-3 pr-2 text-right">
                  {r.connected ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-forest">
                      <CircleCheck size={14} /> Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-muted">
                      <CircleDashed size={14} /> Demo
                    </span>
                  )}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
