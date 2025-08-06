import z4 from "zod/v4";

export const CreateAccountHistorySchema = z4.object({
  id: z4.uuid(),
  accountNumber: z4.string(),
  meterReaderId: z4.uuid(),
  firstService: z4.string().optional(),
  secondService: z4.string().optional(),
  thirdService: z4.string().optional(),
  dateTime: z4.coerce.string(),
  //createdAt: z4.date(),
});

export const UpdateAccountHistorySchema = CreateAccountHistorySchema.partial().omit({
  id: true,
});

export type AccountHistory = z4.infer<typeof CreateAccountHistorySchema>;
