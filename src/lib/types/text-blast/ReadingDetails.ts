import z from "zod"

const accountsSchema = z.object({
  zone: z.string(),
  book: z.string(),
  usage: z.object({
    firstMonth: z.number().nullable(),
    secondMonth: z.number().nullable(),
    thirdMonth: z.number().nullable(),
    fourthMonth: z.number().nullable(),
  }),
  address: z.string(),
  history: z.object({
    firstService: z.string().nullable(),
    secondService: z.string().nullable(),
    thirdService: z.string().nullable(),
  }),
  isSenior: z.string(),
  meterCode: z.string(),
  meterSize: z.string(),
  checkDigit: z.string(),
  isConnected: z.boolean(),
  meterNumber: z.string(),
  averageUsage: z.number().nullable(),
  consumerName: z.string(),
  consumerType: z.string(),
  otherBalance: z.number(),
  waterBalance: z.number(),
  accountNumber: z.string(),
  contactNumber: z.string().nullable(),
  dateConnected: z.string().nullable(),
  classification: z.string(),
  sequenceNumber: z.string(),
  previousReading: z.number(),
  disconnectionDate: z.string().nullable(),
});

const zoneBooksSchema = z.object({
  book: z.string(),
  zone: z.string(),
  dueDate: z.string(),
  disconnectionDate: z.string(),
  accounts: z.array(accountsSchema),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const readingDetailsSchema = z.object({
  meterReaderId: z.string(),
  readingDate: z.string(),
  zoneBooks: z.array(zoneBooksSchema),
});

export type ReadingDetails = z.infer<typeof readingDetailsSchema>
export type Zonebook = z.infer<typeof zoneBooksSchema>;
export type Account = z.infer<typeof accountsSchema>; 

export type AccountWithDates = Account & {
  dueDate: string | number | Date;
  disconnectionDate: string | number | Date;
  readingDate: string;
};
