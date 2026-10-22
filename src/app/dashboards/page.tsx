"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { DASHBOARDS, isConnected } from "@/config/dashboards";
import { healthScore } from "@/lib/score";
import { formatDuration, formatNumber } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { CountUp } from "@/components/ui/CountUp";
import { DashboardTreemap } from "@/components/charts/DashboardTreemap";
import { BubbleChart } from "@/components/charts/BubbleChart";
import { CategoryChart } from "@/components/charts/CategoryChart";
import { Leaderboard } from "@/components/charts/Leaderboard";
import { IconBars, IconGrid, IconLayers, IconTarget } from "@/components/icons/AnimatedIcons";

export default function DashboardPortfolio() {
  const { data } = useAnalytics("all");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const categories = ["All", ...new Set(DASHBOARDS.map((d) => d.category))];

  const list = useMemo(() => (data?.dashboards ?? []).filter((d) => (cat === "All" || d.category === cat) && d.name.toLowerCase().includes(q.toLowerCase())), [data, q, cat]);

  if (!data) return <PageSkeleton />;

  const maxUsers = Math.max(1, ...data.dashboards.map((d) => d.users));
  const thriving = data.dashboards.filter((d) => healthScore(d, maxUsers) >= 70).length;
  const growing = data.dashboards.filter((d) => d.change > 0).length;
  const avgTime = data.dashboards.reduce((a, d) => a + d.avgTimeSec, 0) / (data.dashboards.length || 1);

  const stats = [
    { label: "Dashboards", value: DASHBOARDS.length, fmt: (n: number) => Math.round(n).toString(), note: `${DASHBOARDS.filter(isConnected).length} connected to GA4` },
    { label: "Growing this period", value: growing, fmt: (n: number) => Math.round(n).toString(), note: "more users than the period before" },
    { label: "Thriving", value: thriving, fmt: (n: number) => Math.round(n).toString(), note: "health score 70 or above" },
    { label: "Avg. time per visit", value: avgTime, fmt: formatDuration, note: "across all dashboards" },
  ];

  return (
    <div>
      <PageHeader eyebrow="Analytics" title="Dashboard Portfolio" description="All Looker Studio dashboards compared side by side — which ones clients use most, stay longest on, and which are growing." />

      <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
        {stats.map((s, i) => (
          <Card key={s.label} delay={i * 0.05} className={i === 0 ? "!border-lime !bg-lime" : ""}>
            <p className={`text-[13px] font-medium ${i === 0 ? "text-ink/70" : "text-muted"}`}>{s.label}</p>
            <p className="mt-2 text-[34px] font-semibold leading-none tracking-tight">
              <CountUp value={s.value} format={s.fmt} />
            </p>
            <p className={`mt-2 text-xs ${i === 0 ? "text-ink/70" : "text-muted"}`}>{s.note}</p>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-5">
        <Card title="Usage map" subtitle="Tile size = users · colour = category" icon={<IconGrid size={18} live />} className="xl:col-span-3">
          <DashboardTreemap data={data.dashboards} />
        </Card>
        <Card title="Reach vs. depth" subtitle="Users (→) against minutes per visit (↑). Bubble size = page views" icon={<IconTarget size={18} live />} className="xl:col-span-2" delay={0.08}>
          <BubbleChart data={data.dashboards} />
        </Card>
      </div>

      <div className="mt-5">
        <Card title="Categories" subtitle="Users per category (bars) and average minutes per visit (line)" icon={<IconBars size={18} live />}>
          <CategoryChart data={data.dashboards} />
        </Card>
      </div>

      <div className="mt-5">
        <Card
          title="Leaderboard"
          subtitle={`${list.length} of ${data.dashboards.length} dashboards · ${formatNumber(list.reduce((a, d) => a + d.users, 0))} users`}
          icon={<IconLayers size={18} live />}
          action={
            <label className="flex h-10 w-48 items-center gap-2 rounded-full border border-line px-3 transition focus-within:border-sage sm:w-64">
              <Search size={15} className="text-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-full bg-transparent text-sm outline-none" />
            </label>
          }
        >
          <div className="mb-5 flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${cat === c ? "bg-ink text-white" : "bg-soft text-muted hover:text-ink"}`}>
                {c}
              </button>
            ))}
          </div>
          <Leaderboard rows={list} />
        </Card>
      </div>
    </div>
  );
}
