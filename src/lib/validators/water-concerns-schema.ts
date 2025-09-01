import z4 from "zod/v4";

export const CreateWaterConcernSchema = z4.object({
  id: z4.uuid(),
  nearestWaterMeter: z4.string().nullish(),
  remarks: z4.string().nullish(),
  additionalRemarks: z4.string().nullish(),
  image: z4.string().nullish(),
  dateTime: z4.date(),
});

export const UpdateWaterConcernSchema = CreateWaterConcernSchema.partial().omit({
  id: true,
});

export type WaterConcern = z4.infer<typeof CreateWaterConcernSchema>;
