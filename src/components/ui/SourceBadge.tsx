export function SourceBadge({ source }: { source: "demo" | "ga4" }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-muted">
      <span className={`h-2 w-2 rounded-full ${source === "ga4" ? "animate-pulse bg-grass" : "bg-slate/50"}`} />
      {source === "ga4" ? "Live · Google Analytics 4" : "Demo data"}
    </span>
  );
}
