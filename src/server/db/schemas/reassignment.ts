import { index, jsonb, pgTable, pgView, text, timestamp, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { scheduleMeterReaders } from "./schedules";
import { meterReaders } from "./meter-readers";
import { relations, sql } from "drizzle-orm";

export const reassignment = pgTable("reassignments", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  scheduleMeterReaderId: uuid("schedule_meter_reader_id")
    .references(() => scheduleMeterReaders.id, {
      onDelete: "cascade",
    })
    .notNull(),
  remarks: text("remarks").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const reassignmentRelations = relations(reassignment, ({ one, many }) => ({
  scheduleMeterReader: one(scheduleMeterReaders, {
    fields: [reassignment.scheduleMeterReaderId],
    references: [scheduleMeterReaders.id],
  }),
  zoneBooks: many(reassignmentZoneBook),
}));

export const reassignmentZoneBook = pgTable(
  "reassignment_zone_books",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    reassignmentId: uuid("reassignment_id")
      .references(() => reassignment.id, {
        onDelete: "cascade",
      })
      .notNull(),
    zone: varchar("zone", { length: 2 }),
    book: varchar("book", { length: 2 }),
    meterReaderId: uuid("meter_reader_id").references(() => meterReaders.id, {
      onDelete: "cascade",
    }),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true })
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("unique_reassignment_zone_book").on(table.reassignmentId, table.zone, table.book),
    index("idx__reassignment_zone_book").on(table.zone, table.book),
    index("idx_reassignment_meter_reader").on(table.meterReaderId),
  ],
);

export const reassignmentZoneBookRelations = relations(reassignmentZoneBook, ({ one }) => ({
  reassignment: one(reassignment, {
    fields: [reassignmentZoneBook.reassignmentId],
    references: [reassignment.id],
  }),
  meterReader: one(meterReaders, {
    fields: [reassignmentZoneBook.meterReaderId],
    references: [meterReaders.id],
  }),
}));

export const reassignmentView = pgView("view_reassignment_zone_book", {
  id: uuid("id"),
  scheduleMeterReaderId: uuid("schedule_meter_reader_id"),
  remarks: text("remarks"),
  zoneBooks: jsonb("zone_books").$type<
    {
      zone: string;
      book: string;
      meterReader: {
        id: string;
      };
    }[]
  >(),
}).as(sql`
  select
    ra.id,
    ra.schedule_meter_reader_id,
    ra.remarks,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'zone', razb.zone,
          'book', razb.book,
          'meterReader', jsonb_build_object(
            'id', razb.meter_reader_id
          )
        )
      ) filter (where razb.reassignment_id is not null),
      '[]'::jsonb
    ) as zone_books
  from reassignments ra
  left join reassignment_zone_books razb on ra.id = razb.reassignment_id
  group by ra.id, ra.schedule_meter_reader_id, ra.remarks`);
