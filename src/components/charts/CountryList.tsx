"use client";

import { motion } from "framer-motion";
import type { CountryStat } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { Flag } from "@/components/ui/Flag";

export function CountryList({ data }: { data: CountryStat[] }) {
  const total = data.reduce((a, c) => a + c.users, 0) || 1;
  return (
    <ul className="grid gap-4">
      {data.map((c, i) => {
        const pct = c.users / total;
        return (
          <motion.li key={c.country} className="flex items-center gap-3" initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Flag code={c.code} className="h-5 w-7" />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span className="truncate font-medium">{c.country}</span>
                <span className="font-semibold tabular-nums">
                  {formatNumber(c.users)} <span className="text-xs font-normal text-muted">· {Math.round(pct * 100)}%</span>
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-soft">
                <motion.div className={`h-full rounded-full ${i === 0 ? "bg-lime" : "bg-sage"}`} initial={{ width: 0 }} whileInView={{ width: `${pct * 100}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.05 }} />
              </div>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
