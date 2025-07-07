import { pgTable, real, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const newMeters = pgTable("new_meters", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  currentReading: real("current_reading"),
  meterNumber: varchar("meter_number").notNull(),
  image: text("image"),
  dateTime: timestamp("date_time", { mode: "date" }).notNull(),
});
