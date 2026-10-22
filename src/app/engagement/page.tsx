"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { formatDuration, formatPercent } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Heatmap } from "@/components/charts/Heatmap";
import { Funnel } from "@/components/charts/Funnel";
import { Histogram } from "@/components/charts/Histogram";
import { CategoryRadar } from "@/components/charts/CategoryRadar";
import { Lollipop } from "@/components/charts/Lollipop";
import { PagesTable } from "@/components/charts/PagesTable";
import { IconBars, IconClock, IconCursor, IconEye, IconGauge, IconLayers, IconTarget, IconTrend } from "@/components/icons/AnimatedIcons";

export default function EngagementPage() {
  const { data, loading } = useAnalytics();
  if (!data) return <PageSkeleton />;

  const k = (key: string) => data.kpis.find((x) => x.key === key)?.value ?? 0;
  const tiles = [
    { label: "Avg. time on dashboard", value: k("avgTime"), fmt: formatDuration, Icon: IconClock },
    { label: "Engagement rate", value: k("engagement"), fmt: formatPercent, Icon: IconGauge },
    { label: "Pages per session", value: k("views") / (k("sessions") || 1), fmt: (n: number) => n.toFixed(1), Icon: IconEye },
    { label: "Chart interactions", value: data.charts.reduce((a, c) => a + c.interactions, 0), fmt: (n: number) => Math.round(n).toLocaleString("en-US"), Icon: IconCursor },
  ];

  return (
    <div className={`transition-opacity ${loading ? "opacity-60" : ""}`}>
      <Notice text={data.notice} />
      <PageHeader eyebrow="Analytics" title="Engagement" description="How long people stay, when they come, how deep they go and which charts they actually use." />

      <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
        {tiles.map(({ label, value, fmt, Icon }, i) => (
          <Card key={label} delay={i * 0.05} className={i === 0 ? "!border-ink !bg-ink text-white" : ""}>
            <span className={`grid h-10 w-10 place-items-center rounded-2xl ${i === 0 ? "bg-lime text-ink" : "bg-soft text-forest"}`}>
              <Icon size={20} live />
            </span>
            <p className={`mt-5 text-[13px] ${i === 0 ? "text-white/60" : "text-muted"}`}>{label}</p>
            <p className="mt-1 text-[30px] font-semibold leading-none tracking-tight">
              <CountUp value={value} format={fmt} />
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-5">
        <Card title="When people use the dashboards" subtitle="Users by weekday and hour — plan report refreshes before the busy hours" icon={<IconBars size={18} live />}>
          <Heatmap data={data.heatmap} />
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card title="Engagement funnel" subtitle="From opening a dashboard to exporting data" icon={<IconTarget size={18} live />}>
          <Funnel steps={data.funnel} />
        </Card>
        <Card title="Time spent per page view" subtitle="Most common duration highlighted" icon={<IconClock size={18} live />} delay={0.08}>
          <Histogram data={data.timeOnPage} />
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Card title="Depth by category" subtitle="Average minutes per visit and pages per user" icon={<IconLayers size={18} live />}>
          <CategoryRadar data={data.dashboards} />
        </Card>
        <Card title="Most used charts" subtitle="Clicks, filters and hovers inside the dashboards" icon={<IconCursor size={18} live />} delay={0.08}>
          <Lollipop data={data.charts} />
        </Card>
      </div>

      <div className="mt-5">
        <Card title="Top pages" subtitle="Most viewed pages inside the dashboards" icon={<IconTrend size={18} live />}>
          <PagesTable rows={data.pages} />
        </Card>
      </div>
    </div>
  );
}
