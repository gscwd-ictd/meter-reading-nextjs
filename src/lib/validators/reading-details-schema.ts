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
  longlat: z4.string().optional(),
  zoneCode: z4.string(),
  bookCode: z4.string(),
  // meterStatus: z4.string(),
  isRead: z4.boolean(),
  sequenceNumber: z4.string(),
  address: z4.string(),
  dateInstalled: z4.date(),
  disconnectionType: z4.string(),
  readingDate: z4.date().optional(),
  dueDate: z4.date(),
  disconnectionDate: z4.date(),
  reconnectionDate: z4.date(),
  contactNumber: z4.string(),
  classification: z4.string(),
  arrears: z4.number(),
  currentReading: z4.number().nullable(),
  billedAmount: z4.number().nullable(),
  remarks: z4.string().nullable(),
  additionalRemarks: z4.string().nullable(),
  image: z4.string().nullable(),
  printCount: z4.number().nullable(),
});

export const UpdateReadingDetailsSchema = CreateReadingDetailsSchema.partial().omit({
  id: true,
});

export type ReadingDetails = z4.infer<typeof CreateReadingDetailsSchema>;
