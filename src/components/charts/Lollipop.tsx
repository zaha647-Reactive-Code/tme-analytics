"use client";

import { motion } from "framer-motion";
import type { ChartStat } from "@/lib/types";
import { formatNumber } from "@/lib/format";

/** Lollipop chart for the most used charts inside the dashboards */
export function Lollipop({ data }: { data: ChartStat[] }) {
  const max = Math.max(1, ...data.map((d) => d.interactions));
  return (
    <ul className="grid gap-3.5">
      {data.map((d, i) => {
        const pct = (d.interactions / max) * 100;
        return (
          <li key={d.chart} className="grid grid-cols-[130px_1fr_auto] items-center gap-3 text-sm sm:grid-cols-[170px_1fr_auto]">
            <div className="min-w-0">
              <p className="truncate font-medium">{d.chart}</p>
              <p className="truncate text-xs text-muted">{d.dashboard}</p>
            </div>
            <div className="relative h-4">
              <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-line" />
              <motion.div className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-sage" initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 0.9, delay: i * 0.06 }} />
              <motion.span
                className={`absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-forest ${i === 0 ? "bg-lime" : "bg-white"}`}
                initial={{ left: 0 }}
                whileInView={{ left: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.06 }}
              />
            </div>
            <span className="w-14 text-right font-semibold tabular-nums">{formatNumber(d.interactions)}</span>
          </li>
        );
      })}
    </ul>
  );
}
