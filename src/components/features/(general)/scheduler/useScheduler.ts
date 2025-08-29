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
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Holiday, NonBusinessDays } from "./holidays";
import { normalizeToYyyyMmDd } from "@mr/lib/functions/normalizeToYyyyMmDd";

type MeterReadingDate = { readingDate: Date };
type DueDate = { readingDate: Date; dueDate: Date };
type DisconnectionDate = { readingDate: Date; dueDate: Date; disconnectionDate: Date };

export type Scheduler = ReturnType<typeof useScheduler>;

export const useScheduler = (holidays: Holiday[]) => {
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

  //! code v4
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

            const currentReading: MeterReadingSchedule = {
              readingDate: curr.readingDate,
              dueDate: [curr.dueDate, prev?.dueDate].filter(Boolean).slice(0, 2) as Date[],
              disconnectionDate: [curr.disconnectionDate, prev?.disconnectionDate]
                .filter(Boolean)
                .slice(0, 2) as Date[],
            };

            result.push(currentReading);

            startIndex = j + 1;

            for (let k = startIndex; k < split.length; k++) {
              const curr = split[k];

              if (!curr?.dueDate && !curr?.disconnectionDate) {
                result.push(curr!);
                continue;
              }

              let newDueDate: Date | undefined;
              let newDisconnectionDate: Date | undefined;

              const prevDue = normalizeDate(prev?.dueDate);
              const prevDisc = normalizeDate(prev?.disconnectionDate);
              const currDue = normalizeDate(curr?.dueDate);
              const currDisc = normalizeDate(curr?.disconnectionDate);

              if (isSunday(curr.readingDate)) {
                // ✅ Sunday → Copy last Saturday's dates if available
                const lastSaturday = findPreviousValidReading(
                  result,
                  result.length,
                  (d) => getDay(d.readingDate) === 6,
                );
                if (lastSaturday) {
                  newDueDate = normalizeDate(lastSaturday.dueDate);
                  newDisconnectionDate = normalizeDate(lastSaturday.disconnectionDate);
                } else {
                  // Fallback to previous reading
                  newDueDate = prevDue;
                  newDisconnectionDate = prevDisc;
                }
              } else {
                // ✅ Weekdays → Increment and adjust for holidays/weekends/non-duty days
                if (prevDue && prevDisc) {
                  newDueDate = adjustForHolidayOrWeekend(addDays(prevDue, 1)); // changed from addDays to adjust before adding
                  newDisconnectionDate = adjustForHolidayOrWeekend(addDays(prevDisc, 1));
                } else {
                  // Fallback to original schedule
                  newDueDate = currDue ? adjustForHolidayOrWeekend(currDue) : undefined; // changed from currDue to adjust before currDue
                  newDisconnectionDate = currDisc ? adjustForHolidayOrWeekend(currDisc) : undefined;
                }
              }

              const nextReadingDate: MeterReadingSchedule = {
                readingDate: curr.readingDate,
                dueDate: newDueDate,
                disconnectionDate: newDisconnectionDate,
              };

              result.push(nextReadingDate);

              // ✅ Update prev so subsequent days shift correctly
              prev = nextReadingDate;
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
        zoneBooks: mr.zoneBooks.map((zb) => ({ ...zb, dueDate: undefined, disconnectionDate: undefined })),
      }));

      return schedule.map((entry) => {
        if (!Array.isArray(entry.dueDate) && (!entry.dueDate || !isValid(entry.dueDate))) {
          return { ...entry, meterReaders: [] };
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
    currentDate,
    currentMonthYear,
  };
};
