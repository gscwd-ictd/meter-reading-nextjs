import { decimal, foreignKey, integer, pgTable, real, text, unique, varchar } from "drizzle-orm/pg-core";
import { readingDetails } from "./reading-details";

export const rates = pgTable(
  "rates",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    meterCode: integer("meter_code").notNull(),
    consumerType: varchar("consumer_type").notNull(),
    description: text("description"),
    minimumRate: decimal("minimum_rate", { precision: 10, scale: 2 }).notNull(),
    rate11: decimal("rate_11", { precision: 10, scale: 2 }).notNull(),
    rate21: decimal("rate_21", { precision: 10, scale: 2 }).notNull(),
    rate31: decimal("rate_31", { precision: 10, scale: 2 }).notNull(),
    rate41: decimal("rate_41", { precision: 10, scale: 2 }).notNull(),
    rate51: decimal("rate_51", { precision: 10, scale: 2 }).notNull(),
  },
  (t) => [
    unique().on(t.meterCode, t.consumerType),
    foreignKey({
      columns: [t.meterCode, t.consumerType],
      foreignColumns: [readingDetails.meterCode, readingDetails.consumerType],
    }),
  ],
);
