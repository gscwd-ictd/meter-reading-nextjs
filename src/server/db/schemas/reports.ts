import { sql } from "drizzle-orm";
import { boolean, integer, pgView, varchar } from "drizzle-orm/pg-core";

export const viewReadingZoneBookProgress = pgView("view_reading_zone_book_progress", {
  readingMonth: varchar("reading_month"),
  zone: varchar("zone"),
  book: varchar("book"),
  meterReaderId: varchar("meter_reader_id").notNull(),
  totalRead: integer("total_read"),
  totalAccounts: integer("total_accounts"),
  statusProgress: varchar("status_progress"),
  isCommitted: boolean("is_committed"),
}).as(sql`
    select
        date_trunc('month',rd.created_at) as reading_month,
        rd.zone_code as zone,
        rd.book_code as book,
        rd.meter_reader_id,
        count(*) filter ( where rd.is_read = true ) total_read,
        count(rd.account_number) as total_accounts,
        case
            when count(*) filter ( where rd.is_completed = true ) = count(rd.account_number)
                then 'completed'
            when count(*) filter ( where rd.is_committed = true ) = count(rd.account_number)
                then 'posted'
            else 'in progress'
        end as status_progress,
        case
            when count(*) filter (where rd.is_committed = true) = count(rd.account_number)
                then  true
                else false
        end as is_committed
    from reading_details rd
    group by 
        rd.zone_code,
        rd.book_code, 
        rd.meter_reader_id,
        date_trunc('month', rd.created_at)
    order by
        rd.zone_code::int,
        rd.book_code::int
    `);

export const viewReadingAccountProgress = pgView("view_reading_account_progress", {
  readingMonth: varchar("reading_month"),
  meterReaderId: varchar("meter_reader_id").notNull(),
  readingDate: varchar("reading_date"),
  accountNumber: varchar("account_number"),
  checkDigit: varchar("check_digit"),
  accountName: varchar("account_name"),
  zone: varchar("zone_code"),
  book: varchar("book_code"),
  currentReading: integer("current_reading"),
  previousReading: integer("previous_reading"),
  averageUsage: integer("average_usage"),
  billedAmount: integer("billed_amount"),
  isRead: boolean("is_read"),
  isPosted: boolean("is_posted"),
  isCompleted: boolean("is_completed"),
  isCommitted: boolean("is_committed"),
  remarks: varchar("remarks"),
  additionalRemarks: varchar("additional_remarks"),
  createdAt: varchar("created_at"),
}).as(sql`
     select
        date_trunc('month',created_at) as reading_month,
        meter_reader_id,
        reading_date AT TIME ZONE 'Asia/Manila' as reading_date,
        account_number,
        check_digit,
        account_name,
        zone_code,
        book_code,
        current_reading,
        previous_reading,
        average_usage,
        billed_amount,
        is_read,
        is_posted,
        is_completed,
        is_committed,
        remarks,
        additional_remarks,
        created_at
    from 
        reading_details
    order by 
        zone_code::int, 
        book_code::int
    `);
