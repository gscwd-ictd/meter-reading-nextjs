import { index, jsonb, pgTable, pgView, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { area } from "./area";
import { relations, sql } from "drizzle-orm";

export const zoneBook = pgTable(
  "zone_book",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    areaId: varchar("area_id").references(() => area.id, {
      onDelete: "cascade",
    }),
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
  area: one(area, { fields: [zoneBook.areaId], references: [area.id] }),
}));

export const viewZoneBookArea = pgView("view_zone_book_with_area", {
  id: varchar("id"),
  zone: varchar("zone"),
  book: varchar("book"),
  zoneBook: varchar("zone_book"),
  area: jsonb("area").$type<{ id: string; name: string }>(),
}).as(sql`
  select 
    coalesce(zb.id::text, '') as id,
    v.zone_code as zone,
    v.book_code::varchar as book,
    v.zone_code || '-' || v.book_code as zone_book,
    jsonb_build_object(
        'id', coalesce(a.id::text,''),
        'name', coalesce(a.name, '')
    ) as area
  from "viewZoneBook" v
  left join
    zone_book zb ON v.zone_code = zb.zone AND v.book_code::varchar = zb.book
  left join
    area a ON a.id = zb.area_id
  order by v.zone_code, v.book_code`);
