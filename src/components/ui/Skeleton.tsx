import clsx from "clsx";

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx("shimmer rounded-3xl", className)} />;
}

export function PageSkeleton() {
  return (
    <div className="grid gap-6">
      <Skeleton className="h-24 w-1/2" />
      <div className="grid grid-cols-2 gap-5 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-3">
        <Skeleton className="h-96 xl:col-span-2" />
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}
