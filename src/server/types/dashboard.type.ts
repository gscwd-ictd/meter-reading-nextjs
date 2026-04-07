import z from "zod";

export const ConsumerCountSchema = z.object({
  total: z.coerce.number(),
  active: z.coerce.number(),
  disconnected: z.coerce.number(),
  writeOff: z.coerce.number(),
});

export const MonthlyReadingCountsSchema = z.object({
  billed: z.coerce.number(),
  unbilled: z.coerce.number(),
  remarks: z.coerce.number(),
  newMeters: z.coerce.number(),
});

export const CountReadingsByReaderZoneBookSchema = z.object({
  count: z.coerce.number(),
});

export type ConsumerCount = z.infer<typeof ConsumerCountSchema>;
export type MonthlyReadingCounts = z.infer<typeof MonthlyReadingCountsSchema>;
export type CountReadingsByReaderZoneBook = z.infer<typeof CountReadingsByReaderZoneBookSchema>;
