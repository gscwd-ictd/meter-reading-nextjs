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
  getDate,
  getDay,
  getMonth,
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
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Holiday, HolidayFromHrms, NonBusinessDays } from "./holidays";
import { normalizeToYyyyMmDd } from "@mr/lib/functions/normalizeToYyyyMmDd";
import formatAndSortDates from "@mr/lib/functions/dateArraySorter";

type MeterReadingDate = { readingDate: Date };
type DueDate = { readingDate: Date; dueDate: Date };
type DisconnectionDate = { readingDate: Date; dueDate: Date; disconnectionDate: Date };

export type Scheduler = ReturnType<typeof useScheduler>;

export const useScheduler = (holidays: HolidayFromHrms[]) => {
  const searchParams = useSearchParams();
  const monthYear =
    searchParams.get("date") === null ? format(new Date(), "yyyy-MM") : searchParams.get("date");

  const [currentDate, setCurrentDate] = useState(
    monthYear ? parse(monthYear, "yyyy-MM", new Date()) : new Date(),
  );

  const [currentMonthYear, setCurrentMonthYear] = useState(monthYear);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/schedules?date=${currentMonthYear}`);
  }, [currentMonthYear, router]);

  const getDayName = (date: Date): "sunday" | "saturday" | undefined => {
    const day = getDay(date);
    if (day === 0) return "sunday";
    if (day === 6) return "saturday";
    return undefined;
  };

  const formatDate = (date: Date | undefined, dateFormat: "yyyy-MM-dd" | "MMM dd" | "dd" = "yyyy-MM-dd") => {
    return date ? format(date, dateFormat) : undefined;
  };

  const holidayDates = useMemo(
    () => holidays.map((holiday) => normalizeToYyyyMmDd(holiday.date)),

    // format(parse(holiday.date, "MMMM dd, yyyy", new Date()), "yyyy-MM-dd"
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
      const formattedDate = format(date, "yyyy-MM-dd");
      if (!uniqueDates.has(formattedDate)) {
        uniqueDates.set(formattedDate, date);
      }
    });
    return Array.from(uniqueDates.values());
  }, []);

  const adjustForHolidayOrWeekend = useCallback(
    (date: Date) => {
      while (isHoliday(date) || isWeekend(date) || isNoDutyDay(date)) {
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

  const getCalendarDays = useCallback(() => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);

    const firstDayOfCalendar = startOfWeek(firstDayOfMonth);
    const lastDayOfCalendar = endOfWeek(lastDayOfMonth);

    return eachDayOfInterval({ start: firstDayOfCalendar, end: lastDayOfCalendar });
  }, [currentDate]);

  const getStartingReadingDate = useCallback(() => {
    const monthStart = startOfMonth(currentDate);
    let startOfReadingDate = monthStart;

    while (isNoDutyDay(startOfReadingDate)) {
      startOfReadingDate = addDays(startOfReadingDate, 1);
    }

    return { monthStart, startOfReadingDate };
  }, [currentDate, isNoDutyDay]);

  // ✅ Updated to always handle Sundays (no addSundayReadings needed)
  const calculateDueDates = useCallback((): DueDate[] => {
    const { monthStart, startOfReadingDate } = getStartingReadingDate();
    const dueDates: DueDate[] = [];

    let readingDate = startOfReadingDate;
    let slotCount = 0;
    let lastDueDate: Date | null = null;

    while (isSameMonth(readingDate, monthStart) && slotCount < 21) {
      let dueDate: Date;

      if (!lastDueDate) {
        dueDate = addDays(readingDate, 15);
        dueDate = adjustForHolidayOrWeekend(dueDate);
      } else if (isSunday(readingDate)) {
        dueDate = lastDueDate; // Sunday shares Saturday's due date
      } else {
        dueDate = addDays(lastDueDate, 1);
        dueDate = adjustForHolidayOrWeekend(dueDate);
      }

      dueDates.push({ readingDate, dueDate });

      // Slot counting
      if (!isSunday(readingDate)) {
        if (getDay(readingDate) === 6) {
          const nextDay = addDays(readingDate, 1);
          if (isSameMonth(nextDay, monthStart) && getDay(nextDay) === 0) {
            slotCount++; // Sat-Sun pair counts once
          } else {
            slotCount++;
          }
        } else {
          slotCount++;
        }
      }

      if (!isSunday(readingDate)) {
        lastDueDate = dueDate;
      }

      readingDate = addDays(readingDate, 1);
    }

    return dueDates;
  }, [adjustForHolidayOrWeekend, getStartingReadingDate]);

  //! v2
  // const calculateDueDates = useCallback((): DueDate[] => {
  //   const { monthStart, startOfReadingDate } = getStartingReadingDate();
  //   const dueDates: DueDate[] = [];

  //   let readingDate = startOfReadingDate;
  //   let slotCount = 0;
  //   let lastDueDate: Date | null = null;

  //   while (isSameMonth(readingDate, monthStart) && slotCount < 22) {
  //     let dueDate: Date;

  //     if (!lastDueDate) {
  //       dueDate = addDays(readingDate, 15);
  //       dueDate = adjustForHolidayOrWeekend(dueDate);
  //     } else if (isSunday(readingDate)) {
  //       dueDate = lastDueDate; // Sunday shares Saturday's due date
  //     } else {
  //       dueDate = addDays(lastDueDate, 1);
  //       dueDate = adjustForHolidayOrWeekend(dueDate);
  //     }

  //     dueDates.push({ readingDate, dueDate });

  //     // ✅ Slot counting logic
  //     if (!isSunday(readingDate)) {
  //       if (getDay(readingDate) === 6) {
  //         // Saturday
  //         const nextDay = addDays(readingDate, 1);
  //         const isFirstDay = isSameDay(readingDate, monthStart);

  //         if (!isFirstDay && isSameMonth(nextDay, monthStart) && getDay(nextDay) === 0) {
  //           // Normal Sat-Sun pair → count as 1
  //           slotCount++;
  //         } else {
  //           // First Saturday or no following Sunday → count separately
  //           slotCount++;
  //         }
  //       } else {
  //         slotCount++;
  //       }
  //     }

  //     if (!isSunday(readingDate)) {
  //       lastDueDate = dueDate;
  //     }

  //     readingDate = addDays(readingDate, 1);
  //   }

  //   return dueDates;
  // }, [adjustForHolidayOrWeekend, getStartingReadingDate]);

  //! v3

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
          disconnectionDates.push({ ...current, disconnectionDate });
          disconnectionDates.push({ ...next!, disconnectionDate });
          i += 2;
        } else if (isSunday && i > 0 && isSameDay(dueDates[i - 1].dueDate, current.dueDate)) {
          i++;
          continue;
        } else {
          disconnectionDates.push({ ...current, disconnectionDate });
          i++;
        }
      }

      return disconnectionDates;
    },
    [isHoliday, isNoDutyDay],
  );

  const calculateSchedule = useCallback((): MeterReadingSchedule[] => {
    const calendarDays = getCalendarDays();
    const dueDates = calculateDueDates();
    const disconnectionDates = calculateDisconnectionDates(dueDates);

    return calendarDays.map((date) => {
      const existingEntry = disconnectionDates.find(
        (dateEntry) => formatDate(dateEntry.readingDate) === formatDate(date),
      );

      return existingEntry
        ? existingEntry
        : { readingDate: date, dueDate: undefined, disconnectionDate: undefined };
    });
  }, [calculateDisconnectionDates, calculateDueDates, getCalendarDays]);

  //! old code aug 6 2025
  // const splitDates = useCallback(
  //   (selectedDates: Date[]) => {
  //     const schedule = calculateSchedule();
  //     const uniqueDates = removeDuplicateDates(selectedDates);
  //     const sortedSelectedDates = [...uniqueDates].sort(compareAsc);

  //     let split = [...schedule];

  //     //! old code aug 6 2025
  //     // const findPreviousValidReading = (readings: MeterReadingSchedule[], idx: number) => {
  //     //   let lookBack = 1;
  //     //   while (idx - lookBack >= 0) {
  //     //     const candidate = readings[idx - lookBack];
  //     //     if (candidate?.dueDate || candidate?.disconnectionDate) return candidate;
  //     //     lookBack++;
  //     //   }
  //     //   return undefined;
  //     // };

  //     const findPreviousValidReading = (
  //       readings: MeterReadingSchedule[],
  //       idx: number,
  //       condition?: (r: MeterReadingSchedule) => boolean,
  //     ) => {
  //       let lookBack = 1;
  //       while (idx - lookBack >= 0) {
  //         const candidate = readings[idx - lookBack];
  //         if (
  //           candidate &&
  //           (condition ? condition(candidate) : candidate.dueDate || candidate.disconnectionDate)
  //         ) {
  //           return candidate;
  //         }
  //         lookBack++;
  //       }
  //       return undefined;
  //     };

  //     for (let i = 0; i < sortedSelectedDates.length; i++) {
  //       const result: MeterReadingSchedule[] = [];
  //       let startIndex = 0;
  //       const currentSelectedDate = sortedSelectedDates[i]!;

  //       for (let j = startIndex; j < split.length; j++) {
  //         if (isBefore(split[j]!.readingDate, currentSelectedDate)) {
  //           result.push(split[j]!);
  //         }

  //         if (isSameDay(currentSelectedDate, split[j]?.readingDate as Date)) {
  //           const curr = split[j];
  //           const prev = findPreviousValidReading(split, j);

  //           const currentReading: MeterReadingSchedule = {
  //             readingDate: curr.readingDate,
  //             dueDate: [curr.dueDate, prev?.dueDate].filter(Boolean).slice(0, 2) as Date[],
  //             disconnectionDate: [curr.disconnectionDate, prev?.disconnectionDate]
  //               .filter(Boolean)
  //               .slice(0, 2) as Date[],
  //           };

  //           result.push(currentReading);

  //           startIndex = j + 1;

  //           for (let k = startIndex; k < split.length; k++) {
  //             const curr = split[k];
  //             if (!curr?.dueDate && !curr?.disconnectionDate) {
  //               result.push(curr!);
  //               continue;
  //             }

  //             const prev = findPreviousValidReading(split, k);

  //             //! previous code aug 6 2025
  //             // const nextReadingDate: MeterReadingSchedule = {
  //             //   readingDate: curr?.readingDate as Date,
  //             //   dueDate: prev?.dueDate,
  //             //   disconnectionDate: prev?.disconnectionDate,
  //             // };

  //             let newDueDate = prev?.dueDate;
  //             let newDisconnectionDate = prev?.disconnectionDate;

  //             // ✅ If current day is Sunday, copy Saturday's dates if available
  //             if (isSunday(curr!.readingDate)) {
  //               const lastSaturday = findPreviousValidReading(split, k, (d) => getDay(d.readingDate) === 6);
  //               if (lastSaturday) {
  //                 newDueDate = lastSaturday.dueDate;
  //                 newDisconnectionDate = lastSaturday.disconnectionDate;
  //               }
  //             }

  //             const nextReadingDate: MeterReadingSchedule = {
  //               readingDate: curr!.readingDate,
  //               dueDate: newDueDate,
  //               disconnectionDate: newDisconnectionDate,
  //             };

  //             result.push(nextReadingDate);
  //           }
  //         }
  //       }
  //       split = [...result];
  //     }
  //     return split;
  //   },
  //   [calculateSchedule, removeDuplicateDates],
  // );

  //!  code v3
  // const splitDates = useCallback(
  //   (selectedDates: Date[]) => {
  //     const schedule = calculateSchedule();

  //     const uniqueDates = removeDuplicateDates(selectedDates);
  //     const sortedSelectedDates = [...uniqueDates].sort(compareAsc);

  //     let split = [...schedule];

  //     const normalizeDate = (value: Date | Date[] | undefined): Date | undefined => {
  //       if (!value) return undefined;
  //       return Array.isArray(value) ? value[0] : value;
  //     };

  //     const findPreviousValidReading = (
  //       readings: MeterReadingSchedule[],
  //       idx: number,
  //       condition?: (r: MeterReadingSchedule) => boolean,
  //     ) => {
  //       let lookBack = 1;
  //       while (idx - lookBack >= 0) {
  //         const candidate = readings[idx - lookBack];
  //         if (
  //           candidate &&
  //           (condition ? condition(candidate) : candidate.dueDate || candidate.disconnectionDate)
  //         ) {
  //           return candidate;
  //         }
  //         lookBack++;
  //       }
  //       return undefined;
  //     };

  //     for (let i = 0; i < sortedSelectedDates.length; i++) {
  //       const result: MeterReadingSchedule[] = [];
  //       let startIndex = 0;

  //       const currentSelectedDate = sortedSelectedDates[i]!;

  //       for (let j = startIndex; j < split.length; j++) {
  //         if (isBefore(split[j]!.readingDate, currentSelectedDate)) {
  //           result.push(split[j]!);
  //         }

  //         if (isSameDay(currentSelectedDate, split[j]?.readingDate as Date)) {
  //           const curr = split[j];
  //           let prev = findPreviousValidReading(split, j);

  //           const currentReading: MeterReadingSchedule = {
  //             readingDate: curr.readingDate,
  //             dueDate: [curr.dueDate, prev?.dueDate].filter(Boolean).slice(0, 2) as Date[],
  //             disconnectionDate: [curr.disconnectionDate, prev?.disconnectionDate]
  //               .filter(Boolean)
  //               .slice(0, 2) as Date[],
  //           };

  //           result.push(currentReading);

  //           startIndex = j + 1;

  //           for (let k = startIndex; k < split.length; k++) {
  //             const curr = split[k];

  //             if (!curr?.dueDate && !curr?.disconnectionDate) {
  //               result.push(curr!);
  //               continue;
  //             }

  //             let newDueDate: Date | undefined;
  //             let newDisconnectionDate: Date | undefined;

  //             const prevDue = normalizeDate(prev?.dueDate);
  //             const prevDisc = normalizeDate(prev?.disconnectionDate);
  //             const currDue = normalizeDate(curr?.dueDate);
  //             const currDisc = normalizeDate(curr?.disconnectionDate);

  //             if (isSunday(curr.readingDate)) {
  //               // ✅ Sunday → Copy last Saturday's dates if available
  //               const lastSaturday = findPreviousValidReading(
  //                 result,
  //                 result.length,
  //                 (d) => getDay(d.readingDate) === 6,
  //               );
  //               if (lastSaturday) {
  //                 newDueDate = normalizeDate(lastSaturday.dueDate);
  //                 newDisconnectionDate = normalizeDate(lastSaturday.disconnectionDate);
  //               } else {
  //                 // If no Saturday, fallback to prev
  //                 newDueDate = prevDue;
  //                 newDisconnectionDate = prevDisc;
  //               }
  //             } else {
  //               // ✅ Weekdays → Increment by 1 day from prev if possible
  //               if (prevDue && prevDisc) {
  //                 newDueDate = addDays(prevDue, 1);
  //                 newDisconnectionDate = addDays(prevDisc, 1);
  //               } else {
  //                 // Fallback to original schedule
  //                 newDueDate = currDue;
  //                 newDisconnectionDate = currDisc;
  //               }
  //             }

  //             const nextReadingDate: MeterReadingSchedule = {
  //               readingDate: curr.readingDate,
  //               dueDate: newDueDate,
  //               disconnectionDate: newDisconnectionDate,
  //             };

  //             result.push(nextReadingDate);

  //             // ✅ Update prev so subsequent days shift correctly
  //             prev = nextReadingDate;
  //           }
  //         }
  //       }

  //       split = [...result];
  //     }

  //     return split;
  //   },
  //   [calculateSchedule, removeDuplicateDates],
  // );

  // code v4 (02-26-2026)
  // const splitDates = useCallback(
  //   (selectedDates: Date[]) => {
  //     const schedule = calculateSchedule();

  //     const uniqueDates = removeDuplicateDates(selectedDates);
  //     const sortedSelectedDates = [...uniqueDates].sort(compareAsc);

  //     let split = [...schedule];

  //     const normalizeDate = (value: Date | Date[] | undefined): Date | undefined => {
  //       if (!value) return undefined;
  //       return Array.isArray(value) ? value[0] : value;
  //     };

  //     const findPreviousValidReading = (
  //       readings: MeterReadingSchedule[],
  //       idx: number,
  //       condition?: (r: MeterReadingSchedule) => boolean,
  //     ) => {
  //       let lookBack = 1;
  //       while (idx - lookBack >= 0) {
  //         const candidate = readings[idx - lookBack];
  //         if (
  //           candidate &&
  //           (condition ? condition(candidate) : candidate.dueDate || candidate.disconnectionDate)
  //         ) {
  //           return candidate;
  //         }
  //         lookBack++;
  //       }
  //       return undefined;
  //     };

  //     for (let i = 0; i < sortedSelectedDates.length; i++) {
  //       const result: MeterReadingSchedule[] = [];
  //       let startIndex = 0;

  //       const currentSelectedDate = sortedSelectedDates[i]!;

  //       for (let j = startIndex; j < split.length; j++) {
  //         if (isBefore(split[j]!.readingDate, currentSelectedDate)) {
  //           result.push(split[j]!);
  //         }

  //         if (isSameDay(currentSelectedDate, split[j]?.readingDate as Date)) {
  //           const curr = split[j];
  //           let prev = findPreviousValidReading(split, j);

  //           const currentReading: MeterReadingSchedule = {
  //             readingDate: curr.readingDate,
  //             dueDate: [curr.dueDate, prev?.dueDate].filter(Boolean).slice(0, 2) as Date[],
  //             disconnectionDate: [curr.disconnectionDate, prev?.disconnectionDate]
  //               .filter(Boolean)
  //               .slice(0, 2) as Date[],
  //           };

  //           result.push(currentReading);

  //           startIndex = j + 1;

  //           for (let k = startIndex; k < split.length; k++) {
  //             const curr = split[k];

  //             if (!curr?.dueDate && !curr?.disconnectionDate) {
  //               result.push(curr!);
  //               continue;
  //             }

  //             let newDueDate: Date | undefined;
  //             let newDisconnectionDate: Date | undefined;

  //             const prevDue = normalizeDate(prev?.dueDate);
  //             const prevDisc = normalizeDate(prev?.disconnectionDate);
  //             const currDue = normalizeDate(curr?.dueDate);
  //             const currDisc = normalizeDate(curr?.disconnectionDate);

  //             if (isSunday(curr.readingDate)) {
  //               // ✅ Sunday → Copy last Saturday's dates if available
  //               const lastSaturday = findPreviousValidReading(
  //                 result,
  //                 result.length,
  //                 (d) => getDay(d.readingDate) === 6,
  //               );
  //               if (lastSaturday) {
  //                 newDueDate = normalizeDate(lastSaturday.dueDate);
  //                 newDisconnectionDate = normalizeDate(lastSaturday.disconnectionDate);
  //               } else {
  //                 // Fallback to previous reading
  //                 newDueDate = prevDue;
  //                 newDisconnectionDate = prevDisc;
  //               }
  //             } else {
  //               // ✅ Weekdays → Increment and adjust for holidays/weekends/non-duty days
  //               if (prevDue && prevDisc) {
  //                 newDueDate = adjustForHolidayOrWeekend(addDays(prevDue, 1)); // changed from addDays to adjust before adding
  //                 newDisconnectionDate = adjustForHolidayOrWeekend(addDays(prevDisc, 1));
  //               } else {
  //                 // Fallback to original schedule
  //                 newDueDate = currDue ? adjustForHolidayOrWeekend(currDue) : undefined; // changed from currDue to adjust before currDue
  //                 newDisconnectionDate = currDisc ? adjustForHolidayOrWeekend(currDisc) : undefined;
  //               }
  //             }

  //             const nextReadingDate: MeterReadingSchedule = {
  //               readingDate: curr.readingDate,
  //               dueDate: newDueDate,
  //               disconnectionDate: newDisconnectionDate,
  //             };

  //             result.push(nextReadingDate);

  //             // ✅ Update prev so subsequent days shift correctly
  //             prev = nextReadingDate;
  //           }
  //         }
  //       }

  //       split = [...result];
  //     }

  //     return split;
  //   },
  //   [calculateSchedule, removeDuplicateDates, adjustForHolidayOrWeekend],
  // );

  //! code v5 02-26-2026
  // code v7 (02-26-2026) - Fixed Saturday splitting with correct array order
  const splitDates = useCallback(
    (selectedDates: Date[]) => {
      const schedule = calculateSchedule();

      const uniqueDates = removeDuplicateDates(selectedDates);
      const sortedSelectedDates = [...uniqueDates].sort(compareAsc);

      let split = [...schedule];

      const normalizeDate = (value: Date | Date[] | undefined): Date | undefined => {
        if (!value) return undefined;
        return Array.isArray(value) ? value[0] : value;
      };

      const findPreviousValidReading = (
        readings: MeterReadingSchedule[],
        idx: number,
        condition?: (r: MeterReadingSchedule) => boolean,
      ) => {
        let lookBack = 1;
        while (idx - lookBack >= 0) {
          const candidate = readings[idx - lookBack];
          if (
            candidate &&
            (condition ? condition(candidate) : candidate.dueDate || candidate.disconnectionDate)
          ) {
            return candidate;
          }
          lookBack++;
        }
        return undefined;
      };

      for (let i = 0; i < sortedSelectedDates.length; i++) {
        const result: MeterReadingSchedule[] = [];
        let startIndex = 0;

        const currentSelectedDate = sortedSelectedDates[i]!;

        for (let j = startIndex; j < split.length; j++) {
          if (isBefore(split[j]!.readingDate, currentSelectedDate)) {
            result.push(split[j]!);
          }

          if (isSameDay(currentSelectedDate, split[j]?.readingDate as Date)) {
            const curr = split[j];
            let prev = findPreviousValidReading(split, j);

            // Store original dates for this day
            const originalDue = normalizeDate(curr.dueDate);
            const originalDisc = normalizeDate(curr.disconnectionDate);

            // Get previous day's dates (for the first element of the array)
            const prevDue = normalizeDate(prev?.dueDate);
            const prevDisc = normalizeDate(prev?.disconnectionDate);

            // Create the split entry with array of dates [PREVIOUS, ORIGINAL]
            const currentReading: MeterReadingSchedule = {
              readingDate: curr.readingDate,
              dueDate: [prevDue, originalDue].filter(Boolean) as Date[],
              disconnectionDate: [prevDisc, originalDisc].filter(Boolean) as Date[],
            };

            result.push(currentReading);

            startIndex = j + 1;

            // Check if the selected date is Saturday
            const isSelectedSaturday = getDay(curr.readingDate) === 6;

            // If it's Saturday, we need to also split the following Sunday
            let sundayToSplit: MeterReadingSchedule | null = null;
            let sundayIndex = -1;
            let sundayOriginalDue: Date | undefined;
            let sundayOriginalDisc: Date | undefined;

            if (isSelectedSaturday) {
              // Look for the following Sunday (should be the next day)
              for (let idx = j + 1; idx < split.length; idx++) {
                const candidate = split[idx];
                if (
                  candidate &&
                  getDay(candidate.readingDate) === 0 &&
                  isSameDay(candidate.readingDate, addDays(curr.readingDate, 1))
                ) {
                  sundayToSplit = candidate;
                  sundayIndex = idx;
                  sundayOriginalDue = normalizeDate(candidate.dueDate);
                  sundayOriginalDisc = normalizeDate(candidate.disconnectionDate);
                  break;
                }
              }
            }

            // Process remaining days
            for (let k = startIndex; k < split.length; k++) {
              const curr = split[k];

              // Skip if this is the Sunday we'll handle separately
              if (sundayToSplit && k === sundayIndex) {
                continue;
              }

              if (!curr?.dueDate && !curr?.disconnectionDate) {
                result.push(curr!);
                continue;
              }

              let newDueDate: Date | undefined;
              let newDisconnectionDate: Date | undefined;

              const currDue = normalizeDate(curr?.dueDate);
              const currDisc = normalizeDate(curr?.disconnectionDate);

              // Get the last added reading's dates (for increment)
              const lastReading = result.length > 0 ? result[result.length - 1] : null;
              const lastDue = normalizeDate(lastReading?.dueDate);
              const lastDisc = normalizeDate(lastReading?.disconnectionDate);

              // If we have a Sunday to split and this is after that Sunday
              if (sundayToSplit && k > sundayIndex) {
                // All days after the split Sunday use increment from previous
                if (lastDue && lastDisc) {
                  newDueDate = adjustForHolidayOrWeekend(addDays(lastDue, 1));
                  newDisconnectionDate = adjustForHolidayOrWeekend(addDays(lastDisc, 1));
                } else {
                  newDueDate = currDue ? adjustForHolidayOrWeekend(currDue) : undefined;
                  newDisconnectionDate = currDisc ? adjustForHolidayOrWeekend(currDisc) : undefined;
                }
              }
              // Regular Sunday (not the split Sunday)
              else if (isSunday(curr.readingDate) && (!sundayToSplit || k !== sundayIndex)) {
                const lastSaturday = findPreviousValidReading(
                  result,
                  result.length,
                  (d) => getDay(d.readingDate) === 6,
                );
                if (lastSaturday) {
                  newDueDate = normalizeDate(lastSaturday.dueDate);
                  newDisconnectionDate = normalizeDate(lastSaturday.disconnectionDate);
                } else {
                  newDueDate = lastDue;
                  newDisconnectionDate = lastDisc;
                }
              }
              // All other days
              else {
                if (lastDue && lastDisc) {
                  newDueDate = adjustForHolidayOrWeekend(addDays(lastDue, 1));
                  newDisconnectionDate = adjustForHolidayOrWeekend(addDays(lastDisc, 1));
                } else {
                  newDueDate = currDue ? adjustForHolidayOrWeekend(currDue) : undefined;
                  newDisconnectionDate = currDisc ? adjustForHolidayOrWeekend(currDisc) : undefined;
                }
              }

              const nextReadingDate: MeterReadingSchedule = {
                readingDate: curr.readingDate,
                dueDate: newDueDate,
                disconnectionDate: newDisconnectionDate,
              };

              result.push(nextReadingDate);
            }

            // If we have a Sunday to split, add it with the same values as Saturday
            if (sundayToSplit) {
              // Get Saturday's dates and ensure they're all valid Dates
              const saturdayDueArray = (
                Array.isArray(currentReading.dueDate) ? currentReading.dueDate : [currentReading.dueDate]
              ).filter((d): d is Date => d instanceof Date);

              const saturdayDiscArray = (
                Array.isArray(currentReading.disconnectionDate)
                  ? currentReading.disconnectionDate
                  : [currentReading.disconnectionDate]
              ).filter((d): d is Date => d instanceof Date);

              // Sunday gets the SAME array values as Saturday
              const sundayReading: MeterReadingSchedule = {
                readingDate: sundayToSplit.readingDate,
                dueDate: saturdayDueArray,
                disconnectionDate: saturdayDiscArray,
              };

              // Insert Sunday after Saturday in the result
              const saturdayPos = result.findIndex((r) => isSameDay(r.readingDate, curr.readingDate));
              if (saturdayPos !== -1) {
                result.splice(saturdayPos + 1, 0, sundayReading);
              }
            }
          }
        }

        split = [...result];
      }

      return split;
    },
    [calculateSchedule, removeDuplicateDates, adjustForHolidayOrWeekend],
  );

  const assignMeterReaders = useCallback(
    (schedule: MeterReadingSchedule[], meterReaders: MeterReader[]): MeterReadingEntryWithZonebooks[] => {
      const transformMeterReaders: MeterReaderWithZonebooks[] = meterReaders.map((mr) => ({
        ...mr,
        reassignment: { remarks: "", zoneBooks: [] },
        zoneBooks: mr.zoneBooks.map((zb) => ({ ...zb, dueDate: undefined, disconnectionDate: undefined })),
      }));

      return schedule.map((entry) => {
        if (!Array.isArray(entry.dueDate) && (!entry.dueDate || !isValid(entry.dueDate))) {
          return { ...entry, meterReaders: [] };
        }

        // Pre-calculate day number mapping for the entire schedule
        const dayNumberMap = calculateDayNumberMap(schedule);

        const day = dayNumberMap.get(entry.readingDate.toISOString()) || 1;

        const readingRestDay = getDayName(entry.readingDate);
        const availableReaders = transformMeterReaders.filter((reader) => reader.restDay !== readingRestDay);

        return { ...entry, meterReaders: availableReaders, day };
      });
    },
    [],
  );

  //! V1 assignMeterReadersWithDays
  // const assignMeterReadersWithDays = useCallback(
  //   (schedule: MeterReadingSchedule[], meterReaders: MeterReader[]): MeterReadingEntryWithZonebooks[] => {
  //     // const meterReadersWithDays = addRandomDayNumbers(meterReaders);

  //     // Pre-calculate day number mapping for the entire schedule
  //     const dayNumberMap = calculateDayNumberMap(schedule);

  //     return schedule.map((entry) => {
  //       if (!Array.isArray(entry.dueDate) && (!entry.dueDate || !isValid(entry.dueDate))) {
  //         return { ...entry, meterReaders: [] };
  //       }

  //       const readingRestDay = getDayName(entry.readingDate);
  //       const day = dayNumberMap.get(entry.readingDate.toISOString()) || 1;

  //       // @ts-ignore
  //       const assignedMeterReaders: MeterReaderWithZonebooks[] = meterReaders
  //         .filter((reader) => reader.restDay !== readingRestDay)
  //         .map((reader) => {
  //           const assignedZoneBooks = reader.zoneBooks.filter((zoneBook) => zoneBook.day === day);
  //           const sortedDueDates = formatAndSortDates(entry.dueDate);
  //           const sortedDisconnectionDates = formatAndSortDates(entry.disconnectionDate);

  //           return {
  //             ...reader,
  //             reassignment: { zoneBooks: [], remarks: null },
  //             zoneBooks: assignedZoneBooks.map((zb) => ({
  //               ...zb,
  //               dueDate: !Array.isArray(entry.dueDate) ? formatDate(entry.dueDate) : sortedDueDates[0],
  //               disconnectionDate: !Array.isArray(entry.disconnectionDate)
  //                 ? formatDate(entry.disconnectionDate)
  //                 : sortedDisconnectionDates[0],
  //             })),
  //           };
  //         })
  //         .filter((reader) => reader.zoneBooks.length > 0);

  //       return {
  //         ...entry,
  //         meterReaders: assignedMeterReaders,
  //         day,
  //       };
  //     });
  //   },
  //   [],
  // );

  const assignMeterReadersWithDays = useCallback(
    (schedule: MeterReadingSchedule[], meterReaders: MeterReader[]): MeterReadingEntryWithZonebooks[] => {
      // Calculate day numbers ONCE (normal calculation)
      const dayNumberMap = calculateDayNumberMap(schedule);

      // Pre-calculate: Check if each month starts on Sunday
      const monthStartsOnSunday = new Map<number, boolean>();

      schedule.forEach((entry) => {
        const month = getMonth(entry.readingDate);
        const date = getDate(entry.readingDate);
        const dayOfWeek = getDay(entry.readingDate);

        if (date === 1) {
          monthStartsOnSunday.set(month, dayOfWeek === 0);
        }
      });

      return schedule.map((entry) => {
        if (!Array.isArray(entry.dueDate) && (!entry.dueDate || !isValid(entry.dueDate))) {
          return { ...entry, meterReaders: [] };
        }

        const readingDate = entry.readingDate;
        const readingRestDay = getDayName(readingDate);
        const day = dayNumberMap.get(readingDate.toISOString()) || 1;

        // Get the month and check if it starts on Sunday
        const month = getMonth(readingDate);
        const monthStartsSunday = monthStartsOnSunday.get(month) || false;

        // @ts-ignore
        const assignedMeterReaders: MeterReaderWithZonebooks[] = meterReaders
          .filter((reader) => reader.restDay !== readingRestDay)
          .map((reader) => {
            // Determine which zonebook day to use
            let zoneBookDay = day;
            let hasZoneBooks = true;

            // SPECIAL RULE: For Saturday-rest-day readers when month starts on Sunday
            if (reader.restDay === "saturday" && monthStartsSunday) {
              const date = getDate(readingDate);
              const dayOfWeek = getDay(readingDate);

              if (date === 1 && dayOfWeek === 0) {
                // Feb 1 (Sunday) - Day 1: Use Day 1 zonebooks
                zoneBookDay = 1;
              } else {
                // For all other days: Saturday-rest-day readers are ONE DAY AHEAD
                zoneBookDay = day + 1;

                // If zoneBookDay exceeds 21, this reader gets NO zonebooks for this day
                if (zoneBookDay > 21) {
                  hasZoneBooks = false;
                }
              }
            }

            // If no zonebooks, return null to be filtered out
            if (!hasZoneBooks) {
              return null;
            }

            const assignedZoneBooks = reader.zoneBooks.filter((zoneBook) => zoneBook.day === zoneBookDay);
            const sortedDueDates = formatAndSortDates(entry.dueDate);
            const sortedDisconnectionDates = formatAndSortDates(entry.disconnectionDate);

            return {
              ...reader,
              reassignment: { zoneBooks: [], remarks: null },
              zoneBooks: assignedZoneBooks.map((zb) => ({
                ...zb,
                dueDate: !Array.isArray(entry.dueDate) ? formatDate(entry.dueDate) : sortedDueDates[0],
                disconnectionDate: !Array.isArray(entry.disconnectionDate)
                  ? formatDate(entry.disconnectionDate)
                  : sortedDisconnectionDates[0],
              })),
            };
          })
          .filter((reader) => reader !== null && reader.zoneBooks.length > 0) as MeterReaderWithZonebooks[];

        return {
          ...entry,
          meterReaders: assignedMeterReaders,
          day, // Always show the normal day number
        };
      });
    },
    [],
  );
  // Helper to log the day assignments
  const logDayAssignments = (schedule: MeterReadingSchedule[]) => {
    const dayMap = calculateDayNumberMap(schedule);
    const assignments = Array.from(dayMap.entries())
      .map(([date, day]) => ({
        date: format(new Date(date), "yyyy-MM-dd (EEE)"),
        dayNumber: day,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    assignments.forEach((assignment) => {
      console.log(`${assignment.date}: Day ${assignment.dayNumber}`);
    });
  };

  // Pre-calculate day numbers for all working days
  // const calculateDayNumberMap = (schedule: MeterReadingSchedule[]): Map<string, number> => {
  //   const dayMap = new Map<string, number>();
  //   const workingDays = schedule
  //     .filter((entry) => entry.dueDate || entry.disconnectionDate)
  //     .sort((a, b) => compareAsc(a.readingDate, b.readingDate));

  //   let dayCounter = 1;
  //   let i = 0;

  //   while (i < workingDays.length) {
  //     const current = workingDays[i];
  //     if (!current) break;

  //     const currentDayOfWeek = getDay(current.readingDate);
  //     const next = workingDays[i + 1];

  //     // Check if this is Saturday and next is consecutive Sunday
  //     const isConsecutiveWeekendPair =
  //       currentDayOfWeek === 6 &&
  //       next &&
  //       getDay(next.readingDate) === 0 &&
  //       isSameDay(next.readingDate, addDays(current.readingDate, 1));

  //     if (isConsecutiveWeekendPair) {
  //       // Assign same day number to Saturday-Sunday pair
  //       dayMap.set(current.readingDate.toISOString(), dayCounter);
  //       dayMap.set(next.readingDate.toISOString(), dayCounter);
  //       i += 2;
  //     } else {
  //       // Single day assignment
  //       dayMap.set(current.readingDate.toISOString(), dayCounter);
  //       i += 1;
  //     }

  //     // Move to next day number in cycle
  //     dayCounter = dayCounter < 21 ? dayCounter + 1 : 1;
  //   }

  //   return dayMap;
  // };

  //! V1 calculateDayNumberMap
  // const calculateDayNumberMap = (schedule: MeterReadingSchedule[]): Map<string, number> => {
  //   const dayMap = new Map<string, number>();
  //   const workingDays = schedule
  //     .filter((entry) => entry.dueDate || entry.disconnectionDate)
  //     .sort((a, b) => compareAsc(a.readingDate, b.readingDate));

  //   let dayCounter = 1;
  //   let currentMonth = -1;
  //   let isFirstDayOfMonth = true;
  //   let i = 0;

  //   while (i < workingDays.length) {
  //     const current = workingDays[i];
  //     if (!current) break;

  //     const readingDate = current.readingDate;
  //     const month = getMonth(readingDate);

  //     // Check if this is a new month
  //     if (month !== currentMonth) {
  //       dayCounter = 1;
  //       currentMonth = month;
  //       isFirstDayOfMonth = true;
  //     }

  //     const currentDayOfWeek = getDay(readingDate);
  //     const next = workingDays[i + 1];

  //     // Check if this is the special case: First day of month is Sunday
  //     if (isFirstDayOfMonth && currentDayOfWeek === 0) {
  //       // First working day of month is Sunday
  //       dayMap.set(readingDate.toISOString(), dayCounter);

  //       // Check if next day is Monday and consecutive
  //       if (next) {
  //         const nextDayOfWeek = getDay(next.readingDate);
  //         const areConsecutive = isSameDay(next.readingDate, addDays(readingDate, 1));

  //         if (areConsecutive && nextDayOfWeek === 1) {
  //           // Monday gets same day number as Sunday
  //           dayMap.set(next.readingDate.toISOString(), dayCounter);
  //           i += 2;
  //           isFirstDayOfMonth = false;

  //           // Increment day counter for next day
  //           dayCounter = dayCounter < 21 ? dayCounter + 1 : 1;
  //           continue;
  //         }
  //       }

  //       // No consecutive Monday, just process Sunday
  //       i += 1;
  //       isFirstDayOfMonth = false;
  //       dayCounter = dayCounter < 21 ? dayCounter + 1 : 1;
  //       continue;
  //     }

  //     // Regular processing (not first-day-of-month Sunday)
  //     const isConsecutiveWeekendPair =
  //       currentDayOfWeek === 6 && // Saturday
  //       next &&
  //       getDay(next.readingDate) === 0 && // Sunday
  //       isSameDay(next.readingDate, addDays(readingDate, 1));

  //     if (isConsecutiveWeekendPair) {
  //       // Assign same day number to Saturday-Sunday pair
  //       dayMap.set(readingDate.toISOString(), dayCounter);
  //       dayMap.set(next.readingDate.toISOString(), dayCounter);
  //       i += 2;
  //     } else {
  //       // Single day assignment
  //       dayMap.set(readingDate.toISOString(), dayCounter);
  //       i += 1;
  //     }

  //     // Update flags
  //     isFirstDayOfMonth = false;

  //     // Move to next day number in cycle
  //     dayCounter = dayCounter < 21 ? dayCounter + 1 : 1;
  //   }

  //   return dayMap;
  // };

  // Modified function that takes restDay into account
  const calculateDayNumberMap = (
    schedule: MeterReadingSchedule[],
    restDay: string | null = null,
  ): Map<string, number> => {
    const dayMap = new Map<string, number>();
    const workingDays = schedule
      .filter((entry) => entry.dueDate || entry.disconnectionDate)
      .sort((a, b) => compareAsc(a.readingDate, b.readingDate));

    let dayCounter = 1;
    let currentMonth = -1;
    let isFirstDayOfMonth = true;
    let i = 0;

    // Check if restDay is Saturday
    const isSaturdayRestDay = restDay === "Saturday";

    while (i < workingDays.length) {
      const current = workingDays[i];
      if (!current) break;

      const readingDate = current.readingDate;
      const month = getMonth(readingDate);

      // Check if this is a new month
      if (month !== currentMonth) {
        dayCounter = 1;
        currentMonth = month;
        isFirstDayOfMonth = true;
      }

      const currentDayOfWeek = getDay(readingDate);
      const next = workingDays[i + 1];

      // SPECIAL RULE: If rest day is Saturday and first day of month is Sunday
      if (isSaturdayRestDay && isFirstDayOfMonth && currentDayOfWeek === 0) {
        // First working day of month is Sunday
        dayMap.set(readingDate.toISOString(), dayCounter);

        // For Saturday rest day: Monday does NOT get same day number
        // Monday gets next day number (Day 2 assigned to position 1)
        i += 1;
        isFirstDayOfMonth = false;
        dayCounter = dayCounter < 21 ? dayCounter + 1 : 1;
        continue;
      }

      // NORMAL RULE: If NOT Saturday rest day, apply Sunday-Monday pairing
      if (!isSaturdayRestDay && isFirstDayOfMonth && currentDayOfWeek === 0) {
        // First working day of month is Sunday
        dayMap.set(readingDate.toISOString(), dayCounter);

        // Check if next day is Monday and consecutive
        if (next) {
          const nextDayOfWeek = getDay(next.readingDate);
          const areConsecutive = isSameDay(next.readingDate, addDays(readingDate, 1));

          if (areConsecutive && nextDayOfWeek === 1) {
            // Monday gets same day number as Sunday (normal case)
            dayMap.set(next.readingDate.toISOString(), dayCounter);
            i += 2;
            isFirstDayOfMonth = false;

            // Increment day counter for next day
            dayCounter = dayCounter < 21 ? dayCounter + 1 : 1;
            continue;
          }
        }

        // No consecutive Monday, just process Sunday
        i += 1;
        isFirstDayOfMonth = false;
        dayCounter = dayCounter < 21 ? dayCounter + 1 : 1;
        continue;
      }

      // Regular Saturday-Sunday pairing (applies to all)
      const isConsecutiveWeekendPair =
        currentDayOfWeek === 6 && // Saturday
        next &&
        getDay(next.readingDate) === 0 && // Sunday
        isSameDay(next.readingDate, addDays(readingDate, 1));

      if (isConsecutiveWeekendPair) {
        // Assign same day number to Saturday-Sunday pair
        dayMap.set(readingDate.toISOString(), dayCounter);
        dayMap.set(next.readingDate.toISOString(), dayCounter);
        i += 2;
      } else {
        // Single day assignment
        dayMap.set(readingDate.toISOString(), dayCounter);
        i += 1;
      }

      // Update flags
      isFirstDayOfMonth = false;

      // Move to next day number in cycle
      dayCounter = dayCounter < 21 ? dayCounter + 1 : 1;
    }

    return dayMap;
  };

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
    return schedule.map((day) => ({ readingDate: day.readingDate }));
  }, [calculateSchedule]);

  return {
    calculateSchedule,
    assignMeterReaders,
    splitDates,
    getWorkingDays,
    formatDate,
    goToPreviousMonth,
    goToNextMonth,
    today,
    setCurrentDate,
    setCurrentMonthYear,
    assignMeterReadersWithDays,
    logDayAssignments,
    currentDate,
    currentMonthYear,
  };
};
