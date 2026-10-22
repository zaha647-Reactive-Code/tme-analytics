"use client";

import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Sector, type PieSectorDataItem } from "recharts";
import type { NamedValue } from "@/lib/types";
import { PALETTE } from "@/lib/colors";
import { formatNumber } from "@/lib/format";

function ActiveShape(props: PieSectorDataItem) {
  return <Sector {...props} outerRadius={(props.outerRadius ?? 0) + 6} />;
}

export function DonutChart({ data, centerLabel }: { data: NamedValue[]; centerLabel: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const focus = hover !== null ? data[hover] : null;

  return (
    <div>
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="66%" outerRadius="88%" paddingAngle={2.5} cornerRadius={8} stroke="none" activeShape={ActiveShape} onMouseEnter={(_, i) => setHover(i)} onMouseLeave={() => setHover(null)} animationDuration={1200}>
              {data.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-[28px] font-semibold tracking-tight">{focus ? `${Math.round((focus.value / total) * 100)}%` : formatNumber(total)}</p>
            <p className="max-w-28 truncate text-xs text-muted">{focus ? focus.name : centerLabel}</p>
          </div>
        </div>
      </div>
      <ul className="mt-4 grid gap-1.5">
        {data.map((d, i) => (
          <li key={d.name} className={`flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-sm transition-colors ${hover === i ? "bg-soft" : ""}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="text-muted">{d.name}</span>
            <span className="ml-auto font-semibold">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
