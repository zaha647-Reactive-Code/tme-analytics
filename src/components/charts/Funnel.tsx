"use client";

import { motion } from "framer-motion";
import type { FunnelStep } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { onColor } from "@/lib/colors";

const STEP_COLORS = ["#2E5E3A", "#6BAA75", "#84DD63", "#A9EC58", "#CBFF4D"];

/** Shows how deep users go: open → explore → interact → export */
export function Funnel({ steps }: { steps: FunnelStep[] }) {
  const top = steps[0]?.users || 1;
  return (
    <div className="grid gap-2">
      {steps.map((s, i) => {
        const pct = s.users / top;
        const bg = STEP_COLORS[i % STEP_COLORS.length];
        const drop = i > 0 ? 1 - s.users / (steps[i - 1].users || 1) : 0;
        return (
          <div key={s.step} className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div className="relative flex h-12 justify-center">
              <motion.div
                className="flex h-full items-center justify-center rounded-2xl text-[13px] font-semibold"
                style={{ background: bg, color: onColor(bg) }}
                initial={{ width: "0%" }}
                whileInView={{ width: `${Math.max(pct * 100, 16)}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                {Math.round(pct * 100)}%
              </motion.div>
            </div>
            <div className="w-40 text-right">
              <p className="truncate text-[13px] text-muted">{s.step}</p>
              <p className="text-sm font-semibold">
                {formatNumber(s.users)}
                {i > 0 && <span className="ml-1.5 text-xs font-normal text-down">−{Math.round(drop * 100)}%</span>}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
