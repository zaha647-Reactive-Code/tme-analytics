"use client";

import Link from "next/link";
import { useAnalytics, useRealtime } from "@/hooks/useAnalytics";
import { healthLabel, healthScore } from "@/lib/score";
import { Hero } from "@/components/ui/Hero";
import { Card } from "@/components/ui/Card";
import { Notice } from "@/components/ui/Notice";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { KpiCard } from "@/components/charts/KpiCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { HealthGauge } from "@/components/charts/HealthGauge";
import { RankedBars } from "@/components/charts/RankedBars";
import { Insights } from "@/components/charts/Insights";
import { ShareBar } from "@/components/charts/ShareBar";
import { IconGauge, IconGrid, IconLayers, IconSpark, IconTrend } from "@/components/icons/AnimatedIcons";

export default function CommandCenter() {
  const { data, loading } = useAnalytics();
  const rt = useRealtime(4000);

  if (!data) return <PageSkeleton />;

  const maxUsers = Math.max(1, ...data.dashboards.map((d) => d.users));
  const health = Math.round(data.dashboards.reduce((a, d) => a + healthScore(d, maxUsers), 0) / (data.dashboards.length || 1));
  const users = data.kpis.find((k) => k.key === "users")?.value ?? 0;

  return (
    <div className={`transition-opacity ${loading ? "opacity-60" : ""}`}>
      <Notice text={data.notice} />
      <Hero users={users} rt={rt} source={data.source} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis
          .filter((k) => ["users", "sessions", "avgTime", "engagement"].includes(k.key))
          .map((k, i) => (
            <KpiCard key={k.key} kpi={k} index={i} highlight={i === 0} />
          ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Traffic trend" subtitle="Across every connected dashboard" icon={<IconTrend size={18} live />} className="xl:col-span-2">
          <TrendChart data={data.timeseries} />
        </Card>
        <Card title="Portfolio health" subtitle="Reach, depth and growth combined" icon={<IconGauge size={18} live />} delay={0.08}>
          <div className="flex h-full flex-col justify-center">
            <HealthGauge score={health} label={healthLabel(health)} caption="Average health score of all dashboards for the selected period. 70+ means clients rely on them daily." />
          </div>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card
          title="Top dashboards"
          subtitle="Ranked by users"
          icon={<IconGrid size={18} live />}
          className="xl:col-span-2"
          action={
            <Link href="/dashboards" className="rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition hover:border-ink hover:text-ink">
              See all →
            </Link>
          }
        >
          <RankedBars hrefBase="/dashboards" items={data.dashboards.slice(0, 6).map((d) => ({ id: d.id, label: d.name, value: d.users, sub: d.category, change: d.change }))} />
        </Card>
        <Card title="What needs your attention" subtitle="Generated from this period's data" icon={<IconSpark size={18} live />} delay={0.08}>
          <Insights items={data.insights} />
        </Card>
      </div>

      <div className="mt-5">
        <Card title="How people arrive" subtitle="Share of sessions by traffic channel" icon={<IconLayers size={18} live />}>
          <ShareBar data={data.channels} />
        </Card>
      </div>
    </div>
  );
}
