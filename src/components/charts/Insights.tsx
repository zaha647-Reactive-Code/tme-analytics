"use client";

import { motion } from "framer-motion";
import type { Insight } from "@/lib/types";
import { IconArrowDown, IconSpark, IconTrend } from "@/components/icons/AnimatedIcons";

const STYLE = {
  up: { Icon: IconTrend, cls: "bg-lime text-ink" },
  down: { Icon: IconArrowDown, cls: "bg-down/10 text-down" },
  info: { Icon: IconSpark, cls: "bg-soft text-forest" },
};

/** Plain-language highlights so clients can decide quickly */
export function Insights({ items }: { items: Insight[] }) {
  return (
    <ul className="grid gap-1">
      {items.map((it, i) => {
        const { Icon, cls } = STYLE[it.tone];
        return (
          <motion.li key={it.title} className="flex gap-3.5 rounded-2xl p-3 transition-colors hover:bg-soft" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}>
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${cls}`}>
              <Icon size={18} live />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-snug">{it.title}</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-muted">{it.detail}</p>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
