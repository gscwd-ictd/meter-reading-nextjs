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
 * `meter readers` table - stores meter readers with assigned rest days.
 */

export const meterReaders = pgTable("meter_readers", {
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
 * Relations: One `meter readers` has many `meterReaderZoneBook` entries.
 */
export const meterReaderRelations = relations(meterReaders, ({ many }) => ({
  zoneBooks: many(meterReaderZoneBook),
}));

/**
 * `meter_reader_zone_book` join table - assigns zone books to meter readers.
 */
export const meterReaderZoneBook = pgTable(
  "meter_reader_zone_book",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => generateCuid())
      .notNull(),
    meterReaderId: varchar("meter_reader_id")
      .references(() => meterReaders.id, { onDelete: "cascade" })
      .notNull(),
    zone: varchar("zone").notNull(),
    book: varchar("book").notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [unique("unique_meter_reader_zone_book").on(table.meterReaderId, table.zone, table.book)],
);

/**
 * Relations: One `meter_reader_zone_book` entry belongs to one `meter readers`.
 */
export const meterReaderZoneBookRelations = relations(meterReaderZoneBook, ({ one }) => ({
  meterReaders: one(meterReaders, {
    fields: [meterReaderZoneBook.meterReaderId],
    references: [meterReaders.id],
  }),
}));

export const meterReaderZoneBookView = pgView("meter_reader_zone_book_view").as((view) =>
  view
    .select({
      id: meterReaders.id,
      employeeId: meterReaders.employeeId,
      restDay: meterReaders.restDay,
      zoneBooks: sql`
        jsonb_agg(
          jsonb_build_object(
            'zone', ${meterReaderZoneBook.zone},
            'book', ${meterReaderZoneBook.book},
            'zoneBook', ${meterReaderZoneBook.zone} || '-' || ${meterReaderZoneBook.book}
          )
        )
      `.as("zoneBooks"),
    })
    .from(meterReaders)
    .innerJoin(meterReaderZoneBook, eq(meterReaders.id, meterReaderZoneBook.meterReaderId))
    .groupBy(meterReaders.id, meterReaders.employeeId, meterReaders.restDay),
);
