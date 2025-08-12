import { doublePrecision, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const billingAdjustments = pgTable("billing_adjustments", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name", { length: 255 }).unique().notNull(),
  percentage: doublePrecision("percentage").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});
