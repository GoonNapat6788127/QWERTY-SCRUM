const STYLES: Record<string, string> = {
  queued: "bg-amber-100 text-amber-900",
  matched: "bg-emerald-100 text-emerald-900",
  picked_up: "bg-sky-100 text-sky-900",
  delivered: "bg-stone-200 text-stone-800",
  expired: "bg-rose-100 text-rose-900",
  urgent: "bg-orange-100 text-urgent",
  donor: "bg-leaf/15 text-forest",
  foodbank: "bg-sky-100 text-sky-900",
  driver: "bg-amber-100 text-amber-900",
  logistics: "bg-violet-100 text-violet-900",
};

export function StatusBadge({ value }: { value: string }) {
  const label = value.replaceAll("_", " ");
  return (
    <span
      className={`me-1.5 inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${STYLES[value] ?? "bg-stone-100 text-stone-800"}`}
    >
      {label}
    </span>
  );
}
