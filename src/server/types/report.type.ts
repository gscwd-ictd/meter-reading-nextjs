import { z } from "zod/v4";

export const ReadingZoneBookProgressSchema = z.object({
  zone: z.string(),
  book: z.string(),
  meterReader: z.object({
    id: z.string(),
    name: z.string(),
  }),
  totalRead: z.coerce.number(),
  totalAccounts: z.coerce.number(),
  statusProgress: z.coerce.string(),
  isCommitted: z.coerce.boolean(),
});

export const ReadingAccountProgressSchema = z.object({
  readingDate: z.coerce.string().nullish(),
  accountNumber: z.coerce.string(),
  checkDigit: z.coerce.string(),
  accountName: z.coerce.string(),
  zone: z.coerce.string(),
  book: z.coerce.string(),
  currentReading: z.coerce.number(),
  previousReading: z.coerce.number(),
  averageUsage: z.coerce.number(),
  billedAmount: z.coerce.number(),
  isRead: z.coerce.boolean(),
  isPosted: z.coerce.boolean(),
  isCompleted: z.coerce.boolean(),
  isCommitted: z.coerce.boolean(),
  remarks: z.coerce.string(),
  additionalRemarks: z.coerce.string(),
  meterReader: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const ReadingAccountQuerySchema = z.object({
  meterReaderId: z.string(),
  zone: z.coerce.string(),
  book: z.coerce.string(),
  readingMonth: z.coerce.string(),
  /* 
{
    meterReaderId:
    zone
    book
    readingMonth: 2025-12
}


*/
});

export type ReadingZoneBookProgress = z.infer<typeof ReadingZoneBookProgressSchema>;
export type ReadingAccountProgress = z.infer<typeof ReadingAccountProgressSchema>;
export type ReadingAccountQuery = z.infer<typeof ReadingAccountQuerySchema>;
export type UpdateReadingProgress = z.infer<typeof ReadingAccountQuerySchema>;
