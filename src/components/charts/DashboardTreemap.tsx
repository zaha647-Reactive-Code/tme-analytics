"use client";

import { ResponsiveContainer, Tooltip, Treemap, type TreemapNode } from "recharts";
import type { DashboardStat } from "@/lib/types";
import { PALETTE, onColor } from "@/lib/colors";
import { formatNumber } from "@/lib/format";
import { ChartTooltip } from "./ChartTooltip";

function Tile(props: TreemapNode) {
  const { x, y, width, height, name, depth } = props;
  if (depth !== 1) return null;
  const fill = String(props.fill ?? PALETTE[0]);
  const text = onColor(fill);
  return (
    <g>
      <rect x={x + 2} y={y + 2} width={Math.max(0, width - 4)} height={Math.max(0, height - 4)} rx={14} fill={fill} className="transition-opacity hover:opacity-85" />
      {width > 90 && height > 46 && (
        <>
          <text x={x + 14} y={y + 26} fill={text} fontSize={13} fontWeight={600}>
            {name.length > width / 8 ? `${name.slice(0, Math.floor(width / 8))}…` : name}
          </text>
          <text x={x + 14} y={y + 44} fill={text} fillOpacity={0.75} fontSize={12}>
            {formatNumber(Number(props.value))} users
          </text>
        </>
      )}
    </g>
  );
}

/** Every dashboard as a tile; tile size = number of users, colour = category */
export function DashboardTreemap({ data }: { data: DashboardStat[] }) {
  const categories = [...new Set(data.map((d) => d.category))];
  const rows = data.map((d) => ({ name: d.name, size: d.users, fill: PALETTE[categories.indexOf(d.category) % PALETTE.length] }));
  return (
    <div>
      <div className="h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap data={rows} dataKey="size" nameKey="name" content={(p: TreemapNode) => <Tile {...p} />} isAnimationActive animationDuration={900}>
            <Tooltip content={<ChartTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {categories.map((c, i) => (
          <li key={c} className="flex items-center gap-2 text-[13px] text-muted">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: PALETTE[i % PALETTE.length] }} />
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
