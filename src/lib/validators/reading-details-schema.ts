import z4 from "zod/v4";

export const CreateReadingDetailsSchema = z4.object({
  id: z4.uuid(),
  meterReaderId: z4.string(),
  accountNumber: z4.string(),
  accountName: z4.string(),
  meterNumber: z4.string(),
  checkDigit: z4.number(),
  meterCode: z4.number(),
  consumerType: z4.string(),
  previousReading: z4.number(),
  longlat: z4.string().nullish(),
  zoneCode: z4.string(),
  bookCode: z4.string(),
  averageUsage: z4.number().nullish(),
  otherBalance: z4.number().nullish(),

  isRead: z4.boolean(),
  sequenceNumber: z4.string(),
  address: z4.string(),
  disconnectionType: z4.string(),

  dateInstalled: z4.coerce.date().nullish(),
  readingDate: z4.coerce.date().nullish(),
  dueDate: z4.coerce.date().nullish(),
  disconnectionDate: z4.coerce.date().nullish(),
  reconnectionDate: z4.coerce.date().nullish(),

  contactNumber: z4.string().nullish(),
  classification: z4.string(),
  arrears: z4.number(),
  currentReading: z4.number().nullish(),
  currentUsage: z4.number().nullish(),
  billedAmount: z4.number().nullish(),
  remarks: z4.string().nullish(),
  additionalRemarks: z4.string().nullish(),
  image: z4.string().nullish(),
  printCount: z4.number().nullish(),

  isSenior: z4.boolean(),
  isConnected: z4.boolean(),
  meterSize: z4.string(),

  penaltyAmount: z4.number().nullish(),
  seniorDiscount: z4.number().nullish(),
  changeMeterAmount: z4.number().nullish(),
  timeStart: z4.coerce.date().nullish(),
  timeEnd: z4.coerce.date().nullish(),
  previousBillDate: z4.coerce.date().nullish(),
  createdAt: z4.coerce.date().nullish(),
  isPosted: z4.boolean().nullish(),
  isCompleted: z4.boolean().nullish(),
  isCommitted: z4.boolean().nullish(),
  datetimeCompleted: z4.coerce.date().nullish(),
  datetimeCommitted: z4.coerce.date().nullish(),
  datetimePosted: z4.coerce.date().nullish(),
});

export const UpdateReadingAccountsCompletedSchema = z4.object({
  meterReaderId: z4.uuid(),
  zoneBooks: z4
    .object({
      zone: z4.string(),
      book: z4.string(),
    })
    .array(),
  readingMonth: z4.string(),
});

export const UpdateReadingDetailsSchema = CreateReadingDetailsSchema.partial()
  .omit({
    id: true,
  })
  .extend({
    meterReader: z4.string().nullish(),
  });

export type ReadingDetails = z4.infer<typeof CreateReadingDetailsSchema>;

export type UpdateReadingAccountsCompleted = z4.infer<typeof UpdateReadingAccountsCompletedSchema>;

// const test: ReadingDetails = {
//   longlat,
// };
