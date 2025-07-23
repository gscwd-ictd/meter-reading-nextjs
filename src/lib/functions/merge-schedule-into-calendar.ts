import { isSameDay } from "date-fns";
import { MeterReadingEntryWithZonebooks } from "../types/schedule";

export default function mergeScheduleIntoCalendar(
  calendar: MeterReadingEntryWithZonebooks[],
  schedule: MeterReadingEntryWithZonebooks[],
): MeterReadingEntryWithZonebooks[] {
  return calendar.map((calendarEntry) => {
    const match = schedule.find((s) => isSameDay(s.readingDate, calendarEntry.readingDate));

    return match
      ? {
          ...calendarEntry,
          dueDate: match.dueDate,
          disconnectionDate: match.disconnectionDate,
          meterReaders: match.meterReaders,
        }
      : calendarEntry;
  });
}
