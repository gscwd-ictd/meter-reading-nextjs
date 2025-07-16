DROP VIEW "public"."view_meter_reader_zone_book";--> statement-breakpoint
CREATE VIEW "public"."view_meter_reader_zone_book" AS (
    select mr.meter_reader_id,
          mr.employee_id,
          mr.mobile_number,
          mr.rest_day,
          jsonb_agg(
                  jsonb_build_object(
                          'zone', mrzb.zone,
                            'book', mrzb.book,
                            'zoneBook', mrzb.zone || '-' || mrzb.book,
                            'area', coalesce(vzbwa.area, '')
                  )
          ) as "zoneBooks"
    from meter_readers mr
            inner join meter_reader_zone_book mrzb on mr.meter_reader_id = mrzb.meter_reader_id
            left join view_zone_book_with_area vzbwa on mrzb.zone = vzbwa.zone and  mrzb.book = vzbwa.zone
    group by mr.meter_reader_id, mr.employee_id, mr.mobile_number, mr.rest_day
  );