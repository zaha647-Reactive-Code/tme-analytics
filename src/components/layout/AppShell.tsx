"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FilterProvider } from "@/components/providers/FilterProvider";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <FilterProvider>
      <div className="flex min-h-screen">
        <div className="sticky top-0 hidden h-screen shrink-0 lg:block">
          <Sidebar />
        </div>

        <AnimatePresence>
          {open && (
            <>
              <motion.div className="fixed inset-0 z-30 bg-ink/20 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
              <motion.div className="fixed inset-y-0 left-0 z-40 lg:hidden" initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: "spring", stiffness: 320, damping: 34 }}>
                <Sidebar onNavigate={() => setOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar onMenu={() => setOpen(true)} />
          <motion.main key={pathname} className="mx-auto w-full max-w-[1480px] flex-1 px-4 py-8 md:px-10" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            {children}
          </motion.main>
        </div>
      </div>
    </FilterProvider>
  );
}
