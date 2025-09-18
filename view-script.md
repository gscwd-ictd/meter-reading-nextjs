CREATE OR REPLACE VIEW "public"."view_zone_book_with_area" AS (
  select
    coalesce(zb.id::text, '') as id,
    v.zone_code as zone,
    v.book_code::varchar as book,
    v.zone_code || '-' || v.book_code as zone_book,
    jsonb_build_object(
        'id', coalesce(a.id::text,''),
        'name', coalesce(a.name, '')
    ) as area
  from "viewZoneBook" v
  left join
    zone_book zb ON v.zone_code = zb.zone AND v.book_code::varchar = zb.book
  left join
    area a ON a.id = zb.area_id
  order by v.zone_code, v.book_code);

CREATE OR REPLACE VIEW "public"."view_meter_reader_with_zone_book" AS (
  select
    mr.id,
    mr.employee_id,
    mr.rest_day,
    la.username,
    coalesce(
      jsonb_agg(
        distinct jsonb_build_object(
          'zone', mrzb.zone,
          'book', mrzb.book,
          'zoneBook', mrzb.zone || '-' || mrzb.book,
          'area', vzbwa.area
        )
      ) filter (where mrzb.zone is not null and mrzb.book is not  null),
      '[]'::jsonb
    ) as zone_books
  from
    meter_readers mr
  inner join
    login_accounts la on mr.id = la.meter_reader_id
  left join
    meter_reader_zone_book mrzb on mr.id = mrzb.meter_reader_id
  left join
    view_zone_book_with_area vzbwa on mrzb.zone = vzbwa.zone and  mrzb.book = vzbwa.book
  group by
    mr.id,
    mr.employee_id,
    mr.rest_day,
    la.username
  );--> statement-breakpoint

CREATE OR REPLACE VIEW "public"."view_zone_book_assignment" AS (
    select
      mrzb.meter_reader_id,
      vzba.id,
      vzba.zone,
      vzba.book,
      vzba.zone_book,
      vzba.area
    from view_zone_book_with_area vzba
    left join (
      select distinct zone, book, meter_reader_id
      from meter_reader_zone_book
    ) mrzb
      on vzba.zone = mrzb.zone and vzba.book = mrzb.book
    order by vzba.zone, vzba.book
  );--> statement-breakpoint

CREATE OR REPLACE VIEW "public"."view_schedule_meter_reading_with_zone_book" AS (
      select
        smr.id,
        smr.meter_reader_id,
        extract(month from s.reading_date) as month,
        extract(year from s.reading_date) as year,
        coalesce(
            jsonb_agg(
                jsonb_build_object(
                'zone', szb.zone,
                'book', szb.book,
                'zoneBook', vzba.zone_book,
                'area', vzba.area,
                'dueDate', szb.due_date,
                'disconnectionDate', szb.disconnection_date
            )
          order by szb.zone, szb.book
        )
          FILTER ( WHERE szb.id is not null), '[]'
        ) as zone_books
      from
        schedules s
      left join
        schedule_meter_readers smr
            on s.id = smr.schedule_id
      left join
        schedule_zone_books szb
        on smr.id = szb.schedule_meter_reader_id
      left join
        view_zone_book_with_area vzba
        on szb.zone = vzba.zone and szb.book = vzba.book
      group by
        smr.id,
        smr.meter_reader_id,
        s.reading_date
  );--> statement-breakpoint

CREATE OR REPLACE VIEW "public"."view_schedule_reading" AS (
  select
    s.id,
    s.reading_date,
    s.due_date,
    s.disconnection_date,
    coalesce(
        jsonb_agg(
            jsonb_build_object(
                'scheduleMeterReaderId', smr.id,
                'id', smr.meter_reader_id,
                'zoneBooks', coalesce(zb.zone_books, '[]'::jsonb),
                'reassignment', coalesce(rj.reassignment, jsonb_build_object(
                    'remarks', null,
                    'zoneBooks', '[]'::jsonb
                ))
            )
        ) filter (where smr.id is not null),
        '[]'::jsonb
    ) as meter_readers
from schedules s
left join schedule_meter_readers smr on s.id = smr.schedule_id

-- zoneBooks lateral join
left join lateral (
    select jsonb_agg(
        jsonb_build_object(
            'zone', szb.zone,
            'book', szb.book,
            'zoneBook', vzbwa.zone_book,
            'area', vzbwa.area
        )
    ) as zone_books
    from schedule_zone_books szb
    left join view_zone_book_with_area vzbwa
      on szb.zone = vzbwa.zone
     and szb.book = vzbwa.book
    where szb.schedule_meter_reader_id = smr.id
) zb on true

-- reassignment lateral join
left join lateral (
    select jsonb_build_object(
        'id', ra.id,
        'scheduleMeterReaderId', ra.schedule_meter_reader_id,
        'remarks', ra.remarks,
        'zoneBooks', coalesce((
            select jsonb_agg(
                jsonb_build_object(
                    'zone', razb.zone,
                    'book', razb.book,
                    'meterReader', jsonb_build_object(
                        'id', razb.meter_reader_id
                    )
                )
            )
            from reassignment_zone_books razb
            where razb.reassignment_id = ra.id
        ), '[]'::jsonb)
    ) as reassignment
    from reassignments ra
    where ra.schedule_meter_reader_id = smr.id
    order by ra.id desc
    limit 1
) rj on true

group by s.id, s.reading_date, s.due_date, s.disconnection_date);--> statement-breakpoint

  CREATE OR REPLACE VIEW "public"."view_zone_book_schedule_reader" AS (
    select
        coalesce(s.id::text, '') as id,
        vzbwa.zone,
        vzbwa.book,
        vzbwa.area,
        coalesce(smr.meter_reader_id::text, '') as meter_reader_id,
        coalesce(s.reading_date::text, '') as reading_date,
        coalesce(szb.due_date::text, '') as due_date,
        coalesce(szb.disconnection_date::text,'') as disconnection_date,
        extract(month from s.reading_date) as month,
        extract(year from s.reading_date) as year
    from view_zone_book_with_area vzbwa
    left join schedule_zone_books szb
      on vzbwa.zone = szb.zone
    and vzbwa.book = szb.book
    left join schedule_meter_readers smr
      on szb.schedule_meter_reader_id = smr.id
    left join schedules s
      on smr.schedule_id = s.id
    order by vzbwa.zone, vzbwa.book
  );

CREATE OR REPLACE VIEW "public"."view_count_consumer_by_status" AS (
    select
        count(*) filter (where status = 'ACTIVE') as active,
        count(*) filter (where status = 'DISCONNECTED') as disconnected,
        count(*) filter (where status = 'WRITE-OFF') as "write_off",
        count(*) as total
    from
    "ViewCountConsumer");

CREATE OR REPLACE VIEW "public"."view_schedule_reading_account" AS (
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
  group by s.reading_date, smr.meter_reader_id);--> statement-breakpoint

CREATE OR REPLACE VIEW "public"."view_consumer_details" AS (
    select
      vmr.account_no as account_number,
      vmr.check_digit as check_digit,
      vmr.consumer_name as consumer_name,
      (vmr."isSenior" = 'True')::boolean as is_senior,
      vmr.contact_no as contact_number,
      vmr.address as address,
      vmr.classification as classification,
      vmr.consumer_type as consumer_type,
      vmr.zone_code as zone,
      vmr.book_code as book,
      vmr."SeqNo" as sequence_number,
      vmr.meter_no as meter_number,
      vmr.meter_code as meter_code,
      vmr.meter_size as meter_size,
      vmr.is_connected as is_connected,
      vmr.date_connected as date_connected,
      vmr.disconnect_date as disconnection_date,
      vmr."AverageUsage" as average_usage,
      vmr.water_balance as water_balance,
      vmr.other_balance as other_balance,
      vmr.previous_reading as previous_reading,
      vmr.previous_bill_date as previous_billing_date,
      (
        st_x(st_transform(st_setsrid(st_geomfromwkb(mll.wkb_geometry), 32651), 4326))::text || ',' ||
        st_y(st_transform(st_setsrid(st_geomfromwkb(mll.wkb_geometry), 32651), 4326))::text
      ) as location,
      jsonb_build_object(
        'firstMonth', vcu.month1_usage,
        'secondMonth', vcu.month2_usage,
        'thirdMonth', vcu.month3_usage,
        'fourthMonth', vcu.month4_usage
      ) as usage,
      jsonb_build_object(
        'firstService', vls.services1,
        'secondService', vls.services2,
        'thirdService', vls.services3
      ) as history
    from "viewMeterReading" vmr
    left join "viewConsumer_previous_4_months" vcu on vmr.account_no = vcu.account_no
    left join "viewCustomer_ledger_services" vls on vmr.account_no = vls.account_no
    left join "meter_lat_long" mll on vmr.account_no = mll.accountno
);

CREATE OR REPLACE VIEW  "public"."view_reassignment_zone_book" AS (
select
    ra.id,
    ra.schedule_meter_reader_id,
    ra.remarks,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'zone', razb.zone,
          'book', razb.book,
          'meterReader', jsonb_build_object(
            'id', razb.meter_reader_id
          )
        )
      ) filter (where razb.reassignment_id is not null),
      '[]'::jsonb
    ) as zone_books
from reassignments ra
left join reassignment_zone_books razb on ra.id = razb.reassignment_id
group by ra.id, ra.schedule_meter_reader_id, ra.remarks);
