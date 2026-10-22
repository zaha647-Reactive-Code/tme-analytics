"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAV_GROUPS, isActive } from "./nav";
import { DASHBOARDS, isConnected } from "@/config/dashboards";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const connected = DASHBOARDS.filter(isConnected).length;

  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-line bg-white px-4 py-6">
      <Link href="/" onClick={onNavigate} className="mb-9 flex items-center gap-3 px-2">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#CBFF4D" strokeWidth="2.4" strokeLinecap="round">
            <motion.path d="M5 19v-5M10 19V8M15 19v-7M20 19V5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
          </svg>
        </span>
        <div>
          <p className="font-display text-[15px] font-bold tracking-tight">TME Insights</p>
          <p className="text-xs text-muted">Analytics Hub</p>
        </div>
      </Link>

      <nav className="flex flex-col gap-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted/70">{group.title}</p>
            <div className="flex flex-col gap-1">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = isActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onNavigate}
                    className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[14px] font-medium transition-colors ${active ? "text-white" : "text-muted hover:bg-soft hover:text-ink"}`}
                  >
                    {active && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-2xl bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                    <span className={`relative ${active ? "text-lime" : ""}`}>
                      <Icon size={19} live={active} />
                    </span>
                    <span className="relative">{label}</span>
                    {href === "/live" && (
                      <span className="relative ml-auto flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-grass opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-grass" />
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-line p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted">Connected dashboards</p>
          <p className="text-sm font-semibold">
            {connected}/{DASHBOARDS.length}
          </p>
        </div>
        <div className="mt-3 flex gap-[3px]">
          {DASHBOARDS.map((d, i) => (
            <motion.span
              key={d.id}
              className={`h-5 flex-1 rounded-full ${isConnected(d) ? "bg-grass" : "bg-soft"}`}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.3 + i * 0.03 }}
            />
          ))}
        </div>
        <Link href="/integrations" onClick={onNavigate} className="mt-3 inline-flex text-xs font-semibold text-forest hover:underline">
          Connect a dashboard →
        </Link>
      </div>
    </aside>
  );
}
