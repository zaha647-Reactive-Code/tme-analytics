"use client";

import { motion } from "framer-motion";
import type { NamedValue } from "@/lib/types";
import { PALETTE, onColor } from "@/lib/colors";

/** One horizontal 100% bar split into segments, with a legend underneath */
export function ShareBar({ data }: { data: NamedValue[] }) {
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  return (
    <div>
      <div className="flex h-12 gap-1 overflow-hidden rounded-2xl">
        {data.map((d, i) => {
          const pct = d.value / total;
          const bg = PALETTE[i % PALETTE.length];
          return (
            <motion.div
              key={d.name}
              className="flex items-center justify-center rounded-xl text-xs font-semibold"
              style={{ background: bg, color: onColor(bg) }}
              initial={{ width: 0 }}
              whileInView={{ width: `${pct * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              title={`${d.name}: ${Math.round(pct * 100)}%`}
            >
              {pct > 0.08 && `${Math.round(pct * 100)}%`}
            </motion.div>
          );
        })}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {data.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2 text-[13px] text-muted">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
            {d.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
