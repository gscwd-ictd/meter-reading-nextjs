import z4 from "zod/v4";

export const CreateAccountHistorySchema = z4.object({
  id: z4.uuid(),
  accountNumber: z4.string(),
  dateTime: z4.date(),
  remarks: z4.string(),
  createdAt: z4.date(),
});

export const CreateUsageSchema = z4.object({
  id: z4.uuid(),
  accountNumber: z4.string(),
  month1Usage: z4.coerce.number(),
  month2Usage: z4.coerce.number(),
  month3Usage: z4.coerce.number(),
  month4Usage: z4.coerce.number(),
  createdAt: z4.date(),
});

export const UpdateAccountHistorySchema = CreateAccountHistorySchema.partial().omit({
  id: true,
});

export const UpdateUsageSchema = CreateUsageSchema.partial().omit({
  id: true,
});

export type AccountHistory = z4.infer<typeof CreateAccountHistorySchema>;
