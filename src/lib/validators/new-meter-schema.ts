import z4 from "zod/v4";

// id: varchar("id")
//     .primaryKey()
//     .$defaultFn(() => crypto.randomUUID()),
//   currentReading: real("current_reading"),
//   meterNumber: varchar("meter_number").notNull(),
//   image: text("image"),
//   dateTime: timestamp("date_time", { mode: "date" }).notNull(),

export const CreateNewMeterSchema = z4.object({
  id: z4.uuid(),
  currentReading: z4.number().nullable(),
  meterNumber: z4.string(),
  image: z4.string().nullable(),
  dateTime: z4.date(),
});

export const UpdateNewMeterSchema = CreateNewMeterSchema.partial().omit({
  id: true,
});

export type NewMeter = z4.infer<typeof CreateNewMeterSchema>;
