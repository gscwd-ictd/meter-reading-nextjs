CREATE VIEW "public"."view_consumer_details" AS (
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
GROUP BY sc.reading_date, smr.meter_reader_id);--> statement-breakpoint
CREATE VIEW "public"."view_meter_reader_zone_book" AS (select "meter_readers"."meter_reader_id", "meter_readers"."employee_id", "meter_readers"."mobile_number", "meter_readers"."rest_day", 
        jsonb_agg(
          jsonb_build_object(
            'zone', "meter_reader_zone_book"."zone",
            'book', "meter_reader_zone_book"."book",
            'zoneBook', "meter_reader_zone_book"."zone" || '-' || "meter_reader_zone_book"."book"
          )
        )
       as "zoneBooks" from "meter_readers" inner join "meter_reader_zone_book" on "meter_readers"."meter_reader_id" = "meter_reader_zone_book"."meter_reader_id" group by "meter_readers"."meter_reader_id", "meter_readers"."employee_id", "meter_readers"."rest_day");--> statement-breakpoint
CREATE VIEW "public"."schedule_reader_zone_book_view" AS (select "schedule_meter_readers"."schedule_meter_reader_id", "schedule_meter_readers"."meter_reader_id", 
        COALESCE(
          json_agg(
            json_build_object(
              'zone', "schedule_zone_books"."zone",
              'book', "schedule_zone_books"."book",
              'zoneBook', "schedule_zone_books"."zone" || '-' || "schedule_zone_books"."book",
              'dueDate', "schedule_zone_books"."due_date",
              'disconnectionDate', "schedule_zone_books"."disconnection_date"
            )
          ) FILTER (WHERE "schedule_zone_books"."zone" IS NOT NULL),
          '[]'::json
        )
       as "zoneBooks" from "schedule_meter_readers" left join "schedule_zone_books" on "schedule_meter_readers"."schedule_meter_reader_id" = "schedule_zone_books"."schedule_meter_reader_id" group by "schedule_meter_readers"."schedule_meter_reader_id", "schedule_meter_readers"."schedule_meter_reader_id");--> statement-breakpoint
CREATE VIEW "public"."view_zone_book_with_area" AS (
  SELECT 
    coalesce(zb.zone_book_id, '') as zone_book_id,
    v.zone_code as zone,
    v.book_code::varchar as book,
    v.zone_code || '-' || v.book_code as "zoneBook",
    coalesce(a.area_id, '') as area_id,
    coalesce(a.area,'') as area
  FROM "viewZoneBook" v
  LEFT JOIN
    zone_book zb ON v.zone_code = zb.zone AND v.book_code::varchar = zb.book
  LEFT JOIN
    area a ON a.area_id = zb.area_id
  ORDER BY v.zone_code, v.book_code);--> statement-breakpoint
CREATE VIEW "public"."schedule_zone_book_view" AS (select "reading_date", "due_date", "disconnection_date",   (
    SELECT json_agg(
      jsonb_build_object(
        'scheduleMeterReaderId', "schedule_meter_reader_id",
        'meterReaderId', "meter_reader_id",
        'zoneBooks', COALESCE((
          SELECT json_agg(
            jsonb_build_object(
              'zone', "zone",
              'book', "book",
              'zoneBook', "zone" || '-' || "book"
            )
          )
          FROM "schedule_zone_books"
          WHERE "schedule_meter_reader_id" = "schedule_meter_reader_id"
        ), '[]'::json)
      )
    )
    FROM "schedule_meter_readers"
    WHERE schedule_meter_readers.schedule_id = "schedule_id"
  )  as "meterReaders" from "schedules" order by "schedules"."reading_date");