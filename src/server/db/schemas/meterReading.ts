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
import z4 from "zod/v4";

// export const readingDetails = pgTable("reading_details", {
//   id: varchar("id").primaryKey().notNull(),
//   meterReaderId: varchar("meter_reader_id").notNull(),
//   accountNo: varchar("account_no").notNull(),
//   presentReading: doublePrecision("present_reading").notNull(),
//   usage: doublePrecision("usage").notNull(),
//   billedAmount: doublePrecision("billed_amount").notNull(),
//   readingDate: timestamp("reading_date", { mode: "date" }).notNull(),
//   dueDate: timestamp("due_date", { mode: "date" }).notNull(),
//   disconnectionDate: timestamp("disconnection_date", { mode: "date" }).notNull(),
//   remarks: varchar("remarks"),
//   additionalRemarks: text("additional_remarks"),
//   penalty: doublePrecision("penalty"),
//   isPosted: boolean("is_posted").default(false).notNull(),
// });

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

export const readingDetails = pgTable("reading_details", {
  id: varchar("id").primaryKey().notNull(),
  meterReaderId: varchar("meter_reader_id"),
  accountNumber: varchar("account_number"),
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
  readingDate: varchar("reading_date"),
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

const BaseSchema = z4.object({
  id: z4.uuid(),
});

// export const ReadingDetailsSchema = BaseSchema.extend({
//   meterReaderId: z4.string(),
//   accountNo: z4.string(),
//   presentReading: z4.number(),
//   usage: z4.number(),
//   billedAmount: z4.number(),
//   readingDate: z4.string(),
//   dueDate: z4.string(),
//   disconnectionDate: z4.string(),
//   remarks: z4.string().optional(),
//   additionalRemarks: z4.string().optional(),
//   penalty: z4.number().optional(),
//   isPosted: z4.boolean(),
// });

// export const UpdateReadingDetailsSchema = z4.object({
//   isPosted: z4.boolean(),
// });

export const ZoneBookAddressSchema = BaseSchema.extend({
  zoneCode: z4.number().optional(),
  bookCode: z4.number().optional(),
  address: z4.string().optional(),
});

export const UpdateZoneBookAddressSchema = ZoneBookAddressSchema.omit({
  id: true,
});

export const UsageSchema = BaseSchema.extend({
  accountNumber: z4.string().optional(),
  month1Usage: z4.string().optional(),
  month2Usage: z4.string().optional(),
  month3Usage: z4.string().optional(),
  month4Usage: z4.string().optional(),
});

export const UpdateUsageSchema = UsageSchema.omit({
  id: true,
});

export const AccountHistorySchema = BaseSchema.extend({
  accountNumber: z4.string().optional(),
  dateTime: z4.string().optional(),
  remarks: z4.string().optional(),
});

export const UpdateAccountHistorySchema = AccountHistorySchema.omit({
  id: true,
});

export const ReadingDetailsSchema = BaseSchema.extend({
  meterReaderId: z4.string(),
  accountNumber: z4.string().optional(),
  accountName: z4.string().optional(),
  meterNumber: z4.string().optional(),
  previousReading: z4.string().optional(),
  zoneCode: z4.string().optional(),
  bookCode: z4.string().optional(),
  meterStatus: z4.string().optional(),
  isRead: z4.boolean().optional(),
  sequenceNumber: z4.string().optional(),
  address: z4.string().optional(),
  dateInstalled: z4.string().optional(),
  disconnectionType: z4.string().optional(),
  readingDate: z4.string().optional(),
  disconnectionDate: z4.string().optional(),
  reconnectionDate: z4.string().optional(),
  contactNumber: z4.string().optional(),
  classification: z4.string().optional(),
  arrears: z4.string().optional(),
  currentReading: z4.string().optional(),
  billedAmount: z4.string().optional(),
  remarks: z4.string().optional(),
  additionalRemarks: z4.string().optional(),
  image: z4.string().optional(),
  longlat: z4.string().optional(),
  printCount: z4.number().optional(),
  checkDigit: z4.number().optional(),
  dueDate: z4.string().optional(),
  consumerType: z4.string().optional(),
  meterCode: z4.number().optional(),
});

export const UpdateReadingDetailsSchema = ReadingDetailsSchema.omit({
  id: true,
});

export const NewMeterSchema = BaseSchema.extend({
  currentReading: z4.string().optional(),
  meterNumber: z4.string().optional(),
  image: z4.string().optional(),
  dateTime: z4.string().optional(),
});

export const UpdateNewMeterSchema = NewMeterSchema.omit({
  id: true,
});

export const WaterConcernsSchema = BaseSchema.extend({
  remakrs: z4.string().optional(),
  additionalRemarks: z4.string().optional(),
  nearestMeterNumber: z4.string().optional(),
  image: z4.string().optional(),
});

export const UpdateWaterConcernsSchema = WaterConcernsSchema.omit({
  id: true,
});

export const LeakageSchema = BaseSchema.extend({
  nearestMeterNumber: z4.string().optional(),
  remarks: z4.string().optional(),
  additionalRemarks: z4.string().optional(),
  dateTime: z4.string().optional(),
});

export const UpdateLeakageSchema = LeakageSchema.omit({
  id: true,
});

export const RatesSchema = BaseSchema.extend({
  accountType: z4.string().optional(),
  description: z4.string().optional(),
  meterCode: z4.number().optional(),
  minimumRate: z4.number().optional(),
  rate11: z4.number().optional(),
  rate21: z4.number().optional(),
  rate31: z4.number().optional(),
  rate41: z4.number().optional(),
  rate51: z4.number().optional(),
});

export const UpdateRatesSchema = RatesSchema.omit({
  id: true,
});
