"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type Props = {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  delay?: number;
  children: React.ReactNode;
};

export function Card({ title, subtitle, icon, action, className, delay = 0, children }: Props) {
  return (
    <motion.section
      className={clsx("card flex flex-col p-6", className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {(title || action) && (
        <header className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {icon && <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-soft text-forest">{icon}</span>}
            <div>
              {title && <h2 className="text-[16px] font-semibold tracking-tight">{title}</h2>}
              {subtitle && <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p>}
            </div>
          </div>
          {action}
        </header>
      )}
      <div className="min-h-0 flex-1">{children}</div>
    </motion.section>
  );
}
