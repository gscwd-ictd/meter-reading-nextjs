import { MeterReader } from "@mr/lib/types/personnel";
import { useCallback } from "react";
import { getDay, isValid } from "date-fns";
import { MeterReadingSchedule } from "@mr/lib/types/schedule";

export type ScheduleMeterReaders = ReturnType<typeof useScheduleMeterReaders>;

export const useScheduleMeterReaders = (schedules: MeterReadingSchedule[], meterReaders: MeterReader[]) => {
  const allReadingDates = useCallback((): Date[] => {
    const schedDates: Date[] = [];

    schedules.filter((sched) => {
      if (sched.readingDate !== undefined) return schedDates.push(sched.readingDate);
    });

    return schedDates;
  }, [schedules]);

  // get map day number to restDay type
  const getDayName = (date: Date): "sunday" | "saturday" | undefined => {
    const day = getDay(date); // 0 = Sunday, 6 = Saturday
    if (day === 0) return "sunday";
    if (day === 6) return "saturday";
    return undefined;
  };

  const assignReadersToSchedules = useCallback(() => {
    return schedules.map((schedule) => {
      // Guard: If readingDate is missing or invalid, skip assigning readers
      if (!Array.isArray(schedule.dueDate) && (!schedule.dueDate || !isValid(schedule.dueDate))) {
        return { ...schedule }; // no meterReaders field
      }

      const readingRestDay = getDayName(schedule.readingDate);

      const availableReaders = meterReaders
        .filter((reader) => reader.restDay !== readingRestDay)
        .map((reader) => ({ ...reader })); //! Improve this

      return { ...schedule, meterReaders: availableReaders };
    });
  }, [meterReaders, schedules]);

  return { allReadingDates, assignReadersToSchedules };
};
