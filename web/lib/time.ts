export const TIMEZONE = "Asia/Bangkok";

export function nowIso(): string {
  return new Date().toISOString();
}

export function parseDateTime(value: unknown): Date | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function hoursUntil(iso: string, from = new Date()): number {
  return (new Date(iso).getTime() - from.getTime()) / 3_600_000;
}

export function formatBangkok(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: TIMEZONE,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function nextPickupWindows(count = 6): { start: string; end: string; label: string }[] {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);
  const windows = [];
  for (let i = 0; i < count; i += 1) {
    const from = new Date(start.getTime() + i * 3 * 3_600_000);
    const to = new Date(from.getTime() + 3 * 3_600_000);
    windows.push({
      start: from.toISOString(),
      end: to.toISOString(),
      label: `${formatBangkok(from.toISOString())} – ${formatBangkok(to.toISOString())}`,
    });
  }
  return windows;
}
