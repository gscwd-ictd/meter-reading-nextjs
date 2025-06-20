import { boolean, doublePrecision, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
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
