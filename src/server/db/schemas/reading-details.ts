import {
  boolean,
  timestamp,
  integer,
  pgTable,
  real,
  text,
  varchar,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { meterReaders } from "./meter-readers";

export const readingDetails = pgTable(
  "reading_details",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    meterReaderId: varchar("meter_reader_id")
      .references(() => meterReaders.id)
      .notNull(),
    accountNumber: varchar("account_number").notNull(),
    accountName: varchar("account_name").notNull(),
    meterNumber: varchar("meter_number").notNull(),
    checkDigit: integer("check_digit").notNull(),
    meterCode: integer("meter_code").notNull(),
    consumerType: varchar("consumer_type").notNull(),
    previousReading: real("previous_reading").notNull(),
    longlat: varchar("longlat"),
    zoneCode: varchar("zone_code").notNull(),
    bookCode: varchar("book_code").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    isSenior: boolean("is_senior").notNull(),
    isConnected: boolean("is_connected").notNull(),
    meterSize: varchar("meter_size").notNull(),
    averageUsage: real("average_usage"),
    otherBalance: real("other_balance"),
    sequenceNumber: varchar("sequence_number").notNull(),
    address: text("address").notNull(),
    dateInstalled: timestamp("date_installed"),
    disconnectionType: varchar("disconnection_type").notNull(),
    readingDate: timestamp("reading_date", { mode: "date", withTimezone: true }),
    dueDate: timestamp("due_date"),
    disconnectionDate: timestamp("disconnection_date"),
    reconnectionDate: timestamp("reconnection_date"),
    contactNumber: varchar("contact_number"),
    classification: varchar("classification").notNull(),
    arrears: real("arrears").notNull(),
    currentReading: real("current_reading"),
    billedAmount: real("billed_amount"),
    remarks: varchar("remarks"),
    additionalRemarks: varchar("additional_remarks"),
    image: text("image"),
    printCount: integer("print_count"),
    penaltyAmount: real("penalty_amount"),
    seniorDiscount: real("senior_discount"),
    changeMeterAmount: real("change_meter_amount"),
    timeStart: timestamp("time_start"),
    timeEnd: timestamp("time_end"),
    previousBillDate: timestamp("previous_bill_date"),
    createdAt: timestamp("created_at").notNull(),
    isPosted: boolean("is_posted").notNull(), //added isPosted field for syncing purposes
    isCompleted: boolean("is_completed").notNull(), //added isCompleted field for marking reading as completed
    isCommitted: boolean("is_committed").notNull(), //added isCommitted field for marking reading as
    datetimeCompleted: timestamp("datetime_completed").notNull(),
    datetimeCommitted: timestamp("datetime_committed").notNull(),
    datetimePosted: timestamp("datetime_posted").notNull(),
  },
  (t) => {
    return [
      unique("reading_details_account_number_meter_reader_id_created_at_unique").on(
        t.accountNumber,
        t.meterReaderId,
        t.createdAt,
      ),
      index("idx_rd_created").on(t.createdAt),
      index("idx_rd_meter_reader").on(t.meterReaderId),
      index("idx_rd_account_number").on(t.accountNumber),
      index("idx_rd_acc_created").on(t.accountNumber, t.createdAt),
      index("idx_rd_zone_book_reader_date").on(t.zoneCode, t.bookCode, t.meterReaderId, t.readingDate),
      index("idx_rd_status").on(t.isRead, t.isCompleted),
    ];
  },
);
