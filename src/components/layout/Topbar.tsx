"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown, Menu } from "lucide-react";
import { useFilters } from "@/components/providers/FilterProvider";
import { DASHBOARDS } from "@/config/dashboards";
import type { RangeKey } from "@/lib/types";
import { currentNav } from "./nav";

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "7d", label: "7D" },
  { key: "28d", label: "28D" },
  { key: "90d", label: "90D" },
];

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const { range, setRange, dashboard, setDashboard } = useFilters();
  const nav = currentNav(pathname);
  const showDashboardFilter = nav.filters && pathname !== "/dashboards";

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/85 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 md:px-10">
        <button onClick={onMenu} className="rounded-xl p-2 text-muted hover:bg-soft lg:hidden" aria-label="Open menu">
          <Menu size={20} />
        </button>
        <p className="mr-auto text-sm text-muted">
          TME Insights <span className="mx-1.5 text-line">/</span>
          <span className="font-medium text-ink">{nav.label}</span>
        </p>

        {nav.filters && (
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            {showDashboardFilter && (
              <label className="relative flex-1 sm:flex-none">
                <select
                  value={dashboard}
                  onChange={(e) => setDashboard(e.target.value)}
                  className="h-10 w-full appearance-none rounded-full border border-line bg-white pl-4 pr-10 text-sm font-medium outline-none transition hover:border-sage focus:ring-2 focus:ring-lime/60 sm:w-56"
                >
                  <option value="all">All dashboards</option>
                  {DASHBOARDS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted" />
              </label>
            )}
            <div className="flex h-10 rounded-full border border-line bg-white p-1">
              {RANGES.map((r) => (
                <button key={r.key} onClick={() => setRange(r.key)} className={`relative rounded-full px-4 text-xs font-semibold transition-colors ${range === r.key ? "text-ink" : "text-muted hover:text-ink"}`}>
                  {range === r.key && <motion.span layoutId="range-pill" className="absolute inset-0 rounded-full bg-lime" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
                  <span className="relative">{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
