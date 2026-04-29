"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { HolidayFromHrms, NonBusinessDays } from "./holidays";
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { normalizeToYyyyMmDd } from "@mr/lib/functions/normalizeToYyyyMmDd";
import { MeterReadingEntryWithZonebooks, MeterReadingSchedule } from "@mr/lib/types/schedule";
import { MeterReader, MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import formatAndSortDates from "@mr/lib/functions/dateArraySorter";

const MAXIMUM_READING_DAYS_COUNT = 21; // minus 1

type MeterReadingDate = { readingDate: Date };
type DueDate = { readingDate: Date; dueDate: Date };
type DisconnectionDate = { readingDate: Date; dueDate: Date; disconnectionDate: Date };

export type Scheduler = ReturnType<typeof useNewScheduler>;

export const useNewScheduler = (holidays: HolidayFromHrms[], noDueDays: number[]) => {
  const searchParams = useSearchParams();
  const monthYear =
    searchParams.get("date") === null ? format(new Date(), "yyyy-MM") : searchParams.get("date");

  const [currentDate, setCurrentDate] = useState<Date>(
    monthYear ? parse(monthYear, "yyyy-MM", new Date()) : new Date(),
  );

  const [currentMonthYear, setCurrentMonthYear] = useState<string | null>(monthYear);
  const router = useRouter();

  useEffect(() => {
    router.replace(`/schedules?date=${currentMonthYear}`);
  }, [currentMonthYear, router]);

  // this uses a date fns getDay function to get the day name
  const getDayName = (
    date: Date,
  ): "sunday" | "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | undefined => {
    const day = getDay(date);
    if (day === 0) return "sunday";
    if (day === 6) return "saturday";
    return undefined;
  };

  const formatDate = (date: Date | undefined, dateFormat: "yyyy-MM-dd" | "MMM dd" | "dd" = "yyyy-MM-dd") => {
    return date ? format(date, dateFormat) : undefined;
  };

  // this uses the holidays array from the parameters
  const holidayDates = useMemo(
    () => holidays.map((holiday) => normalizeToYyyyMmDd(holiday.date)),
    [holidays],
  );

  // this gets a date and returns a boolean if it is a holiday or not
  const isHoliday = useCallback(
    (date: Date): boolean => holidayDates.includes(formatDate(date) as string),
    [holidayDates],
  );

  // this gets a date and returns a boolean to check if a date should not have due dates
  const isNoDueDay = useCallback(
    (date: Date): boolean => {
      const dayOfWeek = getDay(date);
      return noDueDays.includes(dayOfWeek);
    },
    [noDueDays],
  );

  // this gets a date and returns a boolean to check if a this date should be skipped for reading dates
  const isNoDutyDay = useCallback(
    (date: Date): boolean => {
      const mmdd = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return NonBusinessDays.some((day) => day.date === mmdd);
    },
    [NonBusinessDays],
  );

  // this function accepts an array of dates, checks, and removes if there are duplicate dates
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

  const adjustToNextBusinessDay = useCallback(
    (date: Date) => {
      let adjustedDate = date;

      // check if the date is a holiday, no duty day, or no due or disc days
      while (isHoliday(adjustedDate) || isNoDutyDay(adjustedDate) || isNoDueDay(adjustedDate)) {
        // if it falls on a holiday, no duty day, or no due days just add a day(1)
        adjustedDate = addDays(adjustedDate, 1);
      }
      return adjustedDate;
    },
    [isHoliday, isNoDutyDay, isNoDueDay],
  );

  //   const adjustToNextBusinessDay = useCallback(
  //     (date: Date) => {
  //       let adjustedDate = date;
  //       // Check if the date is a holiday, no duty day, or no due/disc day
  //       while (isHoliday(adjustedDate) || isNoDutyDay(adjustedDate) || isNoDueDay(adjustedDate)) {
  //         const isWeekendDay = getDay(adjustedDate) === 0 || getDay(adjustedDate) === 6;

  //         if (isWeekendDay) {
  //           // Weekends move to next Monday
  //           adjustedDate = nextMonday(adjustedDate);
  //         } else {
  //           // Holidays, No Duty Days, and other noDueDiscDays just add 1 day
  //           adjustedDate = addDays(adjustedDate, 1);
  //         }
  //       }
  //       return adjustedDate;
  //     },
  //     [isHoliday, isNoDutyDay, isNoDueDay],
  //   );

  // this function will get the calendar days based on the current month
  const getCalendarDays = useCallback(() => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    const firstDayOfCalendar = startOfWeek(firstDayOfMonth);
    const lastDayOfCalendar = endOfWeek(lastDayOfMonth);

    return eachDayOfInterval({ start: firstDayOfCalendar, end: lastDayOfCalendar });
  }, [currentDate]);

  // this function will get the starting reading date based on the current month
  const getStartingReadingDate = useCallback(() => {
    const monthStart = startOfMonth(currentDate);
    let startOfReadingDate = monthStart;

    while (isNoDutyDay(startOfReadingDate)) {
      startOfReadingDate = addDays(startOfReadingDate, 1);
    }

    return { monthStart, startOfReadingDate };
  }, [currentDate, isNoDutyDay]);

  // this function calculates the due dates based on the current month
  const calculateDueDates = useCallback((): DueDate[] => {
    const { monthStart, startOfReadingDate } = getStartingReadingDate();
    const dueDates: DueDate[] = [];

    let readingDate = startOfReadingDate;
    let slotCount = 0;
    let lastDueDate: Date | null = null;

    while (isSameMonth(readingDate, monthStart) && slotCount < MAXIMUM_READING_DAYS_COUNT) {
      let dueDate: Date;

      // do not skip reading dates = all reading dates are valid
      if (!lastDueDate) {
        // this adds 15 calendar days
        dueDate = addDays(readingDate, 15);
        dueDate = adjustToNextBusinessDay(dueDate);
      } else if (isSunday(readingDate)) {
        // all sunday reading date copies the previous(saturday) due date
        dueDate = lastDueDate;
      } else {
        dueDate = addDays(lastDueDate, 1);
        dueDate = adjustToNextBusinessDay(dueDate); // adjust if it falls on no due days
      }

      // push the reading date as well as its due date to the schedule array
      dueDates.push({ readingDate, dueDate });

      // slot counting
      if (!isSunday(readingDate)) {
        // but if reading date is on a saturday
        if (getDay(readingDate) === 6) {
          const nextDay = addDays(readingDate, 1);

          /* this checks if the next reading date is on the same month and
            if the next reading day is on a sunday
            */
          if (isSameMonth(nextDay, monthStart) && getDay(nextDay) === 0) {
            slotCount++; // this logic is because sat-sun has the same due dates
          } else slotCount++;
        } else slotCount++;
      }

      if (!isSunday(readingDate)) lastDueDate = dueDate;

      // increment the reading date by 1 day
      readingDate = addDays(readingDate, 1);
    }

    return dueDates;
  }, [adjustToNextBusinessDay, getStartingReadingDate]);

  // this function calculates the disconnection dates based on the current month and its following due dates
  const calculateDisconnectionDates = useCallback(
    (dueDates: DueDate[]): DisconnectionDate[] => {
      const disconnectionDates: DisconnectionDate[] = [];
      const usedDisconnectionDates = new Set<string>();

      // helper function to add working days
      const addWorkingDays = (startDate: Date, daysToAdd: number): Date => {
        let result = new Date(startDate);
        let daysAdded = 0;

        while (daysAdded < daysToAdd) {
          result = addDays(result, 1);

          // check if the next day is a valid working day
          const isValidWorkingDay =
            !isHoliday(result) && !isNoDutyDay(result) && !isWeekend(result) && !isNoDueDay(result);

          if (isValidWorkingDay) daysAdded++;
        }

        return result;
      };

      let i = 0;

      while (i < dueDates.length) {
        const current = dueDates[i];
        const next = dueDates[i + 1];

        const isSaturday = getDay(current.readingDate) === 6;
        const isSunday = getDay(current.readingDate) === 0;
        const isNextSunday =
          next && getDay(next.readingDate) === 0 && isSameMonth(current.readingDate, next.readingDate);

        // calculate disconnection date by adding 3 working days from the due date
        let disconnectionDate = addWorkingDays(current.dueDate, 3);
        let disconnectionDateStr = format(disconnectionDate, "yyyy-MM-dd");

        // additional check to ensure the disconnection date itself is valid
        while (
          isHoliday(disconnectionDate) ||
          isNoDutyDay(disconnectionDate) ||
          isWeekend(disconnectionDate) ||
          isNoDueDay(disconnectionDate) ||
          usedDisconnectionDates.has(disconnectionDateStr)
        ) {
          disconnectionDate = addWorkingDays(disconnectionDate, 1);
          disconnectionDateStr = format(disconnectionDate, "yyyy-MM-dd");
        }

        // add to array of used disconnection dates
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
    [isHoliday, isNoDutyDay, isNoDueDay],
  ); //isNoDueDay

  // this function will build the whole schedule by month
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

      // helper function to add working days for disconnection dates
      const addWorkingDaysForDisconnection = (startDate: Date, daysToAdd: number): Date => {
        let result = new Date(startDate);
        let daysAdded = 0;

        while (daysAdded < daysToAdd) {
          result = addDays(result, 1);

          // check if the enxt day is a valid working day
          const isValidWorkingDay =
            !isHoliday(result) && !isNoDutyDay(result) && !isWeekend(result) && !isNoDueDay(result);

          if (isValidWorkingDay) daysAdded++;
        }

        return result;
      };

      // find the previous valid reading date
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
          // if the reading date is before the selected split date
          if (isBefore(split[j]!.readingDate, currentSelectedDate)) {
            result.push(split[j]!);
          }

          // if the date is the same day with the selected split date
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
                // sunday => copy last saturday's dates if available
                const lastSaturday = findPreviousValidReading(
                  result,
                  result.length,
                  (d) => getDay(d.readingDate) === 6,
                );

                if (lastSaturday) {
                  newDueDate = normalizeDate(lastSaturday.dueDate);
                  newDisconnectionDate = normalizeDate(lastSaturday.disconnectionDate);
                } else {
                  // fallback to previous reading
                  newDueDate = prevDue;
                  newDisconnectionDate = prevDisc;
                }
              } else {
                // weekdays => increment and adjust for the next business day
                if (prevDue && prevDisc) {
                  newDueDate = adjustToNextBusinessDay(addDays(prevDue, 1));

                  // calculate disconnection date by adding 3 working days from the new due date
                  // this matches the logic in calculate disconnection dates
                  newDisconnectionDate = addWorkingDaysForDisconnection(newDueDate, 3);

                  // additional check to ensure the disconnection date is valid and not a duplicate
                  // note: you might want to track used disconnection dates here too

                  while (
                    isHoliday(newDisconnectionDate) ||
                    isNoDutyDay(newDisconnectionDate) ||
                    isWeekend(newDisconnectionDate)
                  ) {
                    newDisconnectionDate = addWorkingDaysForDisconnection(newDisconnectionDate, 1);
                  }
                } else {
                  // fallback to original schedule
                  newDueDate = currDue ? adjustToNextBusinessDay(currDue) : undefined;
                  if (newDueDate) {
                    newDisconnectionDate = addWorkingDaysForDisconnection(newDueDate, 3);

                    while (
                      isHoliday(newDisconnectionDate) ||
                      isNoDutyDay(newDisconnectionDate) ||
                      isWeekend(newDisconnectionDate) ||
                      isNoDueDay(newDisconnectionDate)
                    ) {
                      newDisconnectionDate = addWorkingDaysForDisconnection(newDisconnectionDate, 1);
                    }
                  } else {
                    newDisconnectionDate = currDisc ? adjustToNextBusinessDay(currDisc) : undefined;
                  }
                }
              }

              const nextReadingDate: MeterReadingSchedule = {
                readingDate: curr.readingDate,
                dueDate: newDueDate,
                disconnectionDate: newDisconnectionDate,
              };

              result.push(nextReadingDate);

              // update prev so subsequent days shift correctly
              prev = nextReadingDate;
            }
          }
        }

        split = [...result];
      }

      return split;
    },
    [calculateSchedule, removeDuplicateDates, adjustToNextBusinessDay, isHoliday, isNoDutyDay],
  );

  // Modified function that takes restDay into account

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

  //     const getSecondIndexDate = (value: Date | Date[] | undefined): Date | undefined => {
  //       if (!value) return undefined;
  //       if (Array.isArray(value) && value.length > 1) {
  //         return value[1];
  //       }
  //       return undefined;
  //     };

  //     // helper function to add working days for disconnection dates
  //     const addWorkingDaysForDisconnection = (startDate: Date, daysToAdd: number): Date => {
  //       let result = new Date(startDate);
  //       let daysAdded = 0;

  //       while (daysAdded < daysToAdd) {
  //         result = addDays(result, 1);

  //         const isValidWorkingDay =
  //           !isHoliday(result) && !isNoDutyDay(result) && !isWeekend(result) && !isNoDueDay(result);

  //         if (isValidWorkingDay) daysAdded++;
  //       }

  //       return result;
  //     };

  //     // find the previous valid reading date
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
  //       const isSaturdaySplit = getDay(currentSelectedDate) === 6;

  //       // Store Saturday's array values for subsequent days
  //       let saturdayDueArray: Date[] | undefined;
  //       let saturdayDiscArray: Date[] | undefined;
  //       let hasAppliedToSplitDay = false;

  //       for (let j = startIndex; j < split.length; j++) {
  //         if (isBefore(split[j]!.readingDate, currentSelectedDate)) {
  //           result.push(split[j]!);
  //         }

  //         if (isSameDay(currentSelectedDate, split[j]?.readingDate as Date)) {
  //           const curr = split[j];
  //           let prev = findPreviousValidReading(split, j);

  //           // Calculate new due date for the split date
  //           let newDueDate: Date | undefined;
  //           let newDisconnectionDate: Date | undefined;

  //           const prevDue = normalizeDate(prev?.dueDate);
  //           const prevDisc = normalizeDate(prev?.disconnectionDate);
  //           const currDue = normalizeDate(curr?.dueDate);
  //           const currDisc = normalizeDate(curr?.disconnectionDate);

  //           if (prevDue && prevDisc) {
  //             newDueDate = adjustToNextBusinessDay(addDays(prevDue, 1));
  //             newDisconnectionDate = addWorkingDaysForDisconnection(newDueDate, 3);

  //             while (
  //               isHoliday(newDisconnectionDate) ||
  //               isNoDutyDay(newDisconnectionDate) ||
  //               isWeekend(newDisconnectionDate)
  //             ) {
  //               newDisconnectionDate = addWorkingDaysForDisconnection(newDisconnectionDate, 1);
  //             }
  //           } else {
  //             newDueDate = currDue ? adjustToNextBusinessDay(currDue) : undefined;
  //             if (newDueDate) {
  //               newDisconnectionDate = addWorkingDaysForDisconnection(newDueDate, 3);
  //               while (
  //                 isHoliday(newDisconnectionDate) ||
  //                 isNoDutyDay(newDisconnectionDate) ||
  //                 isWeekend(newDisconnectionDate) ||
  //                 isNoDueDay(newDisconnectionDate)
  //               ) {
  //                 newDisconnectionDate = addWorkingDaysForDisconnection(newDisconnectionDate, 1);
  //               }
  //             } else {
  //               newDisconnectionDate = currDisc ? adjustToNextBusinessDay(currDisc) : undefined;
  //             }
  //           }

  //           // Create arrays for Saturday (split date)
  //           const saturdayDueArrayValue: Date[] = [newDueDate, prev?.dueDate]
  //             .filter((d): d is Date => d instanceof Date)
  //             .slice(0, 2);
  //           const saturdayDiscArrayValue: Date[] = [newDisconnectionDate, prev?.disconnectionDate]
  //             .filter((d): d is Date => d instanceof Date)
  //             .slice(0, 2);

  //           if (isSaturdaySplit) {
  //             saturdayDueArray = saturdayDueArrayValue;
  //             saturdayDiscArray = saturdayDiscArrayValue;
  //           }

  //           const currentReading: MeterReadingSchedule = {
  //             readingDate: curr.readingDate,
  //             dueDate: saturdayDueArrayValue.length === 1 ? saturdayDueArrayValue[0] : saturdayDueArrayValue,
  //             disconnectionDate:
  //               saturdayDiscArrayValue.length === 1 ? saturdayDiscArrayValue[0] : saturdayDiscArrayValue,
  //           };

  //           result.push(currentReading);

  //           prev = {
  //             readingDate: curr.readingDate,
  //             dueDate: newDueDate,
  //             disconnectionDate: newDisconnectionDate,
  //           };

  //           startIndex = j + 1;

  //           // Process remaining days - shift everything from original schedule
  //           for (let k = startIndex; k < split.length; k++) {
  //             const curr = split[k];

  //             // Get the previous day's entry from the ORIGINAL schedule to shift forward
  //             const prevOriginalIndex = k - 1;
  //             const prevOriginal = prevOriginalIndex >= 0 ? split[prevOriginalIndex] : null;

  //             let newDueResult: Date | Date[] | undefined;
  //             let newDiscResult: Date | Date[] | undefined;
  //             let newDueDate: Date | undefined;
  //             let newDisconnectionDate: Date | undefined;

  //             const currentDayOfWeek = getDay(curr.readingDate);
  //             const isSunday = currentDayOfWeek === 0;
  //             const isMonday = currentDayOfWeek === 1;

  //             // For Sunday and Monday after Saturday split, maintain the same arrays
  //             if (
  //               isSaturdaySplit &&
  //               saturdayDueArray &&
  //               saturdayDiscArray &&
  //               (isSunday || (isMonday && !hasAppliedToSplitDay))
  //             ) {
  //               // Use the same arrays for both Saturday and subsequent days
  //               newDueResult = saturdayDueArray.length === 1 ? saturdayDueArray[0] : saturdayDueArray;
  //               newDiscResult = saturdayDiscArray.length === 1 ? saturdayDiscArray[0] : saturdayDiscArray;
  //               newDueDate = saturdayDueArray[0];
  //               newDisconnectionDate = saturdayDiscArray[0];

  //               if (isSunday) {
  //                 hasAppliedToSplitDay = true;
  //               }
  //             }
  //             // For all other days, shift from the original schedule's previous day
  //             else if (prevOriginal && prevOriginal.dueDate && prevOriginal.disconnectionDate) {
  //               // Get the second index from the previous day's original array
  //               const prevOriginalDueSecond = getSecondIndexDate(prevOriginal.dueDate);
  //               const prevOriginalDiscSecond = getSecondIndexDate(prevOriginal.disconnectionDate);

  //               if (prevOriginalDueSecond && prevOriginalDiscSecond) {
  //                 // Use the second index from previous day's original schedule
  //                 newDueDate = prevOriginalDueSecond;
  //                 newDisconnectionDate = prevOriginalDiscSecond;
  //                 newDueResult = newDueDate;
  //                 newDiscResult = newDisconnectionDate;
  //               } else {
  //                 // Fallback to first index if no second index
  //                 newDueDate = normalizeDate(prevOriginal.dueDate);
  //                 newDisconnectionDate = normalizeDate(prevOriginal.disconnectionDate);
  //                 newDueResult = newDueDate;
  //                 newDiscResult = newDisconnectionDate;
  //               }
  //             } else {
  //               // Fallback: calculate from previous
  //               const prevDue = normalizeDate(prev?.dueDate);
  //               const prevDisc = normalizeDate(prev?.disconnectionDate);

  //               if (prevDue && prevDisc) {
  //                 newDueDate = adjustToNextBusinessDay(addDays(prevDue, 1));
  //                 newDisconnectionDate = addWorkingDaysForDisconnection(newDueDate, 3);
  //                 newDueResult = newDueDate;
  //                 newDiscResult = newDisconnectionDate;
  //               } else {
  //                 newDueResult = undefined;
  //                 newDiscResult = undefined;
  //               }
  //             }

  //             const nextReadingDate: MeterReadingSchedule = {
  //               readingDate: curr.readingDate,
  //               dueDate: newDueResult,
  //               disconnectionDate: newDiscResult,
  //             };

  //             result.push(nextReadingDate);
  //             prev = nextReadingDate;
  //           }
  //         }
  //       }

  //       split = [...result];
  //     }

  //     return split;
  //   },
  //   [calculateSchedule, removeDuplicateDates, adjustToNextBusinessDay, isHoliday, isNoDutyDay, isNoDueDay],
  // );

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
        dayCounter = dayCounter < MAXIMUM_READING_DAYS_COUNT ? dayCounter + 1 : 1;
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
            dayCounter = dayCounter < MAXIMUM_READING_DAYS_COUNT ? dayCounter + 1 : 1;
            continue;
          }
        }

        // No consecutive Monday, just process Sunday
        i += 1;
        isFirstDayOfMonth = false;
        dayCounter = dayCounter < MAXIMUM_READING_DAYS_COUNT ? dayCounter + 1 : 1;
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
      dayCounter = dayCounter < MAXIMUM_READING_DAYS_COUNT ? dayCounter + 1 : 1;
    }

    return dayMap;
  };

  // assign default meter readers
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

  // assign meter readers with their respective days
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
                if (zoneBookDay > MAXIMUM_READING_DAYS_COUNT) {
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

  // this function will get the working days
  const getWorkingDays = useCallback((): MeterReadingDate[] => {
    const schedule = calculateSchedule();
    return schedule.map((day) => ({ readingDate: day.readingDate }));
  }, [calculateSchedule]);

  // helper to log the day assignments
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
