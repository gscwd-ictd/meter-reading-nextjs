import z4 from "zod/v4";

export const NewMeterSchema = z4.object({
  id: z4.uuid(),
  currentReading: z4.number().nullish(),
  meterNumber: z4.string(),
  image: z4.string().nullish(),
  dateTime: z4.coerce.date(),
  meterReaderId: z4.uuid(),
});

export const CreateNewMeterSchema = z4.object({
  currentReading: z4.number().nullish(),
  meterNumber: z4.string(),
  image: z4.string().nullish(),
  dateTime: z4.coerce.date(),
  meterReaderId: z4.uuid(),
});

export const UpdateNewMeterSchema = CreateNewMeterSchema;

export type CreateNewMeter = z4.infer<typeof CreateNewMeterSchema>;
export type NewMeter = z4.infer<typeof NewMeterSchema>;
