"use client";

import { motion, type Transition } from "framer-motion";

/**
 * Hand-made animated line icons.
 * Every icon draws itself in when it appears; when `live` is true it also
 * plays a small looping motion (blink, tick, pulse …).
 */
type IconProps = { size?: number; className?: string; live?: boolean };

const DRAW = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 0.9, ease: "easeInOut" } as Transition,
};

function loop(live: boolean | undefined, duration: number, repeatDelay = 1.6): Transition {
  return live ? { duration, repeat: Infinity, repeatDelay, ease: "easeInOut" } : { duration: 0 };
}

function Svg({ size = 22, className, children }: { size?: number; className?: string; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {children}
    </svg>
  );
}

/** Invisible circle that fixes the rotation centre of a group */
const Pivot = ({ cx, cy, r }: { cx: number; cy: number; r: number }) => <circle cx={cx} cy={cy} r={r} stroke="none" fill="none" />;

export function IconUsers({ live, ...p }: IconProps) {
  return (
    <Svg {...p}>
      <motion.circle cx="9" cy="8" r="3.2" {...DRAW} />
      <motion.path d="M3.5 19.5c0-3.1 2.5-5.4 5.5-5.4s5.5 2.3 5.5 5.4" {...DRAW} />
      <motion.g animate={live ? { y: [0, -1.4, 0] } : undefined} transition={loop(live, 1.2)}>
        <motion.circle cx="16.6" cy="9" r="2.5" {...DRAW} />
        <motion.path d="M16 14.3c2.6.2 4.5 2.2 4.5 4.9" {...DRAW} />
      </motion.g>
    </Svg>
  );
}

export function IconUserPlus({ live, ...p }: IconProps) {
  return (
    <Svg {...p}>
      <motion.circle cx="10" cy="8" r="3.4" {...DRAW} />
      <motion.path d="M3.5 20c0-3.3 2.9-5.8 6.5-5.8 1.4 0 2.7.4 3.8 1" {...DRAW} />
      <motion.g style={{ originX: 0.5, originY: 0.5 }} animate={live ? { rotate: [0, 90, 90], scale: [1, 1.2, 1] } : undefined} transition={loop(live, 1)}>
        <motion.path d="M18 14v6M15 17h6" {...DRAW} />
      </motion.g>
    </Svg>
  );
}

export function IconEye({ live, ...p }: IconProps) {
  return (
    <Svg {...p}>
      <motion.g style={{ originY: 0.5 }} animate={live ? { scaleY: [1, 0.1, 1] } : undefined} transition={loop(live, 0.35, 3)}>
        <motion.path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" {...DRAW} />
        <motion.circle cx="12" cy="12" r="2.8" {...DRAW} />
      </motion.g>
    </Svg>
  );
}

export function IconClock({ live, ...p }: IconProps) {
  return (
    <Svg {...p}>
      <motion.circle cx="12" cy="12" r="9" {...DRAW} />
      <motion.g animate={live ? { rotate: 360 } : undefined} transition={live ? { duration: 6, repeat: Infinity, ease: "linear" } : undefined}>
        <Pivot cx={12} cy={12} r={6} />
        <motion.path d="M12 12V7" {...DRAW} />
      </motion.g>
      <motion.path d="M12 12l3 2" {...DRAW} />
    </Svg>
  );
}

export function IconCursor({ live, ...p }: IconProps) {
  return (
    <Svg {...p}>
      <motion.circle cx="7" cy="6" r="3" strokeWidth={1.2} initial={{ opacity: 0 }} animate={live ? { r: [1, 6], opacity: [0.8, 0] } : undefined} transition={loop(live, 1, 1.2)} />
      <motion.g animate={live ? { scale: [1, 0.86, 1] } : undefined} transition={loop(live, 0.4, 1.8)}>
        <motion.path d="M6 5l12.5 6.2-5.3 1.7-1.8 5.4L6 5z" {...DRAW} />
      </motion.g>
    </Svg>
  );
}

export function IconPulse({ live, ...p }: IconProps) {
  return (
    <Svg {...p}>
      <motion.path
        d="M2 12h4.2l2.4-6 4 12 2.6-6H22"
        initial={{ pathLength: 0 }}
        animate={live ? { pathLength: [0, 1, 1], opacity: [1, 1, 0] } : { pathLength: 1 }}
        transition={live ? { duration: 1.8, repeat: Infinity, ease: "easeInOut", times: [0, 0.7, 1] } : { duration: 0.9 }}
      />
    </Svg>
  );
}

export function IconGauge({ live, ...p }: IconProps) {
  return (
    <Svg {...p}>
      <motion.path d="M4 17a8 8 0 1 1 16 0" {...DRAW} />
      <motion.g initial={{ rotate: -60 }} animate={live ? { rotate: [-60, 35, 10, 25] } : { rotate: 20 }} transition={live ? { duration: 2.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } : { duration: 0.9 }}>
        <Pivot cx={12} cy={17} r={7} />
        <motion.path d="M12 17V10.5" />
      </motion.g>
      <circle cx="12" cy="17" r="1.2" fill="currentColor" />
    </Svg>
  );
}

export function IconGlobe({ live, ...p }: IconProps) {
  return (
    <Svg {...p}>
      <motion.circle cx="12" cy="12" r="9" {...DRAW} />
      <motion.path d="M3 12h18" {...DRAW} />
      <motion.ellipse cx="12" cy="12" ry="9" initial={{ rx: 4 }} animate={live ? { rx: [4, 8, 1, 4] } : { rx: 4 }} transition={live ? { duration: 4, repeat: Infinity, ease: "linear" } : undefined} />
    </Svg>
  );
}

export function IconPin({ live, ...p }: IconProps) {
  return (
    <Svg {...p}>
      <motion.g animate={live ? { y: [0, -2, 0] } : undefined} transition={loop(live, 0.8, 1.4)}>
        <motion.path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" {...DRAW} />
        <motion.circle cx="12" cy="10" r="2.5" {...DRAW} />
      </motion.g>
    </Svg>
  );
}

export function IconLayers({ live, ...p }: IconProps) {
  return (
    <Svg {...p}>
      <motion.path d="M3 16.5l9 4.5 9-4.5" {...DRAW} />
      <motion.path d="M3 12l9 4.5L21 12" {...DRAW} />
      <motion.g animate={live ? { y: [0, -2, 0] } : undefined} transition={loop(live, 1.2)}>
        <motion.path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" {...DRAW} />
      </motion.g>
    </Svg>
  );
}

export function IconGrid({ live, ...p }: IconProps) {
  const cells = [
    [4, 4],
    [13, 4],
    [4, 13],
    [13, 13],
  ];
  return (
    <Svg {...p}>
      {cells.map(([x, y], i) => (
        <motion.rect
          key={i}
          x={x}
          y={y}
          width="7"
          height="7"
          rx="2"
          style={{ originX: 0.5, originY: 0.5 }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={live ? { opacity: 1, scale: [1, 0.75, 1] } : { opacity: 1, scale: 1 }}
          transition={live ? { duration: 0.6, delay: i * 0.15, repeat: Infinity, repeatDelay: 2.2 } : { delay: i * 0.08 }}
        />
      ))}
    </Svg>
  );
}

export function IconBars({ live, ...p }: IconProps) {
  const bars = [
    { x: 5, h: 8 },
    { x: 11, h: 14 },
    { x: 17, h: 11 },
  ];
  return (
    <Svg {...p}>
      <motion.path d="M3 21h18" {...DRAW} />
      {bars.map((b, i) => (
        <motion.rect
          key={i}
          x={b.x - 1.5}
          y={19 - b.h}
          width="3"
          height={b.h}
          rx="1.5"
          style={{ originY: 1 }}
          initial={{ scaleY: 0 }}
          animate={live ? { scaleY: [1, 0.5, 1] } : { scaleY: 1 }}
          transition={live ? { duration: 1, delay: i * 0.2, repeat: Infinity, repeatDelay: 1.4 } : { delay: i * 0.1, duration: 0.6 }}
        />
      ))}
    </Svg>
  );
}

export function IconTrend({ live, ...p }: IconProps) {
  const t: Transition = live ? { duration: 1.2, repeat: Infinity, repeatDelay: 2 } : { duration: 0.9 };
  return (
    <Svg {...p}>
      <motion.path d="M3 17l6-6 4 4 8-8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={t} />
      <motion.path d="M15 7h6v6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={t} />
    </Svg>
  );
}

export function IconTarget({ live, ...p }: IconProps) {
  return (
    <Svg {...p}>
      <motion.circle cx="12" cy="12" r="9" {...DRAW} />
      <motion.circle cx="12" cy="12" r="5" {...DRAW} />
      <motion.circle cx="12" cy="12" r="1.6" fill="currentColor" animate={live ? { scale: [1, 1.8, 1] } : undefined} transition={loop(live, 0.8, 1.2)} />
    </Svg>
  );
}

export function IconSignal({ live, ...p }: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="1.8" fill="currentColor" />
      {["M8.5 8.5a5 5 0 0 0 0 7", "M15.5 8.5a5 5 0 0 1 0 7", "M5.6 5.6a9 9 0 0 0 0 12.8", "M18.4 5.6a9 9 0 0 1 0 12.8"].map((d, i) => (
        <motion.path key={d} d={d} initial={{ opacity: 0.25 }} animate={live ? { opacity: [0.25, 1, 0.25] } : { opacity: 1 }} transition={live ? { duration: 1.4, delay: (i >> 1) * 0.35, repeat: Infinity } : undefined} />
      ))}
    </Svg>
  );
}

export function IconSpark({ live, ...p }: IconProps) {
  return (
    <Svg {...p}>
      <motion.g style={{ originX: 0.5, originY: 0.5 }} animate={live ? { rotate: [0, 90], scale: [1, 0.85, 1] } : undefined} transition={loop(live, 1, 2)}>
        <motion.path d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9L12 3z" {...DRAW} />
      </motion.g>
      <motion.path d="M19 17v4M17 19h4" animate={live ? { opacity: [0, 1, 0] } : undefined} transition={loop(live, 1.2, 1)} />
    </Svg>
  );
}

export function IconPlug({ live, ...p }: IconProps) {
  return (
    <Svg {...p}>
      <motion.g animate={live ? { y: [0, 1.5, 0] } : undefined} transition={loop(live, 0.9, 1.5)}>
        <motion.path d="M9 2.5v4.5M15 2.5v4.5M6.5 7h11v3.5a5.5 5.5 0 0 1-11 0V7z" {...DRAW} />
      </motion.g>
      <motion.path d="M12 16v5.5" {...DRAW} />
    </Svg>
  );
}

export function IconArrowDown({ live, ...p }: IconProps) {
  return (
    <Svg {...p}>
      <motion.path d="M3 7l6 6 4-4 8 8" {...DRAW} />
      <motion.path d="M21 11v6h-6" animate={live ? { y: [0, 1.5, 0] } : undefined} transition={loop(live, 0.8)} />
    </Svg>
  );
}
