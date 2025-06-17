import { generateCuid } from "@/server/helpers/generateCuid";
import { pgTable, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { area } from "./area";
import { relations } from "drizzle-orm";

export const zoneBook = pgTable(
  "zone_book",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => generateCuid())
      .notNull(),
    areaId: varchar("area_id")
      .references(() => area.id, {
        onDelete: "cascade",
      })
      .notNull(),
    zone: varchar("zone").notNull(),
    book: varchar("book").notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [unique("unique_zone_book").on(table.zone, table.book)],
);

export const zoneBookRelations = relations(zoneBook, ({ one }) => ({
  area: one(area, { fields: [zoneBook.areaId], references: [area.id] }),
}));
