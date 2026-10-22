import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import clsx from "clsx";

export function Delta({ value, className }: { value: number; className?: string }) {
  const up = value >= 0;
  return (
    <span className={clsx("inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold", up ? "bg-lime/50 text-forest" : "bg-down/10 text-down", className)}>
      {up ? <ArrowUpRight size={13} strokeWidth={2.4} /> : <ArrowDownRight size={13} strokeWidth={2.4} />}
      {Math.abs(value * 100).toFixed(1)}%
    </span>
  );
}
