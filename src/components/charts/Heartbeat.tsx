"use client";

import { motion } from "framer-motion";
import { COLORS } from "@/lib/colors";

/** Endless heartbeat line — the "pulse" of live traffic */
export function Heartbeat() {
  const beat = "l40 0 l10 -6 l8 6 l14 0 l8 -46 l10 80 l9 -44 l11 10 l12 0 l10 -8 l8 8 l60 0";
  const d = `M0 60 ${beat} ${beat} ${beat} ${beat}`;
  return (
    <div className="relative h-28 w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
      <motion.svg viewBox="0 0 880 120" preserveAspectRatio="none" className="absolute inset-y-0 left-0 h-full w-[200%]" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
        <path d={d} fill="none" stroke={COLORS.grass} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      </motion.svg>
    </div>
  );
}
