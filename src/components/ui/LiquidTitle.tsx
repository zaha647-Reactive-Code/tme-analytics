"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { COLORS } from "@/lib/colors";

/**
 * "TME INSIGHTS" heading that fills with the brand colours like liquid poured from above.
 * A stream pours across the word and the level rises with moving waves. Once full, the
 * letters settle completely flat; tiny bubbles keep rising inside them and a few float
 * out of the top. Click the title to pour again.
 */

const W = 1000;
const H = 132;
const BASELINE = 110;
const CAP_TOP = 38; // top edge of the capital letters
const FULL = 36; // level reached near the end of the pour (waves at the top edge)
const TOP = 12; // final level: every letter completely filled, no wave visible
const EMPTY = 136;
const POUR = 3.6; // seconds

function wave(amp: number, period: number, width: number, depth: number) {
  let d = `M0 0 Q ${period / 4} ${-amp} ${period / 2} 0`;
  for (let x = period; x <= width; x += period / 2) d += ` T ${x} 0`;
  return `${d} V ${depth} H 0 Z`;
}

const BACK = wave(9, 260, W * 2, 260);
const FRONT = wave(7, 200, W * 2, 260);

/** Tiny bubbles that keep rising inside the letters */
const INNER_BUBBLES = [70, 160, 250, 330, 410, 480, 560, 640, 720, 790, 870, 940].map((x, i) => ({
  x,
  r: 1.6 + (i % 3) * 0.7,
  duration: 2.2 + (i % 4) * 0.5,
  delay: (i * 0.45) % 2.6,
}));

/** A few bubbles that escape from the top of the letters */
const ESCAPING_BUBBLES = [
  { x: 95, r: 2.8, delay: 0.4 },
  { x: 390, r: 2.2, delay: 2.1 },
  { x: 610, r: 2.6, delay: 3.6 },
  { x: 870, r: 2.0, delay: 5.0 },
];

export function LiquidTitle({ text = "TME INSIGHTS" }: { text?: string }) {
  const id = useId().replace(/:/g, "");
  const [run, setRun] = useState(0);

  const textProps = {
    x: W / 2,
    y: BASELINE,
    textAnchor: "middle" as const,
    fontSize: 104,
    fontWeight: 800,
    letterSpacing: "-2",
    style: { fontFamily: "var(--font-unbounded), sans-serif" },
  };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full cursor-pointer select-none overflow-visible" role="img" aria-label={text} onClick={() => setRun((r) => r + 1)}>
      <defs>
        <clipPath id={`clip-${id}`}>
          <text {...textProps}>{text}</text>
        </clipPath>
        <linearGradient id={`front-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={COLORS.sage} />
          <stop offset="35%" stopColor={COLORS.grass} />
          <stop offset="60%" stopColor={COLORS.lime} />
          <stop offset="100%" stopColor={COLORS.sage} />
        </linearGradient>
        <linearGradient id={`still-${id}`} gradientUnits="userSpaceOnUse" x1="0" x2={W} y1="0" y2="0">
          <stop offset="0%" stopColor={COLORS.sage} />
          <stop offset="40%" stopColor={COLORS.grass} />
          <stop offset="75%" stopColor={COLORS.lime} />
          <stop offset="100%" stopColor={COLORS.grass} />
        </linearGradient>
        <linearGradient id={`depth-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor={COLORS.forest} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* empty "glass" letters */}
      <text {...textProps} fill="#EDF1ED">
        {text}
      </text>

      <g key={run} clipPath={`url(#clip-${id})`}>
        {/* rising liquid with moving waves (same timing as before, then fills to the very top) */}
        <motion.g initial={{ y: EMPTY }} animate={{ y: [EMPTY, EMPTY, FULL, TOP] }} transition={{ duration: POUR, times: [0, 0.07, 0.9, 1], ease: "easeInOut" }}>
          <motion.path d={BACK} fill={COLORS.sage} opacity={0.45} animate={{ x: [-W / 2, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} transform="translate(0,-4)" />
          <motion.path d={FRONT} fill={`url(#front-${id})`} animate={{ x: [0, -W / 2] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
        </motion.g>

        {/* once full, the liquid settles: letters become completely flat and still */}
        <motion.rect x={0} y={0} width={W} height={H} fill={`url(#still-${id})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: POUR, duration: 0.5 }} />
        <rect x={0} y={CAP_TOP - 10} width={W} height={BASELINE - CAP_TOP + 14} fill={`url(#depth-${id})`} />

        {/* tiny bubbles rising inside the letters */}
        {INNER_BUBBLES.map((b) => (
          <motion.circle
            key={b.x}
            cx={b.x}
            r={b.r}
            fill="#fff"
            initial={{ cy: BASELINE, opacity: 0 }}
            animate={{ cy: [BASELINE, CAP_TOP + 4], cx: [b.x, b.x + 4, b.x - 3, b.x], opacity: [0, 0.85, 0.85, 0] }}
            transition={{ duration: b.duration, repeat: Infinity, delay: POUR + b.delay, ease: "easeOut" }}
          />
        ))}
      </g>

      {/* a few bubbles float out of the top of the letters */}
      {ESCAPING_BUBBLES.map((b) => (
        <motion.circle
          key={`${run}-${b.x}`}
          cx={b.x}
          r={b.r}
          fill={COLORS.grass}
          initial={{ cy: CAP_TOP + 6, opacity: 0 }}
          animate={{ cy: [CAP_TOP + 6, CAP_TOP - 34], cx: [b.x, b.x + 5, b.x - 2], opacity: [0, 0.9, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 4, delay: POUR + b.delay, ease: "easeOut" }}
        />
      ))}

      {/* the pouring stream, moving across the word while the level rises */}
      <motion.line
        key={`stream-${run}`}
        stroke={COLORS.grass}
        strokeWidth={6}
        strokeLinecap="round"
        initial={{ x1: 110, x2: 110, y1: -28, y2: -28, opacity: 1 }}
        animate={{
          x1: [110, 110, 890, 890],
          x2: [110, 110, 890, 890],
          y1: [-28, -28, -28, FULL],
          y2: [-28, EMPTY - 20, FULL, FULL],
          opacity: [1, 1, 1, 0],
        }}
        transition={{ duration: POUR + 0.4, times: [0, 0.07, 0.82, 1], ease: "easeInOut" }}
      />
    </svg>
  );
}