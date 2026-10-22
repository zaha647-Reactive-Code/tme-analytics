"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LiveEvent } from "@/lib/types";
import { timeAgo } from "@/lib/format";
import { PALETTE, onColor } from "@/lib/colors";
import { Flag } from "@/components/ui/Flag";

/** Activity stream; new events slide in from the top */
export function LiveFeed({ events, max = 6 }: { events: LiveEvent[]; max?: number }) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  if (events.length === 0) return <p className="py-10 text-center text-sm text-muted">Waiting for activity…</p>;

  return (
    <ul className="relative grid gap-2">
      <AnimatePresence initial={false}>
        {events.slice(0, max).map((e) => {
          const bg = PALETTE[e.user.charCodeAt(0) % 5];
          return (
            <motion.li
              key={e.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="flex items-center gap-3 rounded-2xl border border-line bg-white px-3 py-2.5"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold" style={{ background: bg, color: onColor(bg) }}>
                {e.user[0]}
              </span>
              <div className="min-w-0 flex-1 text-sm">
                <p className="truncate">
                  <span className="font-semibold">{e.user}</span> <span className="text-muted">{e.action}</span> <span className="font-medium">{e.dashboard}</span>
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                  <Flag code={e.code} className="h-3 w-[18px]" /> {e.country} · {e.device}
                </p>
              </div>
              <span className="shrink-0 text-[11px] text-muted" suppressHydrationWarning>
                {timeAgo(e.at)}
              </span>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
