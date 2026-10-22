"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { formatNumber } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { Notice } from "@/components/ui/Notice";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { AudienceArea } from "@/components/charts/AudienceArea";
import { CountryList } from "@/components/charts/CountryList";
import { DevicesRadial } from "@/components/charts/DevicesRadial";
import { DonutChart } from "@/components/charts/DonutChart";
import { RankedBars } from "@/components/charts/RankedBars";
import { IconGlobe, IconLayers, IconPin, IconTarget, IconUserPlus, IconUsers } from "@/components/icons/AnimatedIcons";

export default function AudiencePage() {
  const { data, loading } = useAnalytics();
  if (!data) return <PageSkeleton />;

  const users = data.kpis.find((k) => k.key === "users")?.value ?? 0;
  const newUsers = data.kpis.find((k) => k.key === "newUsers")?.value ?? 0;
  const nvr = data.newVsReturning;
  const returningShare = (nvr.find((x) => x.name === "Returning")?.value ?? 0) / (nvr.reduce((a, x) => a + x.value, 0) || 1);

  const tiles = [
    { label: "Total users", value: users, fmt: formatNumber, Icon: IconUsers },
    { label: "New users", value: newUsers, fmt: formatNumber, Icon: IconUserPlus },
    { label: "Come back again", value: returningShare * 100, fmt: (n: number) => `${Math.round(n)}%`, Icon: IconTarget },
    { label: "Countries", value: data.countries.length, fmt: (n: number) => Math.round(n).toString(), Icon: IconGlobe },
  ];

  return (
    <div className={`transition-opacity ${loading ? "opacity-60" : ""}`}>
      <Notice text={data.notice} />
      <PageHeader eyebrow="Analytics" title="Audience & Reach" description="Who opens the dashboards, where they are, what they use and how they found them." />

      <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
        {tiles.map(({ label, value, fmt, Icon }, i) => (
          <Card key={label} delay={i * 0.05}>
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-soft text-forest">
              <Icon size={20} live />
            </span>
            <p className="mt-5 text-[13px] text-muted">{label}</p>
            <p className="mt-1 text-[30px] font-semibold leading-none tracking-tight">
              <CountUp value={value} format={fmt} />
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="New vs. returning users" subtitle="Daily users split by whether they visited before" icon={<IconUsers size={18} live />} className="xl:col-span-2">
          <AudienceArea data={data.timeseries} />
        </Card>
        <Card title="Top countries" subtitle="Share of users" icon={<IconPin size={18} live />} delay={0.08}>
          <CountryList data={data.countries.slice(0, 6)} />
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card title="Devices" subtitle="Desktop, mobile and tablet" icon={<IconTarget size={18} live />}>
          <DevicesRadial data={data.devices} />
        </Card>
        <Card title="Traffic channels" subtitle="How they found the dashboards" icon={<IconLayers size={18} live />} delay={0.05}>
          <DonutChart data={data.channels} centerLabel="sessions" />
        </Card>
        <Card title="Browsers" subtitle="Users by browser" icon={<IconGlobe size={18} live />} delay={0.1}>
          <RankedBars items={data.browsers.map((b) => ({ label: b.name, value: b.value }))} />
        </Card>
      </div>
    </div>
  );
}
