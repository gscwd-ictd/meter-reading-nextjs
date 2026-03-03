import { MeterReadingEntryWithZonebooks } from "../types/schedule";

export default function extractScheduleByDay(scheduleData: MeterReadingEntryWithZonebooks[]) {
  return scheduleData.map((item) => ({
    readingDate: item.readingDate,
    day: item.day,
  }));
}
