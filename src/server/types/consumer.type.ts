import { z } from "zod";
import { ZoneBookSchema } from "./zone-book.type";

export const ConsumerSchema = z.object({
  accountNumber: z.string(),
  checkDigit: z.string(),
  consumerName: z.string(),
  isSenior: z.coerce.boolean(),
  contactNumber: z.string(),
  address: z.string(),
  classification: z.string(),
  consumerType: z.coerce.number(),
  zone: z.string(),
  book: z.string(),
  sequenceNumber: z.string(),
  meterNumber: z.string(),
  meterCode: z.number(),
  meterSize: z.string(),
  isConnected: z.coerce.boolean(),
  dateConnected: z.coerce.date(),
  disconnectionDate: z.coerce.date(),
  averageUsage: z.coerce.number(),
  waterBalance: z.coerce.number(),
  otherBalance: z.coerce.number(),
  previousReading: z.coerce.number(),
});

export const ConsumerUsageSchema = z.object({
  accountNumber: z.string(),
  firstMonth: z.coerce.string(),
  secondMonth: z.coerce.number(),
  thirdMonth: z.coerce.number(),
  fourthMonth: z.coerce.number(),
});

export const ConsumerHistorySchema = z.object({
  accountNumber: z.string(),
  firstService: z.string(),
  secondService: z.string(),
  thirdService: z.string(),
});

export const ConsumerDetailsSchema = ConsumerSchema.extend({
  usage: ConsumerSchema.omit({
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

export type Consumer = z.infer<typeof ConsumerSchema>;
export type ScheduleMeterReading = z.infer<typeof ScheduleMeterReadingSchema>;
