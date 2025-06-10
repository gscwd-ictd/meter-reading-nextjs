"use client";

import { MeterReader } from "@mr/lib/types/personnel";
import { MeterReadingEntry, MeterReadingSchedule } from "@mr/lib/types/schedule";
import {
  addDays,
  addMonths,
  compareAsc,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isBefore,
  isSameDay,
  isSameMonth,
  isSunday,
  isValid,
  isWeekend,
  nextMonday,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Holiday = {
  id: string;
  name: string;
  holidayDate: string;
  type: string;
};

type DueDate = {
  readingDate: Date;
  dueDate: Date;
};

type DisconnectionDate = {
  readingDate: Date;
  dueDate: Date;
  disconnectionDate: Date;
};

export type Scheduler = ReturnType<typeof useScheduler>;

export const useScheduler = (holidays: Holiday[], restDays: Date[], monthYear?: string) => {
  const [currentDate, setCurrentDate] = useState(
    monthYear ? parse(monthYear, "MM-yyyy", new Date()) : new Date(),
  );
  const [currentMonthYear, setCurrentMonthYear] = useState(monthYear);

  const router = useRouter();

  // useEffect(() => {
  //   if (date !== undefined && date.getTime() !== currentDate.getTime()) {
  //     setCurrentDate(date);
  //     setCurrentMonthYear(format(currentDate, "MM-yyyy"));
  //   }
  // }, [currentDate, date, currentMonthYear]);

  useEffect(() => {
    router.replace(`/schedule?date=${currentMonthYear}`);
  }, [currentMonthYear, router]);

  // get map day number to restDay type
  const getDayName = (date: Date): "sunday" | "saturday" | undefined => {
    const day = getDay(date); // 0 = Sunday, 6 = Saturday
    if (day === 0) return "sunday";
    if (day === 6) return "saturday";
    return undefined;
  };

  // Utility function to have a uniform format for dates  , added dd
  const formatDate = (date: Date | undefined, dateFormat?: "yyyy-MM-dd" | "MMM dd" | "dd") => {
    if (!date) return undefined;

    if (!dateFormat) {
      dateFormat = "yyyy-MM-dd";
    }

    return format(date, dateFormat);
  };

  // Memoize formatted holiday dates for efficient lookups
  const holidayDates = useMemo(
    () =>
      holidays.map((holiday) =>
        format(parse(holiday.holidayDate, "MMMM dd, yyyy", new Date()), "yyyy-MM-dd"),
      ),
    [holidays],
  );

  const restDayDates = useMemo(() => restDays.map((restDay) => formatDate(restDay)), [restDays]);

  // Check if a date is a holiday
  const isHoliday = useCallback(
    (date: Date): boolean => holidayDates.includes(formatDate(date) as string),
    [holidayDates],
  );

  const isRestDay = useCallback((date: Date) => restDayDates.includes(formatDate(date)), [restDayDates]);

  const addBusinessDays = useCallback(
    (date: Date, daysToAdd: number) => {
      let daysAdded = 0;

      while (daysAdded < daysToAdd) {
        date = addDays(date, 1);

        if (!isWeekend(date) && !isHoliday(date)) {
          daysAdded++;
        }
      }

      return date;
    },
    [isHoliday],
  );

  // Add 1 day if the provided date is a holiday
  const adjustForHolidayOrWeekend = useCallback(
    (date: Date) => {
      while (isHoliday(date) || isWeekend(date)) {
        if (isHoliday(date)) {
          date = addDays(date, 1);
        }

        if (isWeekend(date)) {
          date = nextMonday(date);
        }
      }
      return date;
    },
    [isHoliday],
  );

  const removeDuplicateDates = useCallback((dates: Date[]) => {
    const uniqueDates = new Map<string, Date>();

    dates.forEach((date) => {
      const formattedDate = format(date, "yyyy-MM-dd"); // Normalize to YYYY-MM-DD format
      if (!uniqueDates.has(formattedDate)) {
        uniqueDates.set(formattedDate, date);
      }
    });

    return Array.from(uniqueDates.values());
  }, []);

  const addSundayReadings = useCallback((schedule: MeterReadingSchedule[]) => {
    // Create a new array to avoid mutating the original
    const updatedSchedule = [...schedule];

    for (let i = 1; i < updatedSchedule.length; i++) {
      const currentReading = updatedSchedule[i]!;
      const previousReading = updatedSchedule[i - 1]!;
      // const previousReading =
      //   currentReading.dueDate === updatedSchedule[i - 1].dueDate
      //     ? updatedSchedule[i - 2]
      //     : updatedSchedule[i - 1];

      // Parse dates
      const currentDate = currentReading.readingDate;
      const previousDate = previousReading.readingDate;

      // Check if current reading is on a Sunday and is in the same month as previous reading
      if (isSunday(currentDate) && isSameMonth(currentDate, previousDate)) {
        // Copy dueDate and disconnectionDate from previous reading
        currentReading.dueDate = previousReading.dueDate;
        currentReading.disconnectionDate = previousReading.disconnectionDate;
      }
    }

    return updatedSchedule;
  }, []);

  const removeSundayReadings = (schedule: MeterReadingSchedule[]) => {
    // Create a new array to avoid mutating the original
    const updatedSchedule = [...schedule];

    for (let i = 1; i < updatedSchedule.length; i++) {
      const currentReading = updatedSchedule[i]!;
      const previousReading = updatedSchedule[i - 1]!;
      // const previousReading =
      //   currentReading.dueDate === updatedSchedule[i - 1].dueDate
      //     ? updatedSchedule[i - 2]
      //     : updatedSchedule[i - 1];

      // Parse dates
      const currentDate = currentReading.readingDate;
      const previousDate = previousReading.readingDate;

      // Check if current reading is on a Sunday and is in the same month as previous reading
      if (isSunday(currentDate) && isSameMonth(currentDate, previousDate)) {
        // Reset dueDate and disconnectionDate for Sunday readings
        currentReading.dueDate = undefined;
        currentReading.disconnectionDate = undefined;
      }
    }

    return updatedSchedule;
  };

  const getCalendarDays = useCallback(() => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);

    const firstDayOfCalendar = startOfWeek(firstDayOfMonth);
    const lastDayOfCalendar = endOfWeek(lastDayOfMonth);

    const calendarDays = eachDayOfInterval({
      start: firstDayOfCalendar,
      end: lastDayOfCalendar,
    });

    return calendarDays;
  }, [currentDate]);

  const getStartingReadingDate = useCallback(() => {
    const monthStart = startOfMonth(currentDate);

    let startOfReadingDate = monthStart;

    //* Use this instead, if starting date requires to skip holidays as well.
    while (isHoliday(startOfReadingDate) || isSunday(startOfReadingDate)) {
      startOfReadingDate = adjustForHolidayOrWeekend(startOfReadingDate);
    }

    if (isSunday(startOfReadingDate)) {
      startOfReadingDate = nextMonday(startOfReadingDate);
    }

    while (isRestDay(startOfReadingDate)) {
      startOfReadingDate = addDays(startOfReadingDate, 1);
    }

    return { monthStart, startOfReadingDate };
  }, [currentDate, isRestDay, adjustForHolidayOrWeekend, isHoliday]);

  const calculateDueDates = useCallback((): DueDate[] => {
    const { monthStart, startOfReadingDate } = getStartingReadingDate();
    const dueDates: DueDate[] = [];

    let readingDate = startOfReadingDate;
    let dueDate = readingDate;
    let readingCount = 1;

    dueDate = addDays(readingDate, 15);

    while (isSameMonth(readingDate, monthStart) && readingCount < 22) {
      dueDate = adjustForHolidayOrWeekend(dueDate);

      if (isSunday(readingDate)) {
        readingDate = nextMonday(readingDate);
      }

      if (isRestDay(readingDate)) {
        readingDate = addDays(readingDate, 1);
      }

      dueDates.push({ readingDate, dueDate });

      readingDate = addDays(readingDate, 1);
      dueDate = addDays(dueDate, 1);
      readingCount++;
    }

    return dueDates;
  }, [adjustForHolidayOrWeekend, getStartingReadingDate, isRestDay]);

  const calculateDisconnectionDates = useCallback(
    (dueDates: DueDate[]): DisconnectionDate[] => {
      let disconnectionDate = dueDates[0]!.dueDate;

      const disconnectionDates = dueDates.map((date, index) => {
        if (index === 0) {
          disconnectionDate = addBusinessDays(disconnectionDate, 3);
        } else {
          disconnectionDate = addDays(disconnectionDate, 1);
        }

        disconnectionDate = adjustForHolidayOrWeekend(disconnectionDate);

        return { ...date, disconnectionDate };
      });

      return disconnectionDates;
    },
    [addBusinessDays, adjustForHolidayOrWeekend],
  );

  const calculateSchedule = useCallback((): MeterReadingSchedule[] => {
    const calendarDays = getCalendarDays();
    const dueDates = calculateDueDates();
    const disconnectionDates = calculateDisconnectionDates(dueDates);

    const schedule = calendarDays.map((date) => {
      const existingEntry = disconnectionDates.find(
        (dateEntry) => formatDate(dateEntry.readingDate) === formatDate(date),
      );

      return existingEntry
        ? existingEntry
        : {
            readingDate: date,
            dueDate: undefined,
            disconnectionDate: undefined,
          };
    });

    return schedule;
  }, [calculateDisconnectionDates, calculateDueDates, getCalendarDays]);

  const splitDates = useCallback(
    (selectedDates: Date[]) => {
      const schedule = calculateSchedule();

      // Make sure selected dates are not duplicated
      const uniqueDates = removeDuplicateDates(selectedDates);

      // Sort the unique dates chronologically in ascending order
      const sortedSelectedDates = [...uniqueDates].sort(compareAsc);

      let split = [...schedule];

      // Helper function to find previous valid reading with defined dates
      const findPreviousValidReading = (readings: MeterReadingSchedule[], idx: number) => {
        let lookBack = 1;

        while (
          (!readings[idx - lookBack]?.dueDate && !readings[idx - lookBack]?.disconnectionDate) ||
          isSunday(readings[idx - lookBack]?.readingDate as Date)
        ) {
          //! lookBack is creating a loop due to having no break statement in while when clicked date is the first date of the month

          lookBack++;
        }

        return readings[idx - lookBack];
      };

      // Process each selected date
      for (let i = 0; i < sortedSelectedDates.length; i++) {
        const result: MeterReadingSchedule[] = [];
        let startIndex = 0;

        const currentSelectedDate = sortedSelectedDates[i]!;

        for (let j = startIndex; j < split.length; j++) {
          // Insert all leading dates before the first selected date
          if (isBefore(split[j]!.readingDate, currentSelectedDate)) {
            result.push(split[j]!);
          }

          // Handle case when selected date is found
          if (isSameDay(currentSelectedDate, split[j]?.readingDate as Date)) {
            const curr = split[j];
            const prev = findPreviousValidReading(split, j);

            const currentReading: MeterReadingSchedule = {
              readingDate: curr?.readingDate as Date,
              dueDate: [curr?.dueDate, prev?.dueDate] as Date[],
              disconnectionDate: [curr?.disconnectionDate, prev?.disconnectionDate] as Date[],
            };

            result.push(currentReading);

            startIndex = j + 1;

            // Process the remaining readings
            for (let k = startIndex; k < split.length; k++) {
              const curr = split[k];

              // If the current dueDate and disconnectionDate is undefined, skip shifting dates
              if (!curr?.dueDate && !curr?.disconnectionDate) {
                result.push(curr!);
                continue;
              }

              // Find previous valid reading to get dates from
              const prev = findPreviousValidReading(split, k);

              const nextReadingDate: MeterReadingSchedule = {
                readingDate: curr?.readingDate as Date,
                dueDate: prev?.dueDate,
                disconnectionDate: prev?.disconnectionDate,
              };

              result.push(nextReadingDate);
            }
          }
        }

        split = [...result];
      }

      if (selectedDates.length > 1)
        toast.success("Success", {
          description: "Successfully splitted the dates!",
          position: "top-right",
          duration: 1500,
        });
      return split;
    },
    [calculateSchedule, removeDuplicateDates],
  );

  const assignMeterReaders = useCallback(
    (schedule: MeterReadingSchedule[], meterReaders: MeterReader[]): MeterReadingEntry[] => {
      return schedule.map((entry) => {
        // Guard: If readingDate is missing or invalid, skip assigning readers
        if (!Array.isArray(entry.dueDate) && (!entry.dueDate || !isValid(entry.dueDate))) {
          return { ...entry, meterReaders: [] }; // no meterReaders field
        }

        const readingRestDay = getDayName(entry.readingDate);

        const transferZonebookToRecommended = meterReaders.map((mr) => {
          if (mr.zonebooks) return { ...mr, zonebooks: [], recommendedZonebooks: mr.zonebooks };

          return mr;
        });

        const availableReaders = transferZonebookToRecommended.filter(
          (reader) => reader.restDay !== readingRestDay,
        );

        return { ...entry, meterReaders: availableReaders };
      });
    },
    [],
  );

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
    setCurrentMonthYear(format(subMonths(currentDate, 1), "MM-yyyy"));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
    setCurrentMonthYear(format(addMonths(currentDate, 1), "MM-yyyy"));
  };

  const today = () => {
    setCurrentDate(new Date());
    setCurrentMonthYear(format(new Date(), "MM-yyyy"));
  };

  return {
    calculateSchedule,
    addSundayReadings,
    removeSundayReadings,
    assignMeterReaders,
    splitDates,

    formatDate,
    goToPreviousMonth,
    goToNextMonth,
    today,
    currentDate,
    currentMonthYear,
  };
};
