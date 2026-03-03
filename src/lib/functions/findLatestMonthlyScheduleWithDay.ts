import { ScheduleDay } from "../types/schedule";

export default function findLatestMonthlyScheduleWithDay(entries: Array<ScheduleDay>) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return null;
  }

  // Filter entries that have a day property (not null/undefined)
  const entriesWithDay = entries.filter((entry) => entry.day != null);

  if (entriesWithDay.length === 0) {
    return null;
  }

  // Sort by readingDate in descending order (latest first)
  // Note: Your dates are in UTC format (ending with Z)
  return entriesWithDay.sort(
    (a, b) => new Date(b.readingDate).getTime() - new Date(a.readingDate).getTime(),
  )[0];
}
