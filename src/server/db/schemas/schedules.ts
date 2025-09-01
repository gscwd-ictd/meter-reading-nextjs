import {
  date,
  index,
  integer,
  jsonb,
  pgTable,
  pgView,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { meterReaders } from "./meter-readers";
import { relations, sql } from "drizzle-orm";

/**
 * A schedule represents a reading assignment for a specific meter reader on a given date.
 * Each schedule may include multiple zone-book pairs.
 */

export const schedules = pgTable(
  "schedules",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    readingDate: date("reading_date").unique().notNull(),
    dueDate: jsonb("due_date").notNull(),
    disconnectionDate: jsonb("disconnection_date").notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [index("idx_schedule_reading_date").on(table.readingDate)],
);

export const schedulesRelations = relations(schedules, ({ many }) => ({
  scheduleMeterReaders: many(scheduleMeterReaders),
}));

export const scheduleMeterReaders = pgTable(
  "schedule_meter_readers",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    scheduleId: uuid("schedule_id")
      .references(() => schedules.id, { onDelete: "cascade" })
      .notNull(),
    meterReaderId: uuid("meter_reader_id")
      .references(() => meterReaders.id, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_smr_schedule").on(table.scheduleId),
    index("idx_smr_meter_reader").on(table.meterReaderId),
    unique("unique_schedule_meter_reader").on(table.scheduleId, table.meterReaderId),
  ],
);

export const scheduleMeterReadersRelations = relations(scheduleMeterReaders, ({ one, many }) => ({
  schedule: one(schedules, {
    fields: [scheduleMeterReaders.scheduleId],
    references: [schedules.id],
  }),
  scheduleZoneBooks: many(scheduleZoneBooks),
}));

/**
 * Links schedules to specific zones and books, including due and disconnection dates for each.
 */
export const scheduleZoneBooks = pgTable(
  "schedule_zone_books",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    scheduleMeterReaderId: uuid("schedule_meter_reader_id")
      .references(() => scheduleMeterReaders.id, { onDelete: "cascade" })
      .notNull(),
    zone: varchar("zone").notNull(),
    book: varchar("book").notNull(),
    dueDate: date("due_date").notNull(),
    disconnectionDate: date("disconnection_date").notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_schedule_zone_book_meter_reader").on(table.scheduleMeterReaderId),
    index("idx_schedule_zone_book_zone_book").on(table.zone, table.book),
    unique("unique_schedule_zone_book").on(table.scheduleMeterReaderId, table.zone, table.book),
  ],
);

export const scheduleZoneBooksRelations = relations(scheduleZoneBooks, ({ one }) => ({
  scheduleMeterReader: one(scheduleMeterReaders, {
    fields: [scheduleZoneBooks.scheduleMeterReaderId],
    references: [scheduleMeterReaders.id],
  }),
}));

export const viewScheduleReading = pgView("view_schedule_reading", {
  id: varchar("id"),
  readingDate: date("reading_date"),
  dueDate: jsonb("due_date"),
  disconnectionDate: jsonb("disconnection_date"),
  meterReaders: jsonb("meter_readers").$type<{
    scheduleMeterReaderId: string;
    id: string;
    zoneBooks: { zone: string; book: string; zoneBook: string; area: { id: string; name: string } };
  }>(),
}).as(sql`
  select
    s.id,
    s.reading_date,
    s.due_date,
    s.disconnection_date,
    coalesce(
        jsonb_agg(
            jsonb_build_object(
                'scheduleMeterReaderId', smr.id,
                'id', smr.meter_reader_id,
                'zoneBooks', COALESCE((
                    SELECT jsonb_agg(
                        jsonb_build_object(
                            'zone', szb.zone,
                            'book', szb.book,
                            'zoneBook', vzbwa.zone_book,
                            'area', vzbwa.area
                        )
                    )
                    from schedule_zone_books szb
                    left join view_zone_book_with_area vzbwa on szb.zone = vzbwa.zone and szb.book = vzbwa.book
                    where szb.schedule_meter_reader_id = smr.id
                ), '[]'::jsonb)
            )
        ) filter (where smr.id is not null),
        '[]'::jsonb
    ) as meter_readers
  from schedules s
  left join schedule_meter_readers smr on s.id = smr.schedule_id
  group by s.id, s.reading_date, s.due_date, s.disconnection_date
  order by s.reading_date`);

export const viewScheduleMeterReadingZoneBook = pgView("view_schedule_meter_reading_with_zone_book", {
  scheduleMeterReaderId: varchar("id"),
  meterReaderId: varchar("meter_reader_id"),
  month: varchar("month"),
  year: varchar("year"),
  zoneBooks: jsonb("zone_books").$type<{
    zone: string;
    book: string;
    zoneBook: string;
    area: { id: string; name: string };
    dueDate: string;
    disconnectionDate: string;
  }>(),
}).as(sql`
      select
        smr.id,
        smr.meter_reader_id,
        extract(month from s.reading_date) as month,
        extract(year from s.reading_date) as year,
        coalesce(
            jsonb_agg(
                jsonb_build_object(
                'zone', szb.zone,
                'book', szb.book,
                'zoneBook', vzba.zone_book,
                'area', vzba.area,
                'dueDate', szb.due_date,
                'disconnectionDate', szb.disconnection_date
            )
          order by szb.zone, szb.book
        )
          FILTER ( WHERE szb.id is not null), '[]'
        ) as zone_books
      from
        schedules s
      left join
        schedule_meter_readers smr
            on s.id = smr.schedule_id
      left join
        schedule_zone_books szb
        on smr.id = szb.schedule_meter_reader_id
      left join
        view_zone_book_with_area vzba
        on szb.zone = vzba.zone and szb.book = vzba.book
      group by
        smr.id,
        smr.meter_reader_id,
        s.reading_date
  `);

export const viewZoneBookScheduleReader = pgView("view_zone_book_schedule_reader", {
  id: varchar("id"),
  zone: varchar("zone"),
  book: varchar("book"),
  area: jsonb("area").$type<{ id: string; name: string }>(),
  meterReaderId: varchar("meter_reader_id"),
  month: integer("month"),
  year: integer("year"),
  readingDate: date("reading_date"),
  dueDate: date("due_date"),
  disconnectionDate: date("disconnection_date"),
}).as(sql`
    select
        coalesce(s.id::text, '') as id,
        vzbwa.zone,
        vzbwa.book,
        vzbwa.area,
        coalesce(smr.meter_reader_id::text, '') as meter_reader_id,
        coalesce(s.reading_date::text, '') as reading_date,
        coalesce(szb.due_date::text, '') as due_date,
        coalesce(szb.disconnection_date::text,'') as disconnection_date,
        extract(month from s.reading_date) as month,
        extract(year from s.reading_date) as year
    from view_zone_book_with_area vzbwa
    left join schedule_zone_books szb
      on vzbwa.zone = szb.zone
    and vzbwa.book = szb.book
    left join schedule_meter_readers smr
      on szb.schedule_meter_reader_id = smr.id
    left join schedules s
      on smr.schedule_id = s.id   
    order by vzbwa.zone, vzbwa.book
  `);
