import { sql } from "drizzle-orm";
import { date, jsonb, pgView, varchar } from "drizzle-orm/pg-core";

export const consumerDetailsView = pgView("view_consumer_details", {
  readingDate: date("reading_date"),
  meterReaderId: varchar("meter_reader_id", { length: 255 }),
  zoneBooks: jsonb("zoneBooks"),
}).as(sql`
  select
    s.reading_date as reading_date,
    smr.meter_reader_id as meter_reader_id,
    coalesce(
      json_agg(
          jsonb_build_object(
            'zone', szb.zone,
            'book', szb.book,
            'area', vzbwa.area,
            'dueDate', szb.due_date,
            'disconnectionDate', szb.disconnection_date,
            'accounts', (
              select json_agg(
                jsonb_build_object(
                  'accountNumber', vmr.account_no,
                  'checkDigit', vmr.check_digit,
                  'consumerName', vmr.consumer_name,
                  'isSenior', (vmr."isSenior" = 'True')::boolean,
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
                  'previousBillingDate', vmr.previous_bill_date,
                  'location',
                  (st_x(st_transform(st_setsrid(st_geomfromwkb(mll.wkb_geometry), 32651), 4326))::text || ',' ||
                  st_y(st_transform(st_setsrid(st_geomfromwkb(mll.wkb_geometry), 32651), 4326))::text),
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
                  ),
                  'billingAdjustments', (
                    select coalesce(
                        jsonb_agg(
                            jsonb_build_object(
                                'name', ba.name,
                                'percentage', ba.percentage
                            ) order by ba.name
                        ),
                        '[]'::jsonb
                    )
                    from billing_adjustments ba
                  )
                )
              )
              from "viewMeterReading" vmr
              left join "viewConsumer_previous_4_months" vcu on vmr.account_no = vcu.account_no
              left join "viewCustomer_ledger_services" vls on vmr.account_no = vls.account_no
              left join "meter_lat_long" mll on vmr.account_no = mll.accountno
              where vmr.zone_code::text = szb.zone and vmr.book_code::text = szb.book
            )
          )
        )
        filter (where szb.zone is not null and szb.book is not null), '[]'::json
    ) as "zoneBooks"
  from schedules s
  left join schedule_meter_readers smr on s.id = smr.schedule_id
  left join schedule_zone_books szb on smr.id = szb.schedule_meter_reader_id
  left join view_zone_book_with_area vzbwa on vzbwa.zone = szb.zone and vzbwa.book = szb.book
  group by s.reading_date, smr.meter_reader_id`);
