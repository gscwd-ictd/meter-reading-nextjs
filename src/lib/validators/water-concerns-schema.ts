import z4 from "zod/v4";

export const CreateWaterConcernSchema = z4.object({
  id: z4.uuid(),
  nearestWaterMeter: z4.string().nullable(),
  remarks: z4.string().nullable(),
  additionalRemarks: z4.string().nullable(),
  image: z4.string().nullable(),
  dateTime: z4.date(),
});

export const UpdateWaterConcernSchema = CreateWaterConcernSchema.partial().omit({
  id: true,
});

export type WaterConcern = z4.infer<typeof CreateWaterConcernSchema>;
