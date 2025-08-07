import z4 from "zod/v4";

export const CreateNewMeterSchema = z4.object({
  id: z4.uuid(),
  currentReading: z4.number().nullish(),
  meterNumber: z4.string(),
  image: z4.string().nullish(),
  dateTime: z4.date(),
});

export const UpdateNewMeterSchema = CreateNewMeterSchema.partial().omit({
  id: true,
});

export type NewMeter = z4.infer<typeof CreateNewMeterSchema>;
