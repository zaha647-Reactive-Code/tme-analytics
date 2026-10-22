"use client";

import { motion } from "framer-motion";
import type { PageStat } from "@/lib/types";
import { formatDuration, formatNumber } from "@/lib/format";

export function PagesTable({ rows }: { rows: PageStat[] }) {
  const max = Math.max(1, ...rows.map((r) => r.views));
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full min-w-[520px] text-sm">
        <thead>
          <tr className="text-left text-xs text-muted">
            <th className="pb-3 font-medium">Page</th>
            <th className="pb-3 font-medium">Views</th>
            <th className="pb-3 text-right font-medium">Avg. time</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <motion.tr key={`${r.dashboard}-${r.page}`} className="border-t border-line" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
              <td className="py-3 pr-4">
                <p className="font-medium">{r.page}</p>
                <p className="text-xs text-muted">{r.dashboard}</p>
              </td>
              <td className="py-3 pr-4">
                <div className="flex items-center gap-3">
                  <span className="w-12 font-semibold tabular-nums">{formatNumber(r.views)}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-soft">
                    <motion.div className={`h-full rounded-full ${i === 0 ? "bg-lime" : "bg-sage"}`} initial={{ width: 0 }} whileInView={{ width: `${(r.views / max) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.9 }} />
                  </div>
                </div>
              </td>
              <td className="py-3 text-right text-muted">{formatDuration(r.avgTimeSec)}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
