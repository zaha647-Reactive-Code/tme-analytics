"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { getDashboard, isConnected } from "@/config/dashboards";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { KpiCard } from "@/components/charts/KpiCard";
import { TrendChart } from "@/components/charts/TrendChart";
import { DevicesRadial } from "@/components/charts/DevicesRadial";
import { Heatmap } from "@/components/charts/Heatmap";
import { PagesTable } from "@/components/charts/PagesTable";
import { CountryList } from "@/components/charts/CountryList";
import { IconBars, IconClock, IconEye, IconGlobe, IconTrend } from "@/components/icons/AnimatedIcons";

export default function DashboardDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const config = getDashboard(id);
  const { data } = useAnalytics(id);

  if (!config) {
    return (
      <div className="card p-10 text-center">
        <p className="font-semibold">Dashboard not found</p>
        <Link href="/dashboards" className="mt-3 inline-block text-sm font-medium text-forest">
          ← Back to the portfolio
        </Link>
      </div>
    );
  }
  if (!data) return <PageSkeleton />;

  return (
    <div>
      <Link href="/dashboards" className="mb-6 inline-flex items-center gap-2 text-sm text-muted transition hover:text-ink">
        <ArrowLeft size={16} /> Dashboard Portfolio
      </Link>
      <PageHeader eyebrow={config.category} title={config.name} description="Visitor analytics for this Looker Studio report only.">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${isConnected(config) ? "bg-lime text-ink" : "border border-line text-muted"}`}>
            {isConnected(config) ? `Connected · ${config.measurementId}` : "Not connected · demo data"}
          </span>
          {config.lookerUrl && (
            <a href={config.lookerUrl} target="_blank" rel="noreferrer" className="flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-xs font-medium text-white">
              Open in Looker Studio <ExternalLink size={13} />
            </a>
          )}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis
          .filter((k) => ["users", "views", "avgTime", "engagement"].includes(k.key))
          .map((k, i) => (
            <KpiCard key={k.key} kpi={k} index={i} highlight={i === 0} />
          ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Traffic trend" icon={<IconTrend size={18} live />} className="xl:col-span-2">
          <TrendChart data={data.timeseries} />
        </Card>
        <Card title="Devices" icon={<IconEye size={18} live />} delay={0.08}>
          <DevicesRadial data={data.devices} />
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Pages in this dashboard" icon={<IconClock size={18} live />} className="xl:col-span-2">
          <PagesTable rows={data.pages} />
        </Card>
        <Card title="Countries" icon={<IconGlobe size={18} live />} delay={0.08}>
          <CountryList data={data.countries.slice(0, 6)} />
        </Card>
      </div>

      <div className="mt-5">
        <Card title="When people open it" icon={<IconBars size={18} live />}>
          <Heatmap data={data.heatmap} />
        </Card>
      </div>
    </div>
  );
}
