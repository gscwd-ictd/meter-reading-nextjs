import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const leakages = pgTable("leakages", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  nearestMeterNumber: varchar("nearest_meter_number"),
  remarks: text("remarks"),
  additionalRemarks: text("additional_remarks"),
  dateTime: timestamp("date_time", { mode: "date" }).notNull(),
});
