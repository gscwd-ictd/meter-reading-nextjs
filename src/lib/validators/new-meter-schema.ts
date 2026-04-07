import z4 from "zod/v4";

export const CreateNewMeterSchema = z4.object({
  id: z4.uuid(),
  currentReading: z4.number().nullish(),
  meterNumber: z4.string(),
  image: z4.string().nullish(),
  dateTime: z4.coerce.date(),
  meterReaderId: z4.uuid(),
  isCommitted: z4.boolean(),
  meterReader: z4
    .object({
      id: z4.uuid(),
      name: z4.coerce.string(),
    })
    .optional(),
});

export const UpdateNewMeterSchema = CreateNewMeterSchema.partial().omit({
  id: true,
});

export type NewMeter = z4.infer<typeof CreateNewMeterSchema>;
