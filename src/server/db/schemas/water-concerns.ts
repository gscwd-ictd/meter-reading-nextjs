import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const waterConcerns = pgTable("water_concerns", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  nearestWaterMeter: varchar("nearest_water_meter"),
  remarks: text("remarks"),
  additionalRemarks: text("additional_remarks"),
  image: text("image"),
  dateTime: timestamp("date_time", { mode: "date" }).notNull(),
});
