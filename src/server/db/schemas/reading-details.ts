import { boolean, timestamp, integer, pgTable, real, text, varchar } from "drizzle-orm/pg-core";
import { meterReaders } from "./meter-readers";

export const readingDetails = pgTable("reading_details", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  meterReaderId: varchar("meter_reader_id")
    .references(() => meterReaders.id)
    .notNull(),
  accountNumber: varchar("account_number").unique().notNull(),
  accountName: varchar("account_name").notNull(),
  meterNumber: varchar("meter_number").unique().notNull(),
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
  readingDate: timestamp("reading_date"),
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
});
