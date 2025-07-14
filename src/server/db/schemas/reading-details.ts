import { boolean, timestamp, integer, pgTable, real, text, unique, varchar } from "drizzle-orm/pg-core";
import { loginAccounts } from "./login-accounts";

export const readingDetails = pgTable(
  "reading_details",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    meterReaderId: varchar("meter_reader_id")
      .references(() => loginAccounts.id)
      .notNull(),
    accountNumber: varchar("account_number").unique().notNull(),
    accountName: varchar("account_name").notNull(),
    meterNumber: varchar("meter_number").unique().notNull(),
    checkDigit: integer("check_digit").notNull(),
    meterCode: integer("meter_code").notNull(),
    consumerType: varchar("consumer_type").notNull(),
    previousReading: real("previous_reading").notNull(),
    longlat: varchar("longlat").notNull(),
    zoneCode: varchar("zone_code").unique().notNull(),
    bookCode: varchar("book_code").unique().notNull(),
    meterStatus: varchar("meter_status").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    sequenceNumber: varchar("sequence_number").notNull(),
    address: text("address").notNull(),
    dateInstalled: timestamp("date_installed").notNull(),
    disconnectionType: varchar("disconnection_type").notNull(),
    readingDate: timestamp("reading_date").notNull(),
    dueDate: timestamp("due_date").notNull(),
    disconnectionDate: timestamp("disconnection_date").notNull(),
    reconnectionDate: timestamp("reconnection_date").notNull(),
    contactNumber: varchar("contact_number").notNull(),
    classification: varchar("classification").notNull(),
    arrears: real("arrears").notNull(),
    currentReading: real("current_reading"),
    billedAmount: real("billed_amount"),
    remarks: varchar("remarks"),
    additionalRemarks: varchar("additional_remarks"),
    image: text("image"),
    printCount: integer("print_count"),
  },
  (t) => [unique().on(t.meterCode, t.consumerType)],
);
