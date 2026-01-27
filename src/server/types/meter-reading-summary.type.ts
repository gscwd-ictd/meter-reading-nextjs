import { z } from "zod/v4";

export const BilledSummarySchema = z.object({
  accountNumber: z.coerce.string(),
  checkDigit: z.coerce.string(),
  zone: z.string(),
  book: z.string(),
  currentReading: z.coerce.number(),
  usage: z.coerce.number(),
  amount: z.coerce.number(),
  meterReader: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const UnbilledSummarySchema = BilledSummarySchema;

export const WithRemarksSummarySchema = z.object({
  accountNumber: z.coerce.string(),
  checkDigit: z.coerce.string(),
  zone: z.string(),
  book: z.string(),
  remarks: z.coerce.string(),
  meterReader: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const SummaryReportQuerySchema = z.object({
  meterReaderId: z.string(),
  readingDate: z.string(),
});

export const SummaryReportSchema = z.object({
  meterReader: z.object({
    id: z.string(),
    name: z.string(),
  }),
  billed: BilledSummarySchema.omit({
    meterReader: true,
  }),
  unbilled: UnbilledSummarySchema.omit({
    meterReader: true,
  }),
});

export const MobileSummaryReportSchema = z.object({
  billed: z.object({
    accounts: z
      .object({
        accountNumber: z.string(),
        previousReading: z.coerce.number(),
        usage: z.coerce.number(),
        billedAmount: z.coerce.number(),
      })
      .array(),
    totalAccounts: z.coerce.number(),
    totalBilledAmount: z.coerce.number(),
    totalUsage: z.coerce.number(),
  }),
  unbilled: z.object({
    accounts: z
      .object({
        accountNumber: z.string(),
        accountName: z.coerce.string(),
      })
      .array(),
    totalAccounts: z.coerce.number(),
  }),
  withRemarks: z.object({
    accounts: z
      .object({
        accountNumber: z.string(),
        remarks: z.coerce.string(),
      })
      .array(),
    totalAccounts: z.coerce.number(),
  }),
});

export type BilledSummary = z.infer<typeof BilledSummarySchema>;
export type UnbilledSummary = z.infer<typeof UnbilledSummarySchema>;
export type WithRemarksSummary = z.infer<typeof WithRemarksSummarySchema>;
export type MobileSummaryReport = z.infer<typeof MobileSummaryReportSchema>;
