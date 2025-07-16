DROP VIEW "public"."view_meter_reader_zone_book";--> statement-breakpoint
CREATE VIEW "public"."view_meter_reader_zone_book" AS (
  select 
    mr.meter_reader_id,
    mr.employee_id,
    mr.mobile_number,
    mr.rest_day,
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
    ) as "zoneBooks"
  from 
    meter_readers mr
  left join 
    meter_reader_zone_book mrzb on mr.meter_reader_id = mrzb.meter_reader_id
  left join 
    view_zone_book_with_area vzbwa on mrzb.zone = vzbwa.zone and  mrzb.book = vzbwa.book
  group by 
    mr.meter_reader_id, 
    mr.employee_id, 
    mr.mobile_number, 
    mr.rest_day
  );