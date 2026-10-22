"use client";

import { useRealtime } from "@/hooks/useAnalytics";
import { useLiveEvents } from "@/hooks/useLiveEvents";
import { formatNumber } from "@/lib/format";
import { Card } from "@/components/ui/Card";
import { CountUp } from "@/components/ui/CountUp";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { Heartbeat } from "@/components/charts/Heartbeat";
import { MinuteBars } from "@/components/charts/MinuteBars";
import { LiveFeed } from "@/components/charts/LiveFeed";
import { RankedBars } from "@/components/charts/RankedBars";
import { CountryList } from "@/components/charts/CountryList";
import { IconBars, IconGrid, IconGlobe, IconPulse, IconSignal } from "@/components/icons/AnimatedIcons";

export default function LivePulse() {
  const rt = useRealtime(4000);
  const events = useLiveEvents(rt, 15);
  if (!rt) return <PageSkeleton />;

  const lastHalfHour = rt.perMinute.reduce((a, p) => a + p.users, 0);
  const peak = Math.max(...rt.perMinute.map((p) => p.users));

  return (
    <div>
      <PageHeader eyebrow="Realtime" title="Live Pulse" description="Who is inside your Looker Studio dashboards at this very moment. Refreshes every 4 seconds.">
        <SourceBadge source={rt.source} />
      </PageHeader>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card className="!bg-ink !border-ink text-white">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-white/70">
              <span className="text-lime">
                <IconSignal size={18} live />
              </span>
              Active users right now
            </span>
            <span className="rounded-full bg-lime px-2 py-0.5 text-[11px] font-semibold text-ink">LIVE</span>
          </div>
          <p className="mt-6 text-[88px] font-semibold leading-none tracking-tighter text-lime">
            <CountUp value={rt.activeNow} format={(n) => Math.round(n).toString()} />
          </p>
          <div className="-mx-6 mt-4">
            <Heartbeat />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
            <div>
              <p className="text-xl font-semibold">{formatNumber(lastHalfHour)}</p>
              <p className="text-xs text-white/60">visits · last 30 min</p>
            </div>
            <div>
              <p className="text-xl font-semibold">{peak}</p>
              <p className="text-xs text-white/60">peak per minute</p>
            </div>
          </div>
        </Card>

        <Card title="Users per minute" subtitle="Last 30 minutes" icon={<IconBars size={18} live />} className="xl:col-span-2" delay={0.08}>
          <MinuteBars data={rt.perMinute} />
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Activity stream" subtitle="Newest first" icon={<IconPulse size={18} live />} className="xl:col-span-2">
          <LiveFeed events={events} max={8} />
        </Card>
        <div className="grid gap-5">
          <Card title="Busiest dashboards now" icon={<IconGrid size={18} live />} delay={0.08}>
            <RankedBars items={rt.activePages.map((p) => ({ label: p.page, value: p.users }))} />
          </Card>
          <Card title="Countries now" icon={<IconGlobe size={18} live />} delay={0.12}>
            <CountryList data={rt.countries} />
          </Card>
        </div>
      </div>
    </div>
  );
}
