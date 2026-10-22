"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SCALE } from "@/lib/colors";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Weekday × hour grid showing when people open the dashboards */
export function Heatmap({ data }: { data: number[][] }) {
  const max = Math.max(1, ...data.flat());
  const [hover, setHover] = useState<{ d: number; h: number } | null>(null);
  const color = (v: number) => SCALE[Math.min(SCALE.length - 1, Math.floor((v / max) * SCALE.length))];

  return (
    <div>
      <div className="overflow-x-auto scrollbar-thin">
        <div className="min-w-[600px]">
          {data.map((row, d) => (
            <div key={d} className="mb-1.5 flex items-center gap-1.5">
              <span className="w-9 shrink-0 text-xs text-muted">{DAYS[d]}</span>
              {row.map((v, h) => (
                <motion.div
                  key={h}
                  className="aspect-square flex-1 cursor-pointer rounded-md"
                  style={{ background: color(v) }}
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (h + d) * 0.02, duration: 0.3 }}
                  whileHover={{ scale: 1.25 }}
                  onMouseEnter={() => setHover({ d, h })}
                  onMouseLeave={() => setHover(null)}
                />
              ))}
            </div>
          ))}
          <div className="flex gap-1.5 pl-[42px] text-[10px] text-muted">
            {Array.from({ length: 24 }, (_, h) => (
              <span key={h} className="flex-1 text-center">
                {h % 3 === 0 ? `${h}h` : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span className="h-4">{hover ? `${DAYS[hover.d]} · ${hover.h}:00–${hover.h + 1}:00 · ${data[hover.d][hover.h]} users` : "Hover a square to see the number of users"}</span>
        <span className="flex items-center gap-1">
          Quiet
          {SCALE.map((c) => (
            <span key={c} className="h-3 w-3 rounded-[4px]" style={{ background: c }} />
          ))}
          Busy
        </span>
      </div>
    </div>
  );
}
