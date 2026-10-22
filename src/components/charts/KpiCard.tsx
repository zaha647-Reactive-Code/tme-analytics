"use client";

import { motion } from "framer-motion";
import type { Kpi } from "@/lib/types";
import { formatValue, pctChange } from "@/lib/format";
import { COLORS } from "@/lib/colors";
import { CountUp } from "@/components/ui/CountUp";
import { Delta } from "@/components/ui/Delta";
import { IconClock, IconCursor, IconEye, IconGauge, IconUserPlus, IconUsers } from "@/components/icons/AnimatedIcons";
import { Sparkline } from "./Sparkline";

const ICONS: Record<string, typeof IconUsers> = {
  users: IconUsers,
  newUsers: IconUserPlus,
  sessions: IconCursor,
  views: IconEye,
  avgTime: IconClock,
  engagement: IconGauge,
};

/** KPI tile: animated icon, counting number, change vs previous period and a sparkline */
export function KpiCard({ kpi, index, highlight = false }: { kpi: Kpi; index: number; highlight?: boolean }) {
  const Icon = ICONS[kpi.key] ?? IconUsers;

  return (
    <motion.div
      className={`card group relative overflow-hidden p-5 ${highlight ? "!border-ink bg-ink text-white" : ""}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-2xl ${highlight ? "bg-lime text-ink" : "bg-soft text-forest"}`}>
          <Icon size={20} live />
        </span>
        <Delta value={pctChange(kpi.value, kpi.previous)} className={highlight ? "!bg-white/10 !text-lime" : ""} />
      </div>
      <p className={`mt-5 text-[13px] font-medium ${highlight ? "text-white/60" : "text-muted"}`}>{kpi.label}</p>
      <p className="mt-1 text-[30px] font-semibold leading-none tracking-tight">
        <CountUp value={kpi.value} format={(n) => formatValue(n, kpi.format)} />
      </p>
      <div className="-mx-5 -mb-5 mt-4">
        <Sparkline data={kpi.spark} color={highlight ? COLORS.lime : index % 2 ? COLORS.grass : COLORS.sage} height={44} />
      </div>
    </motion.div>
  );
}
