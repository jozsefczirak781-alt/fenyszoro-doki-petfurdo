// Opening hours and booking slots for the workshop. Dates are "YYYY-MM-DD" strings
// interpreted in the workshop's own time zone, so server and browser agree.

export const WORKSHOP_TIME_ZONE = "Europe/Budapest";
export const BOOKING_WINDOW_DAYS = 60;

const DAILY_SLOTS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

export const OPENING_HOURS = [
  { days: "Hétfő – Vasárnap", hours: "8:00 – 17:00" },
];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function parse(date: string): Date {
  return new Date(`${date}T12:00:00Z`);
}

export function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function addDays(date: string, days: number): string {
  const d = parse(date);
  d.setUTCDate(d.getUTCDate() + days);
  return formatDate(d);
}

/** Today's date at the workshop, as YYYY-MM-DD. */
export function todayAtWorkshop(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: WORKSHOP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Bookable start times for a date (ignores whether they are already taken). */
export function slotsForDate(date: string): string[] {
  if (!DATE_RE.test(date)) return [];
  return DAILY_SLOTS;
}

/** Earliest bookable day is tomorrow; latest is BOOKING_WINDOW_DAYS ahead. */
export function isBookableDate(date: string, now: Date = new Date()): boolean {
  if (!DATE_RE.test(date)) return false;
  const today = todayAtWorkshop(now);
  if (date <= today) return false;
  if (date > addDays(today, BOOKING_WINDOW_DAYS)) return false;
  return slotsForDate(date).length > 0;
}

export function isValidSlot(date: string, time: string, now: Date = new Date()): boolean {
  return isBookableDate(date, now) && slotsForDate(date).includes(time);
}
