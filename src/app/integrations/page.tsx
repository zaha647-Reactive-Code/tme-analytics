"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CircleCheck, CircleDashed, Copy } from "lucide-react";
import { DASHBOARDS, isConnected } from "@/config/dashboards";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { SourceBadge } from "@/components/ui/SourceBadge";
import { IconLayers, IconPlug } from "@/components/icons/AnimatedIcons";

const STEPS = [
  { title: "Create a GA4 property", body: "analytics.google.com → Admin → Create property → add a Web data stream. Copy the Measurement ID (G-XXXXXXXXXX) and the numeric Property ID." },
  { title: "Add the ID in Looker Studio", body: "Open each report → File → Report settings → “Google Analytics measurement ID” → paste the G- ID." },
  { title: "Register the dashboard here", body: "In src/config/dashboards.ts fill measurementId and lookerReportId (the part after /reporting/ in the report URL)." },
  { title: "Give this app read access", body: "Google Cloud → service account → enable “Google Analytics Data API”. In GA4 → Property access management, add the service account email as Viewer." },
  { title: "Switch to live mode", body: "Copy .env.example to .env.local, set ANALYTICS_MODE=ga4 and the Google values, then restart the app." },
];

export default function IntegrationsPage() {
  const { data } = useAnalytics("all");
  const connected = DASHBOARDS.filter(isConnected).length;
  const [copied, setCopied] = useState("");

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div>
      <PageHeader eyebrow="Setup" title="Integrations" description="Plug a GA4 Measurement ID into each Looker Studio dashboard and its data flows into TME Insights automatically.">
        {data && <SourceBadge source={data.source} />}
      </PageHeader>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <Card title="Connect a dashboard" subtitle="Five steps — done once per dashboard" icon={<IconPlug size={18} live />} className="xl:col-span-2">
          <ol className="relative grid gap-6 border-l border-dashed border-sage/50 pl-7">
            {STEPS.map((s, i) => (
              <motion.li key={s.title} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="relative">
                <span className={`absolute -left-[42px] grid h-7 w-7 place-items-center rounded-full text-xs font-semibold ${i === 0 ? "bg-lime text-ink" : "border border-line bg-white text-muted"}`}>{i + 1}</span>
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{s.body}</p>
              </motion.li>
            ))}
          </ol>
        </Card>

        <Card title="Dashboards" subtitle={`${connected} of ${DASHBOARDS.length} connected`} icon={<IconLayers size={18} live />} className="xl:col-span-3" delay={0.08}>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="text-left text-xs text-muted">
                  <th className="pb-3 font-medium">Dashboard</th>
                  <th className="pb-3 font-medium">Measurement ID</th>
                  <th className="pb-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {DASHBOARDS.map((d) => {
                  const ok = isConnected(d);
                  return (
                    <tr key={d.id} className="border-t border-line">
                      <td className="py-3 pr-3">
                        <p className="font-medium">{d.name}</p>
                        <button onClick={() => copy(d.id)} className="mt-0.5 flex items-center gap-1 text-xs text-muted transition hover:text-forest">
                          {d.id} <Copy size={11} /> {copied === d.id && <span className="text-forest">copied</span>}
                        </button>
                      </td>
                      <td className="py-3 pr-3 font-mono text-xs">{d.measurementId || <span className="text-muted">not set</span>}</td>
                      <td className="py-3 text-right">
                        {ok ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-lime px-2.5 py-1 text-xs font-medium text-ink">
                            <CircleCheck size={13} /> Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-soft px-2.5 py-1 text-xs font-medium text-muted">
                            <CircleDashed size={13} /> Demo
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
