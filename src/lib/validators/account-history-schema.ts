import z4 from "zod/v4";

export const CreateAccountHistorySchema = z4.object({
  id: z4.uuid(),
  accountNumber: z4.string(),
  meterReaderId: z4.uuid(),
  zoneCode: z4.string(),
  bookCode: z4.string(),
  firstService: z4.string().nullish(),
  secondService: z4.string().nullish(),
  thirdService: z4.string().nullish(),
  dateTime: z4.coerce.date(),
  isCommitted: z4.coerce.boolean().nullish(),
  createdAt: z4.string(),
});

export const UpdateAccountHistorySchema = CreateAccountHistorySchema.partial().omit({
  id: true,
});

export type AccountHistory = z4.infer<typeof CreateAccountHistorySchema>;
