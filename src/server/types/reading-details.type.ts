import z4 from "zod/v4";

export const AccountReadingDetailsSchema = z4.object({
  accountNumber: z4.coerce.string(),
  readingDate: z4.coerce.date().nullish(),
  dueDate: z4.coerce.date().nullish(),
  disconnectionDate: z4.coerce.date().nullish(),
  currentReading: z4.coerce.number().nullish(),
  previousReading: z4.coerce.number().nullish(),
  billedAmount: z4.coerce.number().nullish(),
  penaltyAmount: z4.coerce.number().nullish(),
  seniorDiscount: z4.coerce.number().nullish(),
  changeMeterAmount: z4.coerce.number().nullish(),
  arrears: z4.coerce.number().nullish(),
  remarks: z4.coerce.string().nullish(),
  timeStart: z4.coerce.date().nullish(),
  timeEnd: z4.coerce.date().nullish(),
});

export type AccountReadingDetails = z4.infer<typeof AccountReadingDetailsSchema>;
