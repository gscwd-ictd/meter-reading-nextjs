import z4 from "zod/v4";

export const CreateRateSchema = z4.object({
  id: z4.uuid(),
  meterCode: z4.number(),
  consumerType: z4.string(),
  description: z4.string().nullish(),
  minimumRate: z4.number(),
  rate11: z4.number(),
  rate21: z4.number(),
  rate31: z4.number(),
  rate41: z4.number(),
  rate51: z4.number(),
});

export const UpdateRateSchema = CreateRateSchema.partial().omit({
  id: true,
});

export type Rate = z4.infer<typeof CreateRateSchema>;
