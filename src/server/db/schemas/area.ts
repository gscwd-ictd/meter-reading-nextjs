import { relations } from "drizzle-orm";
import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { zoneBook } from "./zone-book";
import { generateCuid } from "@mr/server/helpers/generateCuid";

export const area = pgTable("area", {
  areaId: varchar("area_id")
    .primaryKey()
    .$defaultFn(() => generateCuid())
    .notNull(),
  area: varchar("area").unique().notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const areaRelations = relations(area, ({ many }) => ({
  zoneBooks: many(zoneBook),
}));
