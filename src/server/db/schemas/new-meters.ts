import { boolean, index, pgTable, real, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { meterReaders } from "./meter-readers";

export const newMeters = pgTable(
  "new_meters",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    currentReading: real("current_reading"),
    meterNumber: varchar("meter_number").notNull(),
    image: text("image"),
    dateTime: timestamp("date_time", { mode: "date" }).notNull(),
    isCommitted: boolean("is_committed").notNull(),
    meterReaderId: uuid("meter_reader_id")
      .references(() => meterReaders.id, { onDelete: "no action" })
      .notNull(),
  },
  (table) => [
    index("idx_nm_meter_reader").on(table.meterReaderId),
    index("idx_nm_meter_number").on(table.meterNumber),
  ],
);
