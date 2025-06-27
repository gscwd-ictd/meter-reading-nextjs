import { parse, format, isValid, parseISO } from "date-fns";

/**
 * Safely parses a YYYY-MM-DD string to a Date object (midnight local time).
 */
export const toDateOnly = (str: string): Date => {
  return parse(str, "yyyy-MM-dd", new Date());
};

/**
 * Formats a Date object into a YYYY-MM-DD string (no time).
 */
export const toDateString = (date: Date, dateFormat?: "yyyy-MM-dd"): string => {
  if (dateFormat === "yyyy-MM-dd") return format(date, "yyyy-MM-dd");
  else return format(date, "yyyy-MM-dd");
};

/**
 * Formats a Date object into a YYYY-MM-DD string (no time).
 */
export function toParsedDateOnly(value: string | Date): Date {
  let year: number, month: number, day: number;

  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) throw new Error("Invalid date string format");

    year = parseInt(match[1], 10);
    month = parseInt(match[2], 10) - 1; // JS months are 0-based
    day = parseInt(match[3], 10);
  } else if (value instanceof Date && !isNaN(value.getTime())) {
    year = value.getUTCFullYear();
    month = value.getUTCMonth();
    day = value.getUTCDate();
  } else {
    throw new Error("Invalid date value");
  }

  // Always returns a date at UTC midnight
  return new Date(Date.UTC(year, month, day));
}

export const isValidYyyyMmDdOrDate = (value: string | Date): boolean => {
  if (typeof value === "string") {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const [year, month, day] = value.split("-").map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day));

    return (
      utcDate.getUTCFullYear() === year && utcDate.getUTCMonth() === month - 1 && utcDate.getUTCDate() === day
    );
  }

  if (value instanceof Date) {
    return !isNaN(value.getTime());
  }

  return false;
};

export const formatIfInvalid = (value: string | Date): string => {
  if (isValidYyyyMmDdOrDate(value)) {
    return value as string; // or you can return the original value
  }

  try {
    let date: Date;

    if (typeof value === "string") {
      const parsed = new Date(value); // fallback parser
      if (isNaN(parsed.getTime())) return "Invalid date";
      date = parsed;
    } else if (value instanceof Date) {
      date = value;
    } else {
      return "Invalid date";
    }

    return format(date, "yyyy-MM-dd");
  } catch {
    return "Invalid date";
  }
};

export const getDayFromDate = (value: string | Date): number | null => {
  let date: Date;

  if (isValidYyyyMmDdOrDate(value)) {
    if (typeof value === "string") {
      const [month, day, year] = value.split("-").map(Number);
      date = new Date(Date.UTC(year, month - 1, day));
    } else {
      date = value;
    }
  } else {
    // Try to parse fallback string (e.g., ISO or MMM dd, yyyy)
    try {
      date = new Date(value);
      if (isNaN(date.getTime())) return null;
    } catch {
      return null;
    }
  }

  return parseInt(format(date, "d"), 10); // returns day of month (1–31)
};

/**
 * This formats a Date or Date Array and returns a string or string array instead
 */
export const toDatesOrDateOnly = (value: Date | Date[] | undefined): string | string[] | undefined => {
  if (!value) return undefined;

  if (Array.isArray(value)) {
    return value
      .filter(isValid)
      .map((date) => format(date, "yyyy-MM-dd"))
      .slice(0, 2); // Limit to 2 elements
  }

  return isValid(value) ? format(value, "yyyy-MM-dd") : undefined;
};

/**
 * This formats a string or string Array and returns a Date or Date array instead
 */
export const toDateOrDates = (value: string | string[] | undefined): Date | Date[] | undefined => {
  if (!value) return undefined;

  if (Array.isArray(value)) {
    const parsed = value
      .map((str) => parseISO(str))
      .filter((date) => isValid(date))
      .slice(0, 2); // Optional: limit to 2 valid Dates
    return parsed.length > 0 ? parsed : undefined;
  }

  const parsedDate = parseISO(value);
  return isValid(parsedDate) ? parsedDate : undefined;
};

/**
 * Parses a string or array of strings to Date or Date[].
 * All returned Dates are normalized to yyyy-MM-dd (date-only).
 */

export const parseToDateOnly = (value: string | string[] | undefined): Date | Date[] | undefined => {
  if (!value) return undefined;

  if (Array.isArray(value)) {
    const parsedDates = value
      .map((str) => parseISO(str))
      .filter(isValid)
      .map((date) => new Date(format(date, "yyyy-MM-dd"))); // strip time
    return parsedDates.length > 0 ? parsedDates.slice(0, 2) : undefined;
  }

  const parsed = parseISO(value);
  return isValid(parsed) ? new Date(format(parsed, "yyyy-MM-dd")) : undefined;
};

/**
 * Accepts a Date or Date[] and returns the value(s) with time stripped (date-only).
 */
export const toDatesOnly = (value: Date | Date[] | undefined): Date | Date[] | undefined => {
  if (!value) return undefined;

  const normalize = (date: Date): Date => {
    return isValid(date) ? new Date(format(date, "yyyy-MM-dd")) : undefined!;
  };

  if (Array.isArray(value)) {
    const parsed = value.filter(isValid).map(normalize);
    return parsed.length > 0 ? parsed.slice(0, 2) : undefined;
  }

  return isValid(value) ? normalize(value) : undefined;
};
