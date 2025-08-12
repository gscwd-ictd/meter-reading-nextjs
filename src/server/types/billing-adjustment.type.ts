import z from "zod";

export const BillingAdjustmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  percentage: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
});

export const CreateBillingAdjustmentSchema = BillingAdjustmentSchema.pick({
  name: true,
  percentage: true,
});

export const UpdateBillingAdjustmentSchema = BillingAdjustmentSchema.partial();

export type BillingAdjustment = z.infer<typeof BillingAdjustmentSchema>;
export type CreateBillingAdjustment = z.infer<typeof CreateBillingAdjustmentSchema>;
export type UpdateBillingAdjustment = z.infer<typeof UpdateBillingAdjustmentSchema>;
