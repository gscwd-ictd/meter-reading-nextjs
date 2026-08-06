import { useState, useEffect } from "react";

type DateInput = string | Date | number;

/**
 * Custom hook that checks if a given date is before today
 * @param date - The date to check (can be string, Date object, or timestamp)
 * @returns boolean - true if the date is before today, false otherwise
 */
export function useIsBeforeToday(date: DateInput): boolean {
  const [isBefore, setIsBefore] = useState<boolean>(false);

  useEffect(() => {
    // Parse the input date
    const parsedDate = new Date(date);
    const today = new Date();

    // Reset time to midnight for accurate day comparison
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dateMidnight = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());

    // Check if the date is before today (strictly before, not including today)
    setIsBefore(dateMidnight < todayMidnight);
  }, [date]);

  return isBefore;
}
