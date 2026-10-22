"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { COLORS } from "@/lib/colors";
import { formatNumber } from "@/lib/format";
import { Delta } from "@/components/ui/Delta";

type Item = { id?: string; label: string; value: number; sub?: string; change?: number; lead?: React.ReactNode };

/** Animated ranking list — the leader gets the chartreuse bar */
export function RankedBars({ items, hrefBase, format = formatNumber }: { items: Item[]; hrefBase?: string; format?: (n: number) => string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="grid gap-4">
      {items.map((item, i) => {
        const row = (
          <div className="group">
            <div className="mb-1.5 flex items-center gap-2.5 text-sm">
              {item.lead ?? <span className="w-5 text-xs font-semibold text-muted">{String(i + 1).padStart(2, "0")}</span>}
              <span className="truncate font-medium transition-colors group-hover:text-forest">{item.label}</span>
              {item.sub && <span className="hidden truncate text-xs text-muted sm:inline">{item.sub}</span>}
              <span className="ml-auto font-semibold tabular-nums">{format(item.value)}</span>
              {item.change !== undefined && <Delta value={item.change} className="hidden sm:inline-flex" />}
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-soft">
              <motion.div
                className="h-full rounded-full"
                style={{ background: i === 0 ? COLORS.lime : i < 3 ? COLORS.grass : COLORS.sage, opacity: i < 3 ? 1 : 0.75 }}
                initial={{ width: 0 }}
                whileInView={{ width: `${(item.value / max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        );
        return <li key={item.label}>{hrefBase && item.id ? <Link href={`${hrefBase}/${item.id}`}>{row}</Link> : row}</li>;
      })}
    </ul>
  );
}
