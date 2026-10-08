/** Closed posts stay on their detail URL for 30 days, then respond 410. */
export const CLOSED_PUBLIC_MS = 30 * 24 * 60 * 60 * 1000;

export function closedPostState(
  closedAt: Date,
  now: Date,
  archived: boolean,
): "closed" | "gone" | "hidden" {
  if (archived) return "hidden";
  if (now.getTime() - closedAt.getTime() >= CLOSED_PUBLIC_MS) return "gone";
  return "closed";
}

export function utcDay(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function addUtcDays(isoDate: string, days: number): string {
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}

/** Monday 00:00 UTC of the week that contains `now`. */
export function startOfUtcWeek(now = new Date()): Date {
  const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const weekday = day.getUTCDay();
  const offset = weekday === 0 ? 6 : weekday - 1;
  day.setUTCDate(day.getUTCDate() - offset);
  return day;
}
