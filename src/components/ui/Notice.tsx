export function Notice({ text }: { text?: string }) {
  if (!text) return null;
  return <div className="mb-6 rounded-2xl border border-lime bg-lime/20 px-4 py-3 text-sm font-medium text-forest">{text}</div>;
}
