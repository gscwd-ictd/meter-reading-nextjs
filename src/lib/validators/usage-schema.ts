import z4 from "zod/v4";

export const CreateUsageSchema = z4.object({
  id: z4.uuid(),
  meterReaderId: z4.uuid(),
  accountNumber: z4.string(),
  month1Usage: z4.number(),
  month2Usage: z4.number(),
  month3Usage: z4.number(),
  month4Usage: z4.number(),
  createdAt: z4.coerce.date(),
});

export const UpdateUsageSchema = CreateUsageSchema.partial().omit({
  id: true,
  createdAt: true,
});

export type Usage = z4.infer<typeof CreateUsageSchema>;
