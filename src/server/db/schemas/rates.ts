import { foreignKey, integer, pgTable, real, text, unique, varchar } from "drizzle-orm/pg-core";
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
    minimumRate: real("minimum_rate").notNull(),
    rate11: real("rate_11").notNull(),
    rate21: real("rate_21").notNull(),
    rate31: real("rate_31").notNull(),
    rate41: real("rate_41").notNull(),
    rate51: real("rate_51").notNull(),
  },
  (t) => [
    unique().on(t.meterCode, t.consumerType),
    foreignKey({
      columns: [t.meterCode, t.consumerType],
      foreignColumns: [readingDetails.meterCode, readingDetails.consumerType],
    }),
  ],
);
