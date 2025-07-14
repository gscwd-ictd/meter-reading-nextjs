import { date, pgTable, real, timestamp, varchar } from "drizzle-orm/pg-core";
import { readingDetails } from "./reading-details";

export const accountHistory = pgTable("account_history", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  accountNumber: varchar("account_number")
    .references(() => readingDetails.accountNumber)
    .notNull(),
  dateTime: timestamp("date_time").notNull(),
  remarks: varchar("remarks").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usage = pgTable("usage", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  accountNumber: varchar("account_number")
    .references(() => readingDetails.accountNumber)
    .notNull(),
  month1Usage: real("month_1_usage").notNull(),
  month2Usage: real("month_2_usage").notNull(),
  month3Usage: real("month_3_usage").notNull(),
  month4Usage: real("month_4_usage").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
