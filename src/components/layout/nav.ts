import { IconBars, IconGrid, IconPin, IconPlug, IconSignal, IconTarget } from "@/components/icons/AnimatedIcons";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: typeof IconTarget;
  /** Show the date-range / dashboard filters in the top bar */
  filters?: boolean;
};

export const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { href: "/", label: "Command Center", description: "The big picture across all Looker Studio dashboards", icon: IconTarget, filters: true },
      { href: "/live", label: "Live Pulse", description: "Who is using the dashboards right now", icon: IconSignal },
    ],
  },
  {
    title: "Analytics",
    items: [
      { href: "/dashboards", label: "Dashboard Portfolio", description: "Compare all dashboards side by side", icon: IconGrid, filters: true },
      { href: "/audience", label: "Audience & Reach", description: "Who your users are and where they come from", icon: IconPin, filters: true },
      { href: "/engagement", label: "Engagement", description: "How long people stay and what they interact with", icon: IconBars, filters: true },
    ],
  },
  {
    title: "Setup",
    items: [{ href: "/integrations", label: "Integrations", description: "Connect Looker Studio dashboards with a Measurement ID", icon: IconPlug }],
  },
];

export const NAV = NAV_GROUPS.flatMap((g) => g.items);

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function currentNav(pathname: string) {
  return NAV.find((n) => isActive(pathname, n.href)) ?? NAV[0];
}
