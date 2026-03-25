import z4, { z } from "zod/v4";

export const BilledSummarySchema = z.object({
  accountNumber: z.coerce.string(),
  checkDigit: z.coerce.string(),
  zone: z.string(),
  book: z.string(),
  currentReading: z.coerce.number(),
  usage: z.coerce.number(),
  billedAmount: z.coerce.number(),
  meterReader: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const UnbilledSummarySchema = BilledSummarySchema.omit({
  currentReading: true,
  usage: true,
  billedAmount: true,
}).extend({
  accountName: z4.string(),
});

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

export const NewMeterSummarySchema = z.object({
  currentReading: z4.number().nullish(),
  meterNumber: z4.string(),
  meterReader: z4.object({
    id: z4.string(),
    name: z.string(),
  }),
});

const MeterSizes = ["3/8", "1/2", "3/4", "1", "1 1/2", "2", "2 1/2", "3", "4"] as const;

export const BillAmountSchema = z.array(
  z.object({
    name: z.string(),
    sizes: z.array(
      z.object({
        column: z.enum(MeterSizes),
        amount: z.coerce.number(),
      }),
    ),
    total: z.coerce.number(),
  }),
);

export const NoOfBillsSchema = z.array(
  z.object({
    name: z.string(),
    sizes: z.array(
      z.object({
        column: z.enum(MeterSizes),
        count: z.coerce.number(),
      }),
    ),
    total: z.coerce.number(),
  }),
);

export const ConsumptionSchema = z.array(
  z.object({
    name: z.string(),
    sizes: z.array(
      z.object({
        column: z.enum(MeterSizes),
        consumption: z.coerce.number(),
      }),
    ),
    total: z.coerce.number(),
  }),
);

export const ReportSchema = z.object({
  billAmount: BillAmountSchema,
  noOfBills: NoOfBillsSchema,
  consumption: ConsumptionSchema,
});

export const ZoneBookSummaryRowSchema = z.object({
  zone: z.string(),
  book: z.string(),
  count: z.coerce.number(),
  totalConsumption: z.coerce.number(),
  totalBilledAmount: z.coerce.number(),
  totalSeniorDiscount: z.coerce.number(),
});

export type BilledSummary = z.infer<typeof BilledSummarySchema>;
export type UnbilledSummary = z.infer<typeof UnbilledSummarySchema>;
export type WithRemarksSummary = z.infer<typeof WithRemarksSummarySchema>;
export type NewMeterSummary = z.infer<typeof NewMeterSummarySchema>;
export type MobileSummaryReport = z.infer<typeof MobileSummaryReportSchema>;

export type BillAmount = z.infer<typeof BillAmountSchema>;
export type NoOfBills = z.infer<typeof NoOfBillsSchema>;
export type Consumption = z.infer<typeof ConsumptionSchema>;
export type Report = z.infer<typeof ReportSchema>;

export type ZoneBookSummaryRow = z.infer<typeof ZoneBookSummaryRowSchema>;
