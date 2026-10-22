import * as Flags from "country-flag-icons/react/3x2";

type FlagComponent = (props: { title?: string; className?: string }) => React.ReactElement;

/** Country flag as an inline SVG (emoji flags do not show on Windows, and this works offline) */
export function Flag({ code, className = "h-4 w-6" }: { code: string; className?: string }) {
  const Svg = (Flags as unknown as Record<string, FlagComponent | undefined>)[code?.toUpperCase()];
  if (!Svg) return <span className={`${className} inline-block shrink-0 rounded-[3px] bg-soft`} />;
  return (
    <span className={`${className} inline-flex shrink-0 overflow-hidden rounded-[3px] shadow-[0_0_0_1px_rgba(0,0,0,0.06)]`}>
      <Svg title={code} className="h-full w-full" />
    </span>
  );
}
