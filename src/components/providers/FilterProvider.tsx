"use client";

import { createContext, useContext, useState } from "react";
import type { RangeKey } from "@/lib/types";

type Filters = {
  range: RangeKey;
  setRange: (r: RangeKey) => void;
  dashboard: string;
  setDashboard: (id: string) => void;
};

const FilterContext = createContext<Filters | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<RangeKey>("28d");
  const [dashboard, setDashboard] = useState("all");
  return <FilterContext.Provider value={{ range, setRange, dashboard, setDashboard }}>{children}</FilterContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used inside <FilterProvider>");
  return ctx;
}
