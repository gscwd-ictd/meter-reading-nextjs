import { format, parse, isValid } from "date-fns";

export function normalizeToYyyyMmDd(dateStr: string): string | undefined {
  // Case 1: Already in yyyy-MM-dd
  const isoPattern = /^\d{4}-\d{2}-\d{2}$/;
  if (isoPattern.test(dateStr)) {
    const parsed = parse(dateStr, "yyyy-MM-dd", new Date());
    return isValid(parsed) ? format(parsed, "yyyy-MM-dd") : undefined;
  }

  // Case 2: Try parsing as "MMMM dd, yyyy"
  const parsedAlt = parse(dateStr, "MMMM dd, yyyy", new Date());
  if (isValid(parsedAlt)) {
    return format(parsedAlt, "yyyy-MM-dd");
  }

  // Case 3: Invalid format
  return undefined;
}
