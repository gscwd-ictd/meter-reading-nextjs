import { pgTable, real, timestamp, varchar, text } from "drizzle-orm/pg-core";
import { readingDetails } from "./reading-details";
import { meterReaders } from "./meter-readers";

export const accountHistory = pgTable("account_history", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  meterReaderId: varchar("meter_reader_id")
    .references(() => meterReaders.id)
    .notNull(),
  accountNumber: varchar("account_number")
    .references(() => readingDetails.accountNumber)
    .notNull(),
  firstService: text("first_service"),
  secondService: text("second_service"),
  thirdService: text("third_service"),
  dateTime: timestamp("date_time").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usage = pgTable("usage", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  meterReaderId: varchar("meter_reader_id")
    .references(() => meterReaders.id)
    .notNull(),
  accountNumber: varchar("account_number")
    .references(() => readingDetails.accountNumber)
    .notNull(),
  month1Usage: real("month_1_usage").notNull(),
  month2Usage: real("month_2_usage").notNull(),
  month3Usage: real("month_3_usage").notNull(),
  month4Usage: real("month_4_usage").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
