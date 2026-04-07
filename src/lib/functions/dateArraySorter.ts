import { format, isDate } from "date-fns";

/**
 * Formats and sorts dates into an array of yyyy-MM-dd strings
 * @param dates - Single Date, array of Dates, or undefined
 * @returns Array of formatted date strings sorted from earliest to latest
 */
const formatAndSortDates = (dates: Date | Date[] | undefined): string[] => {
  // Handle undefined case
  if (!dates) {
    return [];
  }

  // Handle single Date case
  if (isDate(dates)) {
    return [format(dates, "yyyy-MM-dd")];
  }

  // Handle array case - filter out invalid dates and sort
  const validDates = dates.filter((date) => isDate(date) && !isNaN(date.getTime()));

  // Sort dates from earliest to latest
  const sortedDates = validDates.sort((a, b) => a.getTime() - b.getTime());

  // Format dates to yyyy-MM-dd
  return sortedDates.map((date) => format(date, "yyyy-MM-dd"));
};

export default formatAndSortDates;
