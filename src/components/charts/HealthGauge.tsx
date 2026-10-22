"use client";

import { motion } from "framer-motion";
import { COLORS } from "@/lib/colors";
import { CountUp } from "@/components/ui/CountUp";

/** Semicircle gauge 0–100 drawn with an animated stroke */
export function HealthGauge({ score, label, caption }: { score: number; label: string; caption: string }) {
  const R = 80;
  const len = Math.PI * R;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 116" className="w-full max-w-[280px]">
        <defs>
          <linearGradient id="gauge-grad" x1="0" x2="1">
            <stop offset="0%" stopColor={COLORS.sage} />
            <stop offset="60%" stopColor={COLORS.grass} />
            <stop offset="100%" stopColor={COLORS.lime} />
          </linearGradient>
        </defs>
        <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke={COLORS.mist} strokeWidth="16" strokeLinecap="round" />
        <motion.path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={len}
          initial={{ strokeDashoffset: len }}
          whileInView={{ strokeDashoffset: len * (1 - score / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        {[0, 25, 50, 75, 100].map((t) => {
          const a = Math.PI * (1 - t / 100);
          return <circle key={t} cx={100 + Math.cos(a) * 62} cy={100 - Math.sin(a) * 62} r="1.6" fill={COLORS.axis} />;
        })}
      </svg>
      <div className="-mt-14 text-center">
        <p className="text-[40px] font-semibold leading-none tracking-tight">
          <CountUp value={score} format={(n) => Math.round(n).toString()} />
        </p>
        <p className="mt-1 text-sm font-semibold text-forest">{label}</p>
      </div>
      <p className="mt-4 max-w-[260px] text-center text-[13px] text-muted">{caption}</p>
    </div>
  );
}
