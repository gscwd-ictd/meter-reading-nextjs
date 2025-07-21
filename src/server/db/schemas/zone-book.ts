import { index, pgTable, pgView, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { area } from "./area";
import { relations, sql } from "drizzle-orm";
import { generateCuid } from "@mr/server/helpers/generateCuid";

export const zoneBook = pgTable(
  "zone_book",
  {
    zoneBookId: varchar("zone_book_id")
      .primaryKey()
      .$defaultFn(() => generateCuid())
      .notNull(),
    areaId: varchar("area_id")
      .references(() => area.areaId, {
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
  (table) => [
    unique("unique_zone_book").on(table.zone, table.book),
    index("idx_zone_book").on(table.zone, table.book),
  ],
);

export const zoneBookRelations = relations(zoneBook, ({ one }) => ({
  area: one(area, { fields: [zoneBook.areaId], references: [area.areaId] }),
}));

export const viewZoneBookArea = pgView("view_zone_book_with_area", {
  zoneBookId: varchar("zone_book_id"),
  zone: varchar("zone"),
  book: varchar("book"),
  zoneBook: varchar("zone_book"),
  areaId: varchar("area_id"),
  area: varchar("area"),
}).as(sql`
  select 
    coalesce(zb.zone_book_id, '') as zone_book_id,
    v.zone_code as zone,
    v.book_code::varchar as book,
    v.zone_code || '-' || v.book_code as zone_book,
    coalesce(a.area_id, '') as area_id,
    coalesce(a.area,'') as area
  from "viewZoneBook" v
  left join
    zone_book zb ON v.zone_code = zb.zone AND v.book_code::varchar = zb.book
  left join
    area a ON a.area_id = zb.area_id
  order by v.zone_code, v.book_code`);
