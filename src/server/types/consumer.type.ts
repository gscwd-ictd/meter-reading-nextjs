import { z } from "zod";
import { ZoneBookSchema } from "./zone-book.type";
import { BillingAdjustmentSchema } from "./billing-adjustment.type";

export const ConsumerSchema = z.object({
  accountNumber: z.string(),
  checkDigit: z.string(),
  consumerName: z.string(),
  isSenior: z.coerce.boolean(),
  contactNumber: z.coerce.string(),
  address: z.coerce.string(),
  classification: z.string(),
  consumerType: z.coerce.string(),
  zone: z.coerce.string(),
  book: z.coerce.string(),
  sequenceNumber: z.string(),
  meterNumber: z.string(),
  meterCode: z.string(),
  meterSize: z.string(),
  isConnected: z.coerce.boolean(),
  dateConnected: z.coerce.date(),
  disconnectionDate: z.coerce.date(),
  averageUsage: z.coerce.number(),
  waterBalance: z.coerce.number(),
  otherBalance: z.coerce.number(),
  previousReading: z.coerce.number(),
  previousBillingDate: z.coerce.date(),
  location: z.coerce.string(),
  billingAdjustments: BillingAdjustmentSchema.pick({
    name: true,
    percentage: true,
  }).array(),
});

export const ConsumerUsageSchema = z.object({
  accountNumber: z.string(),
  firstMonth: z.coerce.number(),
  secondMonth: z.coerce.number(),
  thirdMonth: z.coerce.number(),
  fourthMonth: z.coerce.number(),
});

export const ConsumerHistorySchema = z.object({
  accountNumber: z.string(),
  firstService: z.coerce.string(),
  secondService: z.coerce.string(),
  thirdService: z.coerce.string(),
});

export const ConsumerDetailsSchema = ConsumerSchema.extend({
  usage: ConsumerUsageSchema.omit({
    accountNumber: true,
  }),
  history: ConsumerHistorySchema.omit({
    accountNumber: true,
  }),
});

export const ScheduleMeterReadingSchema = z.object({
  zoneBooks: ZoneBookSchema.omit({
    zoneBook: true,
  }).extend({
    dueDate: z.coerce.date(),
    disconnectionDate: z.coerce.date(),
    accounts: ConsumerDetailsSchema.array(),
  }),
});

export const ScheduleReadingAccountSchema = z
  .object({
    meterReaderId: z.string(),
    readingDate: z.coerce.date(),
    zoneBooks: z
      .object({
        zone: z.string(),
        book: z.string(),
        area: z.object({
          id: z.string(),
          name: z.string(),
        }),
        dueDate: z.coerce.date(),
        disconnectionDate: z.coerce.date(),
        accounts: ConsumerDetailsSchema.array(),
      })
      .array(),
  })
  .nullish();

export type Consumer = z.infer<typeof ConsumerSchema>;
export type ScheduleReadingAccount = z.infer<typeof ScheduleReadingAccountSchema>;
export type ScheduleMeterReading = z.infer<typeof ScheduleMeterReadingSchema>;
