import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
  real,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const readingDetails = pgTable("reading_details", {
  id: varchar("id").primaryKey().notNull(),
  meterReaderId: varchar("meter_reader_id").notNull(),
  accountNo: varchar("account_no").notNull(),
  presentReading: doublePrecision("present_reading").notNull(),
  usage: doublePrecision("usage").notNull(),
  billedAmount: doublePrecision("billed_amount").notNull(),
  readingDate: timestamp("reading_date", { mode: "date" }).notNull(),
  dueDate: timestamp("due_date", { mode: "date" }).notNull(),
  disconnectionDate: timestamp("disconnection_date", { mode: "date" }).notNull(),
  remarks: varchar("remarks"),
  additionalRemarks: text("additional_remarks"),
  penalty: doublePrecision("penalty"),
  isPosted: boolean("is_posted").default(false).notNull(),
});

export const zoneBookAddress = pgTable("zone_book_address", {
  id: varchar("id").primaryKey().notNull(),
  zoneCode: integer("zone_code"),
  bookCode: integer("book_code"),
  address: text("address"),
});

export const usage = pgTable("usage", {
  id: varchar("id").primaryKey().notNull(),
  accountNumber: varchar("account_number"),
  month1Usage: varchar("month1_usage"),
  month2Usage: varchar("month2_usage"),
  month3Usage: varchar("month3_usage"),
  month4Usage: varchar("month4_usage"),
});

export const accountHistory = pgTable("account_history", {
  id: varchar("id").primaryKey().notNull(),
  accountNumber: varchar("account_number"),
  dateTime: varchar("date_time"),
  remarks: text("remarks"),
});

export const accounts = pgTable("accounts", {
  id: varchar("id").primaryKey().notNull(),
  accountName: varchar("account_name"),
  meterNumber: varchar("meter_number"),
  previousReading: varchar("previous_reading"),
  zoneCode: varchar("zone_code"),
  bookCode: varchar("book_code"),
  meterStatus: varchar("meter_status"),
  isRead: boolean("is_read"),
  sequenceNumber: varchar("sequence_number"),
  address: varchar("address"),
  dateInstalled: varchar("date_installed"),
  disconnectionType: varchar("disconnection_type"),
  disconnectionDate: varchar("disconnection_date"),
  reconnectionDate: varchar("reconnection_date"),
  contactNumber: varchar("contact_number"),
  classification: varchar("classification"),
  arrears: varchar("arrears"),
  currentReading: varchar("current_reading"),
  billedAmount: varchar("billed_amount"),
  remarks: text("remarks"),
  additionalRemarks: text("additional_remarks"),
  image: text("image"),
  longlat: text("longlat"),
  printCount: integer("print_count"),
  checkDigit: integer("check_digit"),
  dueDate: varchar("due_date"),
  consumerType: varchar("consumer_type"),
  meterCode: integer("meter_code"),
});

export const newMeter = pgTable("new_meter", {
  id: varchar("id").primaryKey().notNull(),
  currentReading: varchar("current_reading"),
  meterNumber: varchar("meter_number"),
  image: varchar("image"),
  dateTime: varchar("date_time"),
});

export const waterConcerns = pgTable("water_concerns", {
  id: varchar("id").primaryKey().notNull(),
  remarks: text("remarks"),
  additionalRemarks: text("additional_remarks"),
  nearestMeterNumber: text("nearest_meter_number"),
  image: text("image"),
});

export const leakage = pgTable("leakage", {
  id: varchar("id").primaryKey().notNull(),
  nearestMeterNumber: text("nearest_meter_number"),
  remarks: text("remarks"),
  additionalRemarks: text("additional_remarks"),
  dateTime: varchar("date_time"),
});

export const rates = pgTable("rates", {
  id: varchar("id").primaryKey().notNull(),
  accountType: varchar("account_type"),
  description: text("description"),
  meterCode: integer("meter_code"),
  minimumRate: real("minimum_rate"),
  rate11: real("rate11"),
  rate21: real("rate21"),
  rate31: real("rate31"),
  rate41: real("rate41"),
  rate51: real("rate51"),
});

export const ReadingDetailsSchema = z.object({
  id: z.string().uuid(),
  meterReaderId: z.string(),
  accountNo: z.string(),
  presentReading: z.number(),
  usage: z.number(),
  billedAmount: z.number(),
  readingDate: z.string(),
  dueDate: z.string(),
  disconnectionDate: z.string(),
  remarks: z.string().optional(),
  additionalRemarks: z.string().optional(),
  penalty: z.number().optional(),
  isPosted: z.boolean(),
});

export const UpdateReadingDetailsSchema = z.object({
  isPosted: z.boolean(),
});
