import { format, parse } from "date-fns";

// This formats Year-Month 20XX-XX to Readable format

export const formatYearMonthToReadableDate = (yearMonth: string) => {
  const newDate = parse(yearMonth, "yyyy-MM", new Date());
  return format(newDate, "MMMM yyyy");
};
