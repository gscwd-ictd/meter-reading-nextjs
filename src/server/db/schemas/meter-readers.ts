import { relations, sql } from "drizzle-orm";
import { index, jsonb, pgEnum, pgTable, pgView, text, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { scheduleMeterReaders } from "./schedules";
import { generateCuid } from "@mr/server/helpers/generateCuid";

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
  meterReaderId: varchar("meter_reader_id")
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
  scheduleMeterReaders: many(scheduleMeterReaders),
}));

/**
 * `meter_reader_zone_book` join table - assigns zone books to meter readers.
 */
export const meterReaderZoneBook = pgTable(
  "meter_reader_zone_book",
  {
    meterReaderZoneBookId: varchar("meter_reader_zone_book_id")
      .primaryKey()
      .$defaultFn(() => generateCuid())
      .notNull(),
    meterReaderId: varchar("meter_reader_id")
      .references(() => meterReaders.meterReaderId, { onDelete: "cascade" })
      .notNull(),
    zone: varchar("zone").notNull(),
    book: varchar("book").notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("unique_meter_reader_zone_book").on(table.zone, table.book),
    index("idx_meter_reader_zone_book").on(table.zone, table.book),
  ],
);

/**
 * Relations: One `meter_reader_zone_book` entry belongs to one `meter readers`.
 */
export const meterReaderZoneBookRelations = relations(meterReaderZoneBook, ({ one }) => ({
  meterReader: one(meterReaders, {
    fields: [meterReaderZoneBook.meterReaderId],
    references: [meterReaders.meterReaderId],
  }),
}));

export const viewMeterReaderZoneBook = pgView("view_meter_reader_with_zone_book", {
  meterReaderId: varchar("meter_reader_id").notNull(),
  employeeId: varchar("employee_id").notNull(),
  mobileNumber: varchar("username").notNull(),
  restDay: varchar("rest_day").notNull(),
  zoneBooks: jsonb("zone_books"),
}).as(sql`
  select 
    mr.meter_reader_id,
    mr.employee_id,
    mr.rest_day,
    la.username,
    coalesce(  
      jsonb_agg(
        distinct jsonb_build_object(
          'zone', mrzb.zone,
          'book', mrzb.book,
          'zoneBook', mrzb.zone || '-' || mrzb.book,
          'area', vzbwa.area
        )
      ) filter (where mrzb.zone is not null and mrzb.book is not  null),
      '[]'::jsonb
    ) as zone_books
  from 
    meter_readers mr
  inner join 
    login_accounts la on mr.meter_reader_id = la.meter_reader_id
  left join 
    meter_reader_zone_book mrzb on mr.meter_reader_id = mrzb.meter_reader_id
  left join 
    view_zone_book_with_area vzbwa on mrzb.zone = vzbwa.zone and  mrzb.book = vzbwa.book
  group by 
    mr.meter_reader_id, 
    mr.employee_id, 
    mr.rest_day,
    la.username
  `);

export const viewZoneBookAssignment = pgView("view_zone_book_assignment", {
  meterReaderId: varchar("meter_reader_id"),
  zoneBookId: varchar("zone_book_id"),
  zone: varchar("zone"),
  book: varchar("book"),
  zoneBook: varchar("zone_book"),
  areaId: varchar("area_id"),
  area: varchar("area"),
}).as(sql`
    select
      mrzb.meter_reader_id,
      vzb.zone_book_id,
      vzb.zone,
      vzb.book,
      vzb.zone_book,
      vzb.area_id,
      vzb.area
    from view_zone_book_with_area vzb
    left join (
      select distinct zone, book, meter_reader_id
      from meter_reader_zone_book
    ) mrzb
      on vzb.zone = mrzb.zone and vzb.book = mrzb.book
    order by vzb.zone, vzb.book
  `);
