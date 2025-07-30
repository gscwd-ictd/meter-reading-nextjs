import { meterReadingContext } from "@mr/server/context";
import db from "@mr/server/db/connections";
import {
  scheduleMeterReaders,
  schedules,
  scheduleZoneBooks,
  viewScheduleMeterReadingZoneBook,
  viewScheduleReading,
} from "@mr/server/db/schemas/schedules";
import { IScheduleRepository } from "@mr/server/interfaces/schedule/schedule.interface.repository";
import {
  CreateMeterReaderScheduleReading,
  CreateMonthSchedule,
  ScheduleMeterReaderZoneBook,
  ScheduleMeterReaderZoneBookSchema,
  ScheduleReading,
  ScheduleReadingSchema,
  ScheduleSchema,
} from "@mr/server/types/schedule.type";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class ScheduleRepository implements IScheduleRepository {
  /* for schedule */
  async findScheduleByMonthYear(month: number, year: number): Promise<ScheduleReading[]> {
    // Step 1: Query schedule readings by month & year
    const stmt = await db.pgConn
      .select()
      .from(viewScheduleReading)
      .where(
        sql`
      EXTRACT(MONTH FROM ${viewScheduleReading.readingDate}) = ${month} 
      AND EXTRACT(YEAR FROM ${viewScheduleReading.readingDate}) = ${year}
    `,
      );

    // Step 2: Validate top-level schedules structure (initial parse)
    const schedules = ScheduleSchema.array().parse(stmt);

    // Step 3: Enrich each schedule’s meterReaders with full details
    return await Promise.all(
      schedules.map(async (schedule) => {
        const meterReaders = await Promise.all(
          schedule.meterReaders.map(async (readers) => {
            const details = await meterReadingContext
              .getMeterReaderService()
              .getMeterReaderDetailsById(readers.id);
            return {
              ...readers,
              ...details,
            };
          }),
        );

        // Step 4: Re-validate the full enriched schedule
        return ScheduleReadingSchema.parse({ ...schedule, meterReaders });
      }),
    );
  }

  async findScheduleByDate(date: string): Promise<ScheduleReading | object> {
    // Step 1: Query the viewScheduleReading table for a specific reading date
    const stmt = await db.pgConn
      .select()
      .from(viewScheduleReading)
      .where(eq(viewScheduleReading.readingDate, date));

    // Step 2: If no schedule is found for that date, return an empty object
    if (stmt.length === 0) {
      return {};
    }

    // Step 3: Parse the first (and expected only) result into a strongly-typed schedule object
    const schedule = ScheduleSchema.parse(stmt[0]);

    // Step 4: For each meter reader in the schedule, fetch their full details
    const result = await Promise.all(
      schedule.meterReaders.map(async (reader) => {
        const details = await meterReadingContext
          .getMeterReaderService()
          .getMeterReaderDetailsById(reader.id);

        return {
          ...reader,
          ...details,
        };
      }),
    );

    // Step 6: Replace the original meterReaders with the enriched list and validate the full structure
    return ScheduleReadingSchema.parse({ ...schedule, meterReaders: result });
  }

  async createMonthYearSchedule(data: CreateMonthSchedule[]): Promise<ScheduleReading[]> {
    // Step 1: Extract the reading month and year from the first item in the input data
    const { month, year } = (() => {
      const date = new Date(data[0].readingDate); // Get the first reading date
      return {
        month: date.getMonth() + 1, // 0-based → 1-based (e.g. July = 7)
        year: date.getFullYear(), // e.g. 2025
      };
    })();

    // Step 2: Start a database transaction to ensure all inserts are atomic
    await db.pgConn.transaction(async (tx) => {
      // Step 3: Loop over each schedule input
      for (const item of data) {
        // Step 4: Insert a schedule record and retrieve the inserted row
        const [schedule] = await tx
          .insert(schedules)
          .values({
            readingDate: item.readingDate,
            dueDate: item.dueDate,
            disconnectionDate: item.disconnectionDate,
          })
          .returning(); // Returns the inserted schedule, including scheduleId

        // Step 5: If meter readers are assigned to this schedule, insert them
        if (item.meterReaders.length > 0) {
          await tx.insert(scheduleMeterReaders).values(
            item.meterReaders.map((reader) => ({
              scheduleId: schedule.id, // Link to the schedule
              meterReaderId: reader.id, // Reader assigned
            })),
          );
        }
      }
    });

    // Step 6: After the transaction, retrieve schedules for the month and year we extracted
    return await this.findScheduleByMonthYear(month, year);
  }

  async removeScheduleByMonthYear(month: number, year: number): Promise<ScheduleReading[]> {
    // Step 1: Find schedules for the given month and year
    const scheduleFind = await this.findScheduleByMonthYear(month, year);

    // Step 2: If no schedules found, throw a 404 error
    if (scheduleFind.length === 0) {
      throw new HTTPException(404, {
        message: `No schedules found for ${month}-${year}`,
      });
    }

    // Step 3: Prepare start and end date strings for comparison
    const paddedMonth = month.toString().padStart(2, "0");
    const start = `${year}-${paddedMonth}-01`;

    const endDate = new Date(year, month, 0); // last day of the given month
    const end = `${year}-${paddedMonth}-${endDate.getDate().toString().padStart(2, "0")}`;

    // Step 4: Run a transaction to delete all schedules within the date range
    await db.pgConn.transaction(async (tx) => {
      const stmtDelete = tx
        .delete(schedules)
        .where(
          and(
            gte(schedules.readingDate, start), // readingDate >= start
            lte(schedules.readingDate, end), // readingDate <= end
          ),
        )
        .prepare("delete_schedule_by_month_year");

      await stmtDelete.execute();
    });

    // Step 5: Return the original schedules found (before deletion)
    return scheduleFind;
  }

  async removeScheduleByDate(date: string): Promise<ScheduleReading | object> {
    const scheduleFind = await this.findScheduleByDate(date);

    if (!scheduleFind || Object.keys(scheduleFind).length === 0) {
      throw new HTTPException(404, { message: `No schedule found for ${date}` });
    }

    await db.pgConn
      .delete(schedules)
      .where(eq(schedules.readingDate, date))
      .prepare("get_schedule_by_exact_date")
      .execute();

    return scheduleFind;
  }

  /* for schedule meter reader */
  async findMeterReaderZoneBookByScheduleMeterReaderId(
    scheduleMeterReaderId: string,
  ): Promise<ScheduleMeterReaderZoneBook> {
    const [assigned] = await db.pgConn
      .select()
      .from(viewScheduleMeterReadingZoneBook)
      .where(eq(viewScheduleMeterReadingZoneBook.scheduleMeterReaderId, scheduleMeterReaderId));

    // const unassigned = await db.pgConn.execute(
    //   sql`select distinct zone, book, area, zone_book as "zoneBook" from get_schedule_meter_reader_zone_book_status(${scheduleMeterReaderId},'unassigned')`,
    // );

    const unassigned = await db.pgConn.execute(
      sql`select * from get_schedule_unassigned_zone_books( ${assigned.month},  ${assigned.year}, ${assigned.meterReaderId})`,
    );
    // const preAssigned = await db.pgConn.execute(sql`select
    //                     szb.zone,
    //                     szb.book
    //                 from
    //                     schedules s
    //                 left join
    //                         schedule_meter_readers smr
    //                             on s.id = smr.schedule_id
    //                 left join
    //                         schedule_zone_books szb
    //                             on smr.id = szb.schedule_meter_reader_id
    //                 left join
    //                         view_zone_book_with_area vzba
    //                             on szb.zone = vzba.zone and szb.book = vzba.book
    //               where extract(month from s.reading_date) = ${assigned.month}
    //               and extract(year from s.reading_date) = ${assigned.year}
    //               and smr.meter_reader_id = ${assigned.meterReaderId}`);

    // const preDefault = await db.pgConn.execute(
    //   sql`select * from view_meter_reader_with_zone_book where id = ${assigned.meterReaderId}`,
    // );

    // const preDefaultZoneBooks = preDefault.rows[0]?.zone_books ?? [];

    // const assignedZoneBookKeys = preAssigned.rows.map((item) => `${item.zone}-${item.book}`);

    // // Filter out those in preAssigned
    // const unassigned = preDefaultZoneBooks.filter(
    //   (item: any) => !assignedZoneBookKeys.includes(`${item.zone}-${item.book}`),
    // );

    // return ScheduleMeterReaderZoneBookSchema.parse({
    //   assigned: assigned.zoneBooks,
    //   unassigned: preAssigned,
    // });

    return {
      assigned: assigned.zoneBooks,
      unassigned: unassigned.rows,
    };
  }

  async createMeterReaderScheduleZoneBook(
    data: CreateMeterReaderScheduleReading,
  ): Promise<ScheduleMeterReaderZoneBook> {
    // Step 1: Destructure the input data
    const { scheduleMeterReaderId, zoneBooks } = data;

    // Step 2: Prepare the zoneBooks data for insertion
    const insertZoneBook = zoneBooks.map(({ zone, book, dueDate, disconnectionDate }) => ({
      scheduleMeterReaderId,
      zone,
      book,
      dueDate,
      disconnectionDate,
    }));

    // Step 3: Execute a database transaction
    await db.pgConn.transaction(async (tx) => {
      // Step 3a: Delete existing entries for the scheduleMeterReaderId
      await tx
        .delete(scheduleZoneBooks)
        .where(eq(scheduleZoneBooks.scheduleMeterReaderId, scheduleMeterReaderId));

      // Step 3b: Insert new zoneBooks if there are any
      if (insertZoneBook.length > 0) {
        await tx.insert(scheduleZoneBooks).values(insertZoneBook);
      }
    });

    // Step 4: Return the inserted zone book records
    return await this.findMeterReaderZoneBookByScheduleMeterReaderId(scheduleMeterReaderId);
  }

  /* 
            sql function do not delete please
create or replace function get_schedule_unassigned_zone_books(
  input_month int,
  input_year int,
  input_meter_reader_id uuid
)
returns table(zone varchar, book varchar, area jsonb) as $$
begin
  return query
  with schedule_meter_reader_assigned_zone_books as (
    select
      coalesce(szb.zone, '') as zone,
      coalesce(szb.book, '') as book
    from schedules s
    left join schedule_meter_readers smr on s.id = smr.schedule_id
    left join schedule_zone_books szb on smr.id = szb.schedule_meter_reader_id
    where
      extract(month from s.reading_date) = input_month and
      extract(year from s.reading_date) = input_year and
      smr.meter_reader_id = input_meter_reader_id
  ),
  predefault_meter_reader_zone_book as (
    select
      mrzb.zone,
      mrzb.book,
      vzbwa.area
    from meter_readers mr
    inner join meter_reader_zone_book mrzb on mr.id = mrzb.meter_reader_id
      left join view_zone_book_with_area vzbwa
    on vzbwa.zone = mrzb.zone and vzbwa.book = mrzb.book
    where mr.id = input_meter_reader_id
  )
  select
    pmrzb.zone,
    pmrzb.book,
    pmrzb.area
  from predefault_meter_reader_zone_book pmrzb
  left join schedule_meter_reader_assigned_zone_books smrazb
    on pmrzb.zone = smrazb.zone and pmrzb.book = smrazb.book
  where smrazb.zone is null;
end;
$$ language plpgsql;

select * from get_schedule_unassigned_zone_books(7,2025, 'b0156f0a-282c-4fe4-9e49-a22985a5b962');




    */
}
