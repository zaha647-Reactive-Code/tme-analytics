"use client";

import { motion } from "framer-motion";

export function PageHeader({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <motion.p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-sage" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className="h-1.5 w-1.5 rounded-full bg-grass" />
            {eyebrow}
          </motion.p>
        )}
        <motion.h1 className="font-display text-[26px] font-bold tracking-tight md:text-[32px]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {title}
        </motion.h1>
        <motion.p className="mt-2 max-w-2xl text-[15px] text-muted" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}>
          {description}
        </motion.p>
      </div>
      {children}
    </div>
  );
}
