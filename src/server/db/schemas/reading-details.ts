import { boolean, date, index, integer, pgTable, real, text, unique, varchar } from "drizzle-orm/pg-core";
import { loginAccounts } from "./login-accounts";

export const readingDetails = pgTable(
  "reading_details",
  {
    id: varchar("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    meterReaderId: varchar("id")
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
    dateInstalled: date("date_installed").notNull(),
    disconnectionType: varchar("disconnection_type").notNull(),
    readingDate: date("reading_date").notNull(),
    dueDate: date("due_date").notNull(),
    disconnectionDate: date("disconnection_date").notNull(),
    reconnectionDate: date("reconnection_date").notNull(),
    contactNumber: varchar("contact_number").notNull(),
    classification: varchar("classification").notNull(),
    arrears: real("arrears").notNull(),
    currentReading: real("current_reading"),
    billedAmount: real("billed_amount"),
    remarks: varchar("remarks"),
    additionalRemarks: varchar("additional_remakrs"),
    image: text("image"),
    printCount: integer("print_count"),
  },
  (t) => [unique().on(t.meterCode, t.consumerType)],
);
