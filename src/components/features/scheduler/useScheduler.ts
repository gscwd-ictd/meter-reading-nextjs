"use client";

import { MeterReader, MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { MeterReadingEntryWithZonebooks, MeterReadingSchedule } from "@mr/lib/types/schedule";

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

type Day = {
  id: string;
  name: string;
  date: string;
};

type Holiday = Day & {
  type: string;
};

type MeterReadingDate = {
  readingDate: Date;
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

const NonBusinessDays: Day[] = [
  { id: "001", date: "01-01", name: "New Year" },
  { id: "002", date: "12-25", name: "Christmas Day" },
];

export type Scheduler = ReturnType<typeof useScheduler>;

export const useScheduler = (holidays: Holiday[], restDays: Date[], monthYear?: string) => {
  const [currentDate, setCurrentDate] = useState(
    monthYear ? parse(monthYear, "yyyy-MM", new Date()) : new Date(),
  );

  const [currentMonthYear, setCurrentMonthYear] = useState(monthYear);

  const router = useRouter();

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

  const holidayDates = useMemo(
    () => holidays.map((holiday) => format(parse(holiday.date, "MMMM dd, yyyy", new Date()), "yyyy-MM-dd")),
    [holidays],
  );

  const isHoliday = useCallback(
    (date: Date): boolean => holidayDates.includes(formatDate(date) as string),
    [holidayDates],
  );

  const isNoDutyDay = useCallback((date: Date) => {
    const mmdd = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    return NonBusinessDays.some((day) => day.date === mmdd);
  }, []);

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

  // const addBusinessDays = useCallback(
  //   (startDate: Date, daysToAdd: number): Date => {
  //     let currentDate = new Date(startDate); // avoid mutating input
  //     let daysAdded = 0;

  //     while (daysAdded < daysToAdd) {
  //       currentDate = addDays(currentDate, 1);

  //       const isWorkday = !isWeekend(currentDate) && !isHoliday(currentDate) && !isNoDutyDay(currentDate);

  //       if (isWorkday) {
  //         daysAdded++;
  //       }
  //     }

  //     return currentDate;
  //   },
  //   [isHoliday, isNoDutyDay, isWeekend], // make sure these are stable refs
  // );

  // Add 1 day if the provided date is a holiday
  const adjustForHolidayOrWeekend = useCallback(
    (date: Date) => {
      while (isHoliday(date) || isWeekend(date) || isNoDutyDay(date)) {
        // should execute only one option : if holiday or no duty day, they might overlap
        if (isHoliday(date) || isNoDutyDay(date)) {
          date = addDays(date, 1);
        }

        if (isWeekend(date)) {
          date = nextMonday(date);
        }
      }
      return date;
    },
    [isHoliday, isNoDutyDay],
  );

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

    while (isNoDutyDay(startOfReadingDate)) {
      startOfReadingDate = addDays(startOfReadingDate, 1);
    }

    return { monthStart, startOfReadingDate };
  }, [currentDate, isNoDutyDay]);

  //! this is the latest
  // const calculateDueDates = useCallback((): DueDate[] => {
  //   const { monthStart, startOfReadingDate } = getStartingReadingDate();
  //   const dueDates: DueDate[] = [];
  //   const usedDueDates = new Set<string>();

  //   let readingDate = startOfReadingDate;
  //   let readingCount = 0;

  //   while (isSameMonth(readingDate, monthStart) && readingCount < 21) {
  //     if (isNoDutyDay(readingDate)) {
  //       readingDate = addDays(readingDate, 1);
  //       continue;
  //     }

  //     const isSaturday = getDay(readingDate) === 6;
  //     const isSunday = getDay(readingDate) === 0;

  //     if (isSaturday) {
  //       const nextDay = addDays(readingDate, 1);

  //       // Case: Saturday is followed by valid Sunday in same month
  //       const isValidSunday =
  //         isSameMonth(nextDay, monthStart) && getDay(nextDay) === 0 && !isNoDutyDay(nextDay);

  //       let dueDate = addDays(readingDate, 15);
  //       let dueDateStr = format(dueDate, "yyyy-MM-dd");

  //       while (
  //         isHoliday(dueDate) ||
  //         isWeekend(dueDate) ||
  //         isNoDutyDay(dueDate) ||
  //         usedDueDates.has(dueDateStr)
  //       ) {
  //         dueDate = addDays(dueDate, 1);
  //         dueDateStr = format(dueDate, "yyyy-MM-dd");
  //       }

  //       usedDueDates.add(dueDateStr);

  //       // Push Saturday now, and maybe Sunday next
  //       dueDates.push({ readingDate, dueDate });

  //       if (isValidSunday) {
  //         readingDate = nextDay;
  //         dueDates.push({ readingDate, dueDate }); // same dueDate
  //       }

  //       readingCount++; // ✅ Count Sat+Sun as 1
  //       readingDate = addDays(readingDate, 1); // move past Sunday (or Sat if no Sunday)
  //       continue;
  //     }

  //     // if (isSunday) {
  //     //   // Skip Sunday alone — already handled by Sat
  //     //   readingDate = addDays(readingDate, 1);
  //     //   continue;
  //     // }
  //     if (isSunday) {
  //       if (dueDates.length === 0) {
  //         // First reading day is a Sunday — allow it
  //       } else {
  //         // Regular Sunday — skip (already handled by Saturday)
  //         readingDate = addDays(readingDate, 1);
  //         continue;
  //       }
  //     }

  //     // Regular weekday reading
  //     let dueDate = addDays(readingDate, 15);
  //     let dueDateStr = format(dueDate, "yyyy-MM-dd");

  //     while (
  //       isHoliday(dueDate) ||
  //       isWeekend(dueDate) ||
  //       isNoDutyDay(dueDate) ||
  //       usedDueDates.has(dueDateStr)
  //     ) {
  //       dueDate = addDays(dueDate, 1);
  //       dueDateStr = format(dueDate, "yyyy-MM-dd");
  //     }

  //     usedDueDates.add(dueDateStr);
  //     dueDates.push({ readingDate, dueDate });
  //     readingCount++;

  //     readingDate = addDays(readingDate, 1);
  //   }

  //   return dueDates;
  // }, [getStartingReadingDate, isHoliday, isNoDutyDay]);

  // const calculateDueDates = useCallback((): DueDate[] => {
  //   const { monthStart, startOfReadingDate } = getStartingReadingDate();
  //   const dueDates: DueDate[] = [];
  //   const usedDueDates = new Set<string>();

  //   let readingDate = startOfReadingDate;
  //   let readingCount = 0;

  //   while (isSameMonth(readingDate, monthStart) && readingCount < 21) {
  //     if (isNoDutyDay(readingDate)) {
  //       readingDate = addDays(readingDate, 1);
  //       continue;
  //     }

  //     const baseDueDate = addDays(readingDate, 15);
  //     const isSaturday = getDay(baseDueDate) === 6;
  //     const isSunday = getDay(baseDueDate) === 0;

  //     let dueDate = baseDueDate;
  //     let dueDateStr = format(dueDate, "yyyy-MM-dd");

  //     while (
  //       isHoliday(dueDate) ||
  //       isWeekend(dueDate) ||
  //       isNoDutyDay(dueDate) ||
  //       usedDueDates.has(dueDateStr)
  //     ) {
  //       dueDate = addDays(dueDate, 1);
  //       dueDateStr = format(dueDate, "yyyy-MM-dd");
  //     }

  //     const nextDay = addDays(readingDate, 1);
  //     const isValidSunday =
  //       isSameMonth(nextDay, monthStart) && getDay(addDays(nextDay, 15)) === 0 && !isNoDutyDay(nextDay);

  //     usedDueDates.add(dueDateStr);
  //     dueDates.push({ readingDate, dueDate });

  //     if (isSaturday && isValidSunday) {
  //       readingDate = nextDay;
  //       dueDates.push({ readingDate, dueDate }); // same dueDate
  //     }

  //     readingCount++; // count Sat+Sun pair as 1
  //     readingDate = addDays(readingDate, 1);
  //   }

  //   return dueDates;
  // }, [getStartingReadingDate, isHoliday, isNoDutyDay]);

  const calculateDueDates = useCallback((): DueDate[] => {
    const { monthStart, startOfReadingDate } = getStartingReadingDate();
    const dueDates: DueDate[] = [];

    let readingDate = startOfReadingDate;
    let dueDate = readingDate;
    let readingCount = 1;

    dueDate = addDays(readingDate, 15);

    while (isSameMonth(readingDate, monthStart) && readingCount < 22) {
      // only adjust the due date when it is a holiday, weekend, or no duty day
      dueDate = adjustForHolidayOrWeekend(dueDate);

      // skip this reading date if it is a noDutyDay
      // if (isNoDutyDay(readingDate) || isHoliday(readingDate)) {
      //   readingDate = addDays(readingDate, 1);
      // }

      if (isSunday(readingDate)) {
        readingDate = nextMonday(readingDate);
      }

      // if (isRestDay(readingDate)) {
      //   readingDate = addDays(readingDate, 1);
      // }

      dueDates.push({ readingDate, dueDate });

      readingDate = addDays(readingDate, 1);
      dueDate = addDays(dueDate, 1);
      readingCount++;
    }

    return dueDates;
  }, [adjustForHolidayOrWeekend, getStartingReadingDate]);

  const calculateDisconnectionDates = useCallback(
    (dueDates: DueDate[]): DisconnectionDate[] => {
      const disconnectionDates: DisconnectionDate[] = [];
      const usedDisconnectionDates = new Set<string>();

      let i = 0;

      while (i < dueDates.length) {
        const current = dueDates[i];
        const next = dueDates[i + 1];

        const isSaturday = getDay(current.readingDate) === 6;
        const isSunday = getDay(current.readingDate) === 0;
        const isNextSunday =
          next && getDay(next.readingDate) === 0 && isSameMonth(current.readingDate, next.readingDate);

        let disconnectionDate = addDays(current.dueDate, 3);
        let disconnectionDateStr = format(disconnectionDate, "yyyy-MM-dd");

        // Adjust to next working day and avoid duplicates
        while (
          isHoliday(disconnectionDate) ||
          isWeekend(disconnectionDate) ||
          isNoDutyDay(disconnectionDate) ||
          usedDisconnectionDates.has(disconnectionDateStr)
        ) {
          disconnectionDate = addDays(disconnectionDate, 1);
          disconnectionDateStr = format(disconnectionDate, "yyyy-MM-dd");
        }

        usedDisconnectionDates.add(disconnectionDateStr);

        if (isSaturday && isNextSunday) {
          // Assign same disconnection date to Saturday and Sunday
          disconnectionDates.push({ ...current, disconnectionDate });
          disconnectionDates.push({ ...next!, disconnectionDate });
          i += 2; // Skip both Sat and Sun
        } else if (isSunday && i > 0 && isSameDay(dueDates[i - 1].dueDate, current.dueDate)) {
          // Sunday that's already handled with Saturday – skip it
          i++;
          continue;
        } else {
          // Normal weekday or unpaired Sat/Sun
          disconnectionDates.push({ ...current, disconnectionDate });
          i++;
        }
      }

      return disconnectionDates;
    },
    [isHoliday, isNoDutyDay],
  );

  // const calculateDisconnectionDates = useCallback(
  //   (dueDates: DueDate[]): DisconnectionDate[] => {
  //     let disconnectionDate = dueDates[0]!.dueDate;

  //     const disconnectionDates = dueDates.map((date, index) => {
  //       if (index === 0) {
  //         disconnectionDate = addBusinessDays(disconnectionDate, 3);
  //       } else {
  //         disconnectionDate = addDays(disconnectionDate, 1);
  //       }

  //       disconnectionDate = adjustForHolidayOrWeekend(disconnectionDate);

  //       return { ...date, disconnectionDate };
  //     });

  //     return disconnectionDates;
  //   },
  //   [addBusinessDays],
  // );

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
      // const findPreviousValidReading = (readings: MeterReadingSchedule[], idx: number) => {
      //   let lookBack = 1;

      //   while (
      //     (!readings[idx - lookBack]?.dueDate && !readings[idx - lookBack]?.disconnectionDate) ||
      //     isSunday(readings[idx - lookBack]?.readingDate as Date)
      //   ) {
      //     //! lookBack is creating a loop due to having no break statement in while when clicked date is the first date of the month

      //     lookBack++;
      //   }

      //   return readings[idx - lookBack];
      // };

      const findPreviousValidReading = (readings: MeterReadingSchedule[], idx: number) => {
        let lookBack = 1;

        while (idx - lookBack >= 0) {
          const candidate = readings[idx - lookBack];

          // Exit early if valid reading is found, even if it's Sunday
          if (candidate?.dueDate || candidate?.disconnectionDate) {
            return candidate;
          }

          lookBack++;
        }

        return undefined; // fallback in case nothing is found
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

            // const currentReading: MeterReadingSchedule = {
            //   readingDate: curr?.readingDate as Date,
            //   dueDate: [curr?.dueDate, prev?.dueDate] as Date[],
            //   disconnectionDate: [curr?.disconnectionDate, prev?.disconnectionDate] as Date[],
            // };

            // const currentReading: MeterReadingSchedule = {
            //   readingDate: curr?.readingDate as Date,
            //   dueDate: [curr?.dueDate, prev?.dueDate].filter(Boolean) as Date[],
            //   disconnectionDate: [curr?.disconnectionDate, prev?.disconnectionDate].filter(Boolean) as Date[],
            // };

            // const currentReading: MeterReadingSchedule = {
            //   readingDate: curr?.readingDate as Date,
            //   dueDate: mergeDates(curr?.dueDate, prev?.dueDate),
            //   disconnectionDate: mergeDates(curr?.disconnectionDate, prev?.disconnectionDate),
            // };

            const currentReading: MeterReadingSchedule = {
              readingDate: curr.readingDate,
              dueDate: [curr.dueDate, prev?.dueDate].filter(Boolean).slice(0, 2) as Date[],
              disconnectionDate: [curr.disconnectionDate, prev?.disconnectionDate]
                .filter(Boolean)
                .slice(0, 2) as Date[],
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

      return split;
    },
    [calculateSchedule, removeDuplicateDates],
  );

  // const splitDates = useCallback(
  //   (selectedDates: Date[]) => {
  //     const originalSchedule = calculateSchedule();

  //     // Step 1: clean input
  //     const uniqueDates = removeDuplicateDates(selectedDates).sort(compareAsc);

  //     const updatedSchedule = originalSchedule.map((entry) => ({ ...entry }));

  //     for (const selected of uniqueDates) {
  //       const idx = updatedSchedule.findIndex((entry) => isSameDay(entry.readingDate, selected));

  //       // Skip if not found or it's the first reading (no previous)
  //       if (idx <= 0) continue;

  //       const current = updatedSchedule[idx];
  //       const prev = updatedSchedule
  //         .slice(0, idx)
  //         .reverse()
  //         .find((r) => r.dueDate && r.disconnectionDate && !isSunday(r.readingDate));

  //       // Skip if there's no valid previous date
  //       if (!prev) continue;

  //       // Merge due dates and disconnection dates (only for the selected date)
  //       const mergedDue = [current.dueDate, prev.dueDate].filter(Boolean).flat() as Date[];
  //       const mergedDisc = [current.disconnectionDate, prev.disconnectionDate]
  //         .filter(Boolean)
  //         .flat() as Date[];

  //       // Apply merged values back, limited to 2
  //       updatedSchedule[idx] = {
  //         ...current,
  //         dueDate: mergedDue.slice(0, 2),
  //         disconnectionDate: mergedDisc.slice(0, 2),
  //       };
  //     }

  //     return updatedSchedule;
  //   },
  //   [calculateSchedule, removeDuplicateDates],
  // );

  // const splitDates = useCallback(
  //   (selectedDates: Date[]) => {
  //     const schedule = calculateSchedule();

  //     const uniqueDates = removeDuplicateDates(selectedDates);
  //     const sortedSelectedDates = [...uniqueDates].sort(compareAsc);

  //     let split = [...schedule];

  //     const findPreviousValidReading = (readings: MeterReadingSchedule[], idx: number) => {
  //       let lookBack = 1;
  //       while (idx - lookBack >= 0) {
  //         const candidate = readings[idx - lookBack];
  //         if (candidate?.dueDate || candidate?.disconnectionDate) {
  //           return candidate;
  //         }
  //         lookBack++;
  //       }
  //       return undefined;
  //     };

  //     for (let i = 0; i < sortedSelectedDates.length; i++) {
  //       const result: MeterReadingSchedule[] = [];
  //       const currentSelectedDate = sortedSelectedDates[i]!;

  //       for (let j = 0; j < split.length; j++) {
  //         const curr = split[j]!;

  //         if (isBefore(curr.readingDate, currentSelectedDate)) {
  //           result.push(curr);
  //           continue;
  //         }

  //         if (isSameDay(curr.readingDate, currentSelectedDate)) {
  //           const prev = findPreviousValidReading(split, j);

  //           const dueDates = [curr.dueDate, prev?.dueDate].filter(Boolean).slice(0, 2) as Date[];
  //           const disconnectionDates = [curr.disconnectionDate, prev?.disconnectionDate]
  //             .filter(Boolean)
  //             .slice(0, 2) as Date[];

  //           const currentReading: MeterReadingSchedule = {
  //             readingDate: curr.readingDate,
  //             dueDate: dueDates,
  //             disconnectionDate: disconnectionDates,
  //           };

  //           result.push(currentReading);

  //           // Setup next starting points
  //           const baseDue = addDays(dueDates[0]!, 1); // due + 1
  //           let dueCursor = baseDue;

  //           const fixedDisconnection = disconnectionDates[1]!; // last disconnectionDate, fixed
  //           let discCursor = fixedDisconnection;

  //           let prevDue = dueCursor;
  //           let prevDisc = discCursor;

  //           for (let k = j + 1; k < split.length; k++) {
  //             const next = split[k]!;
  //             const isSunday = getDay(next.readingDate) === 0;

  //             const nextReading: MeterReadingSchedule = {
  //               readingDate: next.readingDate,
  //               dueDate: isSunday ? prevDue : dueCursor,
  //               disconnectionDate: isSunday ? prevDisc : discCursor,
  //             };

  //             result.push(nextReading);

  //             if (!isSunday) {
  //               prevDue = dueCursor;
  //               prevDisc = discCursor;

  //               dueCursor = addDays(dueCursor, 1);
  //               discCursor = addDays(discCursor, 1);
  //             }
  //           }

  //           break; // handle one split at a time
  //         }
  //       }

  //       split = [...result];
  //     }

  //     return split;
  //   },
  //   [calculateSchedule, removeDuplicateDates],
  // );

  const assignMeterReaders = useCallback(
    (
      schedule: MeterReadingSchedule[],
      meterReaders: MeterReader[], // MeterReaderWithZonebooks
    ): MeterReadingEntryWithZonebooks[] => {
      const transformMeterReaders: MeterReaderWithZonebooks[] = meterReaders.map((mr) => {
        return {
          ...mr,
          zoneBooks: mr.zoneBooks.map((zb) => {
            return { ...zb, dueDate: undefined, disconnectionDate: undefined };
          }),
        };
      });

      return schedule.map((entry) => {
        // Guard: If readingDate is missing or invalid, skip assigning readers
        if (!Array.isArray(entry.dueDate) && (!entry.dueDate || !isValid(entry.dueDate))) {
          return { ...entry, meterReaders: [] }; // no meterReaders field
        }

        const readingRestDay = getDayName(entry.readingDate);

        const availableReaders = transformMeterReaders.filter((reader) => reader.restDay !== readingRestDay);

        return { ...entry, meterReaders: availableReaders };
      });
    },
    [],
  );

  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
    setCurrentMonthYear(format(subMonths(currentDate, 1), "yyyy-MM"));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
    setCurrentMonthYear(format(addMonths(currentDate, 1), "yyyy-MM"));
  };

  const today = () => {
    setCurrentDate(new Date());
    setCurrentMonthYear(format(new Date(), "yyyy-MM"));
  };

  const getWorkingDays = useCallback((): MeterReadingDate[] => {
    const schedule = calculateSchedule();

    schedule.map((day) => {
      if (day) return { readingDate: day.readingDate };
    });

    return schedule;
  }, [calculateSchedule]);

  return {
    calculateSchedule,
    addSundayReadings,
    removeSundayReadings,
    assignMeterReaders,
    splitDates,
    getWorkingDays,
    formatDate,
    goToPreviousMonth,
    goToNextMonth,
    today,
    currentDate,
    currentMonthYear,
  };
};
