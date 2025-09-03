import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const readingRemarks = pgTable("reading_remarks", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name").unique().notNull(),
  isAverage: boolean("is_average").notNull().default(false),
  isActive: boolean("is_active").notNull().default(false),
  isZeroConsumption: boolean("is_zero_consumption").notNull().default(false),
  isNegativeConsumption: boolean("is_negative_consumption").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
