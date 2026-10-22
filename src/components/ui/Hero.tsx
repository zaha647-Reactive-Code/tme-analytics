"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { RealtimeSnapshot } from "@/lib/types";
import { COLORS } from "@/lib/colors";
import { formatNumber } from "@/lib/format";
import { DASHBOARDS, isConnected } from "@/config/dashboards";
import { IconSignal } from "@/components/icons/AnimatedIcons";
import { LiquidTitle } from "./LiquidTitle";
import { CountUp } from "./CountUp";
import { SourceBadge } from "./SourceBadge";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export function Hero({ users, rt, source }: { users: number; rt: RealtimeSnapshot | null; source: "demo" | "ga4" }) {
  const bars = rt?.perMinute.slice(-20) ?? [];
  const max = Math.max(1, ...bars.map((b) => b.users));

  return (
    <section className="relative mb-8 grid items-center gap-8 xl:grid-cols-[1fr_320px]">
      <div className="dots pointer-events-none absolute -inset-x-10 -inset-y-6 -z-10" />

      <div>
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <motion.span className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            {DASHBOARDS.length} Looker Studio dashboards · one view
          </motion.span>
          <SourceBadge source={source} />
        </div>

        <div className="max-w-[820px] pt-6">
          <LiquidTitle />
        </div>

        <motion.p className="mt-3 max-w-xl text-[16px] leading-relaxed text-muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} suppressHydrationWarning>
          {greeting()}. Every visit, every page and every minute spent across your dashboards — gathered in one calm, clear place.
        </motion.p>

        <motion.div className="mt-6 flex flex-wrap gap-8" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          {[
            { label: "Users this period", value: formatNumber(users) },
            { label: "Dashboards tracked", value: String(DASHBOARDS.length) },
            { label: "Connected to GA4", value: `${DASHBOARDS.filter(isConnected).length}/${DASHBOARDS.length}` },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
              <p className="text-[13px] text-muted">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div className="card p-6" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-medium text-muted">
            <span className="text-sage">
              <IconSignal size={18} live />
            </span>
            Live right now
          </span>
          <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-semibold">LIVE</span>
        </div>
        <p className="mt-4 text-[56px] font-semibold leading-none tracking-tight">{rt ? <CountUp value={rt.activeNow} format={(n) => Math.round(n).toString()} /> : "—"}</p>
        <p className="mt-1 text-[13px] text-muted">people exploring your dashboards</p>

        <div className="mt-6 flex h-16 items-end gap-[3px]">
          {bars.map((b, i) => (
            <motion.span
              key={i}
              className="flex-1 rounded-full"
              style={{ background: i === bars.length - 1 ? COLORS.lime : i > bars.length - 6 ? COLORS.grass : COLORS.mist }}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(8, (b.users / max) * 100)}%` }}
              transition={{ duration: 0.7, delay: i * 0.02 }}
            />
          ))}
        </div>
        <p className="mt-2 text-[11px] text-muted">Last 20 minutes</p>

        <Link href="/live" className="mt-5 flex h-11 items-center justify-center rounded-full bg-ink text-sm font-medium text-white transition hover:bg-forest">
          Open Live Pulse →
        </Link>
      </motion.div>
    </section>
  );
}
