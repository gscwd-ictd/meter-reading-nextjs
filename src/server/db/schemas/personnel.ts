import { generateCuid } from "@/server/helpers/generateCuid";
import { relations } from "drizzle-orm";
import { pgEnum, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

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
  id: varchar("personnel_id")
    .primaryKey()
    .$defaultFn(() => generateCuid())
    .notNull(),
  employeeId: varchar("employee_id").notNull(),
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
export const personnelZoneBook = pgTable("personnel_zone_book", {
  id: varchar("personnel_zone_book_id")
    .primaryKey()
    .$defaultFn(() => generateCuid())
    .notNull(),
  personnelId: varchar("personnel_id")
    .references(() => personnel.id, { onDelete: "cascade" })
    .notNull(),
  zoneBook: varchar("zone_book").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

/**
 * Relations: One `personnel_zone_book` entry belongs to one `personnel`.
 */
export const personnelZoneBookRelations = relations(personnelZoneBook, ({ one }) => ({
  personnel: one(personnel, { fields: [personnelZoneBook.personnelId], references: [personnel.id] }),
}));
