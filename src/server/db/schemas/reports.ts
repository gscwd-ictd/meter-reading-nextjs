import { sql } from "drizzle-orm";
import { boolean, date, integer, jsonb, pgView, varchar } from "drizzle-orm/pg-core";

export const viewReadingZoneBookProgress = pgView("view_reading_zone_book_progress", {
  readingMonth: varchar("reading_month"),
  zone: varchar("zone"),
  book: varchar("book"),
  meterReaderId: varchar("meter_reader_id").notNull(),
  totalRead: integer("total_read"),
  totalAccounts: integer("total_accounts"),
  scheduleDate: varchar("reading_date"),
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
        vs.reading_date,
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
    left join view_schedule vs on vs.zone = lpad(rd.zone_code, 2, '0') and vs.book = rd.book_code
    group by 
        rd.zone_code,
        rd.book_code, 
        rd.meter_reader_id,
        date_trunc('month', rd.created_at),
        vs.reading_date
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
  usage: integer("usage"),
  billedAmount: integer("billed_amount"),
  isRead: boolean("is_read"),
  isPosted: boolean("is_posted"),
  datetimePosted: date("datetime_posted"),
  isCompleted: boolean("is_completed"),
  datetimeCompleted: date("datetime_completed"),
  isCommitted: boolean("is_committed"),
  datetimeCommitted: date("datetime_committed"),
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
        case
            when current_reading = 0 then  0
            else current_reading - previous_reading
        end as usage,
        average_usage,
        billed_amount,
        is_read,
        is_posted,
        datetime_posted AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila' as datetime_posted,
        is_completed,
        datetime_completed AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila' as datetime_completed,
        is_committed,
        datetime_committed AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila' as datetime_committed,
        remarks,
        additional_remarks,
        created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Manila' as created_at
    from 
        reading_details
    order by 
        zone_code::int, 
        book_code::int
    `);

export const viewMeterReadingScheduleSummary = pgView("view_meter_reading_schedule_summary", {
  day: integer("schedule_day"),
  readingDate: date("reading_date"),
  dueDate: date("zone_book_due_date"),
  disconnectionDate: date("zone_book_disconnection_date"),
  zoneBooks: jsonb("zone_books").$type<{
    zone: string;
    book: string;
    area: { id: string; name: string };
  }>(),
  billed: integer("billed"),
  meterReaderId: varchar("meter_reader_id").notNull(),
  remarks: varchar("remarks"),
}).as(sql`
        select vs.schedule_day,
        vs.reading_date,
        vs.zone_book_due_date,
        vs.zone_book_disconnection_date,
        zb.zone_books,
        count(rd.account_number) filter (
            where rd.is_read = true
                and rd.is_completed = true
                and rd.is_committed = true
                and rd.is_posted = true
                and rd.created_at >= vs.reading_date
                and rd.created_at < vs.reading_date + interval '1 month'
        ) as billed,
        vs.meter_reader_id,
        vs.remarks
    from view_schedule vs
    inner join (
        select vs2.schedule_day,
            vs2.reading_date,
            vs2.meter_reader_id,
            jsonb_agg(
                jsonb_build_object(
                    'zone', vs2.zone,
                    'book', vs2.book,
                    'area', zbwa2.area
                )
            ) as zone_books
        from view_schedule vs2
        inner join view_zone_book_with_area zbwa2
            on vs2.zone = zbwa2.zone and vs2.book = zbwa2.book
        group by vs2.schedule_day, vs2.reading_date, vs2.meter_reader_id
    ) zb on vs.schedule_day = zb.schedule_day
        and vs.reading_date = zb.reading_date
        and vs.meter_reader_id = zb.meter_reader_id
    left join reading_details rd
        on vs.zone = lpad(rd.zone_code, 2, '0') and vs.book = rd.book_code
    group by vs.schedule_day,
            vs.reading_date,
            vs.zone_book_due_date,
            vs.zone_book_disconnection_date,
            zb.zone_books,
            vs.meter_reader_id,
            vs.remarks
    order by vs.schedule_day
`);
