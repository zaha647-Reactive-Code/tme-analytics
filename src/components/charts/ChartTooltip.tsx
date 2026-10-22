"use client";

import type { TooltipContentProps } from "recharts";
import { formatNumber } from "@/lib/format";

type Payload = { name?: string; value?: number | string; color?: string; payload?: { fill?: string } };

export function ChartTooltip(props: Partial<TooltipContentProps<number, string>> & { format?: (n: number) => string }) {
  const { active, label, format = formatNumber } = props;
  const payload = (props.payload ?? []) as unknown as readonly Payload[];
  if (!active || payload.length === 0) return null;
  return (
    <div className="rounded-2xl bg-ink px-3.5 py-2.5 text-xs text-white shadow-xl">
      {label !== undefined && label !== "" && <p className="mb-1.5 font-medium text-white/60">{String(label)}</p>}
      {payload.map((p, i) => (
        <p key={i} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color ?? p.payload?.fill }} />
          <span className="text-white/80">{p.name}</span>
          <span className="ml-auto pl-4 font-semibold">{format(Number(p.value))}</span>
        </p>
      ))}
    </div>
  );
}
