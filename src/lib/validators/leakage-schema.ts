import z4 from "zod/v4";

export const CreateLeakageSchema = z4.object({
  id: z4.uuid(),
  nearestMeterNumber: z4.string().nullish(),
  remarks: z4.string().nullish(),
  additionalRemarks: z4.string().nullish(),
  dateTime: z4.date(),
});

export const UpdateLeakageSchema = CreateLeakageSchema.partial().omit({
  id: true,
});

export type Leakage = z4.infer<typeof CreateLeakageSchema>;
