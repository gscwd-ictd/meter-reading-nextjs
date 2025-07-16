import { ScheduleMeterReading } from "@/server/types/consumer.type";
import { sql } from "drizzle-orm";
import { date, jsonb, pgView, varchar } from "drizzle-orm/pg-core";

export const consumerDetailsView = pgView("view_consumer_details", {
  readingDate: date("reading_date"),
  meterReaderId: varchar("meter_reader_id", { length: 255 }),
  zoneBooks: jsonb("zoneBooks").$type<ScheduleMeterReading[]>(),
}).as(sql`
      SELECT
  sc.reading_date AS "reading_date",
  smr.meter_reader_id AS "meter_reader_id",
  json_agg(
    jsonb_build_object(
      'zone', szb.zone,
      'book', szb.book,
      'dueDate', szb.due_date,
      'disconnectionDate', szb.disconnection_date,
      'accounts', (
        SELECT json_agg(
          jsonb_build_object(
            'accountNumber', vmr.account_no,
            'checkDigit', vmr.check_digit,
            'consumerName', vmr.consumer_name,
            'isSenior', vmr."isSenior",
            'contactNumber', vmr.contact_no,
            'address', vmr.address,
            'classification', vmr.classification,
            'consumerType', vmr.consumer_type,
            'zone', vmr.zone_code,
            'book', vmr.book_code,
            'sequenceNumber', vmr."SeqNo",
            'meterNumber', vmr.meter_no,
            'meterCode', vmr.meter_code,
            'meterSize', vmr.meter_size,
            'isConnected', vmr.is_connected,
            'dateConnected', vmr.date_connected,
            'disconnectionDate', vmr.disconnect_date,
            'averageUsage', vmr."AverageUsage",
            'waterBalance', vmr.water_balance,
            'otherBalance', vmr.other_balance,
            'previousReading', vmr.previous_reading,
            'usage', jsonb_build_object(
              'firstMonth', vcu.month1_usage,
              'secondMonth', vcu.month2_usage,
              'thirdMonth', vcu.month3_usage,
              'fourthMonth', vcu.month4_usage
            ),
            'history', jsonb_build_object(
              'firstService', vls.services1,
              'secondService', vls.services2,
              'thirdService', vls.services3
            )
          )
        )
        FROM "viewMeterReading" vmr
        LEFT JOIN "viewConsumer_previous_4_months" vcu ON vmr.account_no = vcu.account_no
        LEFT JOIN "viewCustomer_ledger_services" vls ON vmr.account_no = vls.account_no
        WHERE vmr.zone_code::text = szb.zone AND vmr.book_code::text = szb.book
      )
    )
  ) AS "zoneBooks"
FROM schedules sc
LEFT JOIN schedule_meter_readers smr ON sc.schedule_id = smr.schedule_id
LEFT JOIN schedule_zone_books szb ON smr.schedule_meter_reader_id = szb.schedule_meter_reader_id
GROUP BY sc.reading_date, smr.meter_reader_id`);
