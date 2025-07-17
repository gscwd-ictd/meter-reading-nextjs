import { date, index, jsonb, pgTable, pgView, timestamp, unique, varchar } from "drizzle-orm/pg-core";
import { meterReaders } from "./meter-readers";
import { eq, relations, sql } from "drizzle-orm";
import { generateCuid } from "@mr/server/helpers/generateCuid";

/**
 * A schedule represents a reading assignment for a specific meter reader on a given date.
 * Each schedule may include multiple zone-book pairs.
 */

export const schedules = pgTable(
  "schedules",
  {
    scheduleId: varchar("schedule_id")
      .primaryKey()
      .$defaultFn(() => generateCuid())
      .notNull(),
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
    scheduleMeterReaderId: varchar("schedule_meter_reader_id")
      .primaryKey()
      .$defaultFn(() => generateCuid())
      .notNull(),
    scheduleId: varchar("schedule_id")
      .references(() => schedules.scheduleId, { onDelete: "cascade" })
      .notNull(),
    meterReaderId: varchar("meter_reader_id")
      .references(() => meterReaders.meterReaderId, { onDelete: "cascade" })
      .notNull(),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    index("idx_smr_schedule").on(table.scheduleId),
    unique("unique_schedule_meter_reader").on(table.scheduleId, table.meterReaderId),
  ],
);

export const scheduleMeterReadersRelations = relations(scheduleMeterReaders, ({ one, many }) => ({
  schedule: one(schedules, {
    fields: [scheduleMeterReaders.scheduleId],
    references: [schedules.scheduleId],
  }),
  scheduleZoneBooks: many(scheduleZoneBooks),
}));

/**
 * Links schedules to specific zones and books, including due and disconnection dates for each.
 */
export const scheduleZoneBooks = pgTable(
  "schedule_zone_books",
  {
    scheduleZoneBookId: varchar("schedule_zone_book_id")
      .primaryKey()
      .$defaultFn(() => generateCuid())
      .notNull(),
    scheduleMeterReaderId: varchar("schedule_meter_reader_id")
      .references(() => scheduleMeterReaders.scheduleMeterReaderId, { onDelete: "cascade" })
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
    unique("unique_schedule_zone_book").on(table.scheduleMeterReaderId, table.zone, table.book),
  ],
);

export const scheduleZoneBooksRelations = relations(scheduleZoneBooks, ({ one }) => ({
  scheduleMeterReader: one(scheduleMeterReaders, {
    fields: [scheduleZoneBooks.scheduleMeterReaderId],
    references: [scheduleMeterReaders.scheduleMeterReaderId],
  }),
}));

// export const scheduleZoneBookView = pgView("schedule_zone_book_view").as((view) =>
//   view
//     .select({
//       readingDate: schedules.readingDate,
//       dueDate: schedules.dueDate,
//       disconnectionDate: schedules.disconnectionDate,
//       meterReaders: sql`select json_agg(
//       jsonb_build_object(
//         'scheduleMeterReaderId', ${scheduleMeterReaders.scheduleMeterReaderId},
//         'meterReaderId', ${scheduleMeterReaders.meterReaderId},
//         'zoneBooks', COALESCE((
//           SELECT json_agg(
//             jsonb_build_object(
//               'zone', ${scheduleZoneBooks.zone},
//               'book', ${scheduleZoneBooks.book},
//               'zoneBook', ${scheduleZoneBooks.zone} || '-' || ${scheduleZoneBooks.book}
//             )
//           )
//           FROM ${scheduleZoneBooks}
//           WHERE ${scheduleZoneBooks.scheduleMeterReaderId}  = ${scheduleMeterReaders.scheduleMeterReaderId}
//         ), '[]'::json) ) ) from ${scheduleMeterReaders} where ${scheduleMeterReaders.scheduleId} = ${schedules.scheduleId},`.as(
//         "meterReaders",
//       ),
//     })
//     .from(schedules)
//     .groupBy(schedules.scheduleId, schedules.readingDate, schedules.dueDate, schedules.disconnectionDate)
//     .orderBy(schedules.readingDate),
// );

export const scheduleZoneBookView = pgView("schedule_zone_book_view").as((view) =>
  view
    .select({
      readingDate: schedules.readingDate,
      dueDate: schedules.dueDate,
      disconnectionDate: schedules.disconnectionDate,
      meterReaders: sql`  (
    SELECT json_agg(
      jsonb_build_object(
        'scheduleMeterReaderId', ${scheduleMeterReaders.scheduleMeterReaderId},
        'meterReaderId', ${scheduleMeterReaders.meterReaderId},
        'zoneBooks', COALESCE((
          SELECT json_agg(
            jsonb_build_object(
              'zone', ${scheduleZoneBooks.zone},
              'book', ${scheduleZoneBooks.book},
              'zoneBook', ${scheduleZoneBooks.zone} || '-' || ${scheduleZoneBooks.book}
            )
          )
          FROM ${scheduleZoneBooks}
          WHERE ${scheduleZoneBooks.scheduleMeterReaderId} = ${scheduleMeterReaders.scheduleMeterReaderId}
        ), '[]'::json)
      )
    )
    FROM ${scheduleMeterReaders}
    WHERE schedule_meter_readers.schedule_id = ${schedules.scheduleId}
  ) `.as("meterReaders"),
    })
    .from(schedules)
    .orderBy(schedules.readingDate),
);

// export const scheduleZoneBookViewSample = pgView("schedule_zone_book_view").as((view) =>
//   view
//     .select({
//       readingDate: schedules.readingDate,
//       dueDate: schedules.dueDate,
//       disconnectionDate: schedules.disconnectionDate,
//       meterReaders: sql`select json_agg(
//       jsonb_build_object(
//         'scheduleMeterReaderId', ${scheduleMeterReaders.scheduleMeterReaderId},
//         'meterReaderId', ${scheduleMeterReaders.meterReaderId},
//         'zoneBooks', COALESCE((
//           SELECT json_agg(
//             jsonb_build_object(
//               'zone', ${scheduleZoneBooks.zone},
//               'book', ${scheduleZoneBooks.book},
//               'zoneBook', ${scheduleZoneBooks.zone} || '-' || ${scheduleZoneBooks.book}
//             )
//           )
//           FROM ${scheduleZoneBooks}
//           WHERE ${scheduleZoneBooks.scheduleMeterReaderId}  = ${scheduleMeterReaders.scheduleMeterReaderId}
//         ), '[]'::json),`.as("meterReaders"),
//     })
//     .from(schedules)
//     .leftJoin(scheduleMeterReaders, eq(schedules.scheduleId, scheduleMeterReaders.scheduleId))
//     .leftJoin(
//       scheduleZoneBooks,
//       eq(scheduleMeterReaders.scheduleMeterReaderId, scheduleZoneBooks.scheduleMeterReaderId),
//     )
//     .groupBy(schedules.scheduleId, schedules.readingDate, schedules.dueDate, schedules.disconnectionDate)
//     .orderBy(schedules.readingDate),
// );

export const scheduleReaderZoneBookView = pgView("schedule_reader_zone_book_view").as((view) =>
  view
    .select({
      scheduleMeterReaderId: scheduleMeterReaders.scheduleMeterReaderId,
      meterReaderId: scheduleMeterReaders.meterReaderId,
      zoneBooks: sql`
        COALESCE(
          json_agg(
            json_build_object(
              'zone', ${scheduleZoneBooks.zone},
              'book', ${scheduleZoneBooks.book},
              'zoneBook', ${scheduleZoneBooks.zone} || '-' || ${scheduleZoneBooks.book},
              'dueDate', ${scheduleZoneBooks.dueDate},
              'disconnectionDate', ${scheduleZoneBooks.disconnectionDate}
            )
          ) FILTER (WHERE ${scheduleZoneBooks.zone} IS NOT NULL),
          '[]'::json
        )
      `.as("zoneBooks"),
    })
    .from(scheduleMeterReaders)
    .leftJoin(
      scheduleZoneBooks,
      eq(scheduleMeterReaders.scheduleMeterReaderId, scheduleZoneBooks.scheduleMeterReaderId),
    )
    .groupBy(scheduleMeterReaders.scheduleMeterReaderId, scheduleMeterReaders.scheduleMeterReaderId),
);
