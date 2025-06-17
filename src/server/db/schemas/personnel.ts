import { generateCuid } from "@/server/helpers/generateCuid";
import { eq, relations, sql } from "drizzle-orm";
import { pgEnum, pgTable, pgView, timestamp, unique, varchar } from "drizzle-orm/pg-core";

/**
 * Enum for rest days:
 *  - "6" = Saturday
 *  - "0" = Sunday
 */
export const RestDayType = ["6", "0"] as const;
export const restDayEnum = pgEnum("rest_day_enum", RestDayType);

/**
 * `personnel` table - stores meter readers with assigned rest days.
 */

export const personnel = pgTable("personnel", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => generateCuid())
    .notNull(),
  employeeId: varchar("employee_id").unique().notNull(),
  restDay: restDayEnum("rest_day").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

/**
 * Relations: One `personnel` has many `personnelZoneBook` entries.
 */
export const personnelRelations = relations(personnel, ({ many }) => ({
  zoneBooks: many(personnelZoneBook),
}));

/**
 * `personnel_zone_book` join table - assigns zone books to personnel.
 */
export const personnelZoneBook = pgTable(
  "personnel_zone_book",
  {
    id: varchar("personnel_zone_book_id")
      .primaryKey()
      .$defaultFn(() => generateCuid())
      .notNull(),
    personnelId: varchar("personnel_id")
      .references(() => personnel.id, { onDelete: "cascade" })
      .notNull(),
    zone: varchar("zone").notNull(),
    book: varchar("book").notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [unique("unique_personnel_zone_book").on(table.personnelId, table.zone, table.book)],
);

/**
 * Relations: One `personnel_zone_book` entry belongs to one `personnel`.
 */
export const personnelZoneBookRelations = relations(personnelZoneBook, ({ one }) => ({
  personnel: one(personnel, { fields: [personnelZoneBook.personnelId], references: [personnel.id] }),
}));

export const personnelZoneBookView = pgView("personnel_zone_book_view").as((view) =>
  view
    .select({
      id: personnel.id,
      employeeId: personnel.employeeId,
      restDay: personnel.restDay,
      zoneBooks: sql`
        jsonb_agg(
          jsonb_build_object(
            'zone', ${personnelZoneBook.zone},
            'book', ${personnelZoneBook.book},
            'zoneBook', ${personnelZoneBook.zone} || '-' || ${personnelZoneBook.book}
          )
        )
      `.as("zoneBooks"),
    })
    .from(personnel)
    .innerJoin(personnelZoneBook, eq(personnel.id, personnelZoneBook.personnelId))
    .groupBy(personnel.id, personnel.employeeId, personnel.restDay),
);
