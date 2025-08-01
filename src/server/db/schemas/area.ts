import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { zoneBook } from "./zone-book";

export const area = pgTable("area", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  name: varchar("name").unique().notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const areaRelations = relations(area, ({ many }) => ({
  zoneBooks: many(zoneBook),
}));
