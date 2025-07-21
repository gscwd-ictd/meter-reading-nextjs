import { meterReadingContext } from "@mr/server/context";
import db from "@mr/server/db/connections";
import { viewMeterReaderZoneBook } from "@mr/server/db/schemas/meter-readers";
import {
  scheduleMeterReaders,
  scheduleReaderZoneBookView,
  schedules,
  scheduleZoneBooks,
  scheduleZoneBookView,
  viewScheduleReading,
} from "@mr/server/db/schemas/schedules";
import { IScheduleRepository } from "@mr/server/interfaces/schedule/schedule.interface.repository";
import {
  CreateMeterReaderScheduleZoneBook,
  CreateSchedule,
  MeterReaderZoneBook,
  Schedule,
  ScheduleReading,
  ScheduleReadingSchema,
  ScheduleSchema,
} from "@mr/server/types/schedule.type";
import { eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class ScheduleRepository implements IScheduleRepository {
  async findScheduleByMonthYear(month: string, year: string): Promise<ScheduleReading[]> {
    // Step 1: Query schedule readings by month & year
    const stmt = await db.pgConn
      .select()
      .from(viewScheduleReading)
      .where(
        sql`
      EXTRACT(MONTH FROM ${viewScheduleReading.readingDate}) = ${Number(month)} 
      AND EXTRACT(YEAR FROM ${viewScheduleReading.readingDate}) = ${Number(year)}
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
              .getMeterReaderDetailsById(readers.meterReaderId);
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

  async findScheduleByExactDate(query: string): Promise<ScheduleReading | object> {
    // Step 1: Query the viewScheduleReading table for a specific reading date
    const stmt = await db.pgConn
      .select()
      .from(viewScheduleReading)
      .where(eq(viewScheduleReading.readingDate, query));

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
          .getMeterReaderDetailsById(reader.meterReaderId);

        return {
          ...reader,
          ...details,
        };
      }),
    );

    // Step 6: Replace the original meterReaders with the enriched list and validate the full structure
    return ScheduleReadingSchema.parse({ ...schedule, meterReaders: result });
  }

  async createMonthYearSchedule(data: CreateSchedule[]): Promise<Schedule[]> {
    const result = await db.pgConn.transaction(async (tx) => {
      for (const item of data) {
        const [schedule] = await tx
          .insert(schedules)
          .values({
            readingDate: item.readingDate,
            dueDate: item.dueDate,
            disconnectionDate: item.disconnectionDate,
          })
          .returning();

        if (item.meterReaders.length > 0) {
          await tx.insert(scheduleMeterReaders).values(
            item.meterReaders.map((reader) => ({
              scheduleId: schedule.scheduleId,
              meterReaderId: reader.meterReaderId,
            })),
          );
        }
      }

      // Extract month and year from the first item's reading date
      const firstDate = new Date(data[0].readingDate);
      return {
        month: (firstDate.getMonth() + 1).toString().padStart(2, "0"),
        year: firstDate.getFullYear().toString(),
      };
    });

    // After transaction: retrieve records for that month and year
    const findReading = await this.findScheduleByMonthYear(result.month, result.year);
    return findReading;
  }

  async removeScheduleByMonthYear(month: string, year: string): Promise<Schedule[]> {
    const scheduleFind = await this.findScheduleByMonthYear(month, year);

    if (scheduleFind.length === 0) {
      throw new HTTPException(404, { message: `No schedules found for ${month}-${year}` });
    }

    // Step 2: Delete from `schedules` table based on readingDate
    const stmtDelete = db.pgConn
      .delete(schedules) // ← this should be your actual table
      .where(
        sql`EXTRACT(MONTH FROM ${schedules.readingDate}) = ${Number(month)} 
             AND EXTRACT(YEAR FROM ${schedules.readingDate}) = ${Number(year)}`,
      )
      .returning()
      .prepare("delete_schedule_by_month_year");

    await stmtDelete.execute(); // return deleted rows

    return scheduleFind;
  }

  async removeSchedueByExactDate(query: string): Promise<Schedule> {
    const stmtFind = db.pgConn
      .select()
      .from(scheduleZoneBookView)
      .where(eq(scheduleZoneBookView.readingDate, query))
      .$dynamic()
      .prepare("get_schedule_by_exact_date");
    const [execute] = await stmtFind.execute();

    if (!execute) {
      throw new HTTPException(404, { message: `no schedule for the date of ${query}` });
    }

    const stmtDelete = db.pgConn
      .delete(schedules)
      .where(eq(scheduleZoneBookView.readingDate, query))
      .returning()
      .prepare("get_schedule_by_exact_date");

    await stmtDelete.execute(); // return deleted rows

    return ScheduleSchema.parse(execute);
  }

  async findMeterReaderZoneBookByScheduleMeterReaderId(
    scheduleMeterReaderId: string,
  ): Promise<MeterReaderZoneBook> {
    const stmtAssigned = db.pgConn
      .select()
      .from(scheduleReaderZoneBookView)
      .where(eq(scheduleReaderZoneBookView.scheduleMeterReaderId, scheduleMeterReaderId))
      .$dynamic()
      .prepare("get_schedule_reader_zone_book_by_meter_reader_id");

    const [rawAssigned] = await stmtAssigned.execute();

    const stmtUnassigned = db.pgConn
      .select()
      .from(viewMeterReaderZoneBook)
      .where(eq(viewMeterReaderZoneBook.meterReaderId, rawAssigned?.meterReaderId ?? ""))
      .$dynamic()
      .prepare("get_meter_reader_zone_book_view_by_meter_id");

    const [rawUnassigned] = await stmtUnassigned.execute();

    return {
      assigned: rawAssigned?.zoneBooks ?? [],
      unassigned: rawUnassigned?.zoneBooks ?? [],
    };
  }

  async createMeterReaderScheduleZoneBook(
    input: CreateMeterReaderScheduleZoneBook,
  ): Promise<MeterReaderZoneBook> {
    const { scheduleMeterReaderId, zoneBooks } = input;

    // Prepare insertable data
    const insertData = zoneBooks.map(({ zone, book, dueDate, disconnectionDate }) => ({
      scheduleMeterReaderId,
      zone,
      book,
      dueDate,
      disconnectionDate,
    }));

    // Perform transaction: delete old entries, insert new ones
    await db.pgConn.transaction(async (tx) => {
      await tx
        .delete(scheduleZoneBooks)
        .where(eq(scheduleZoneBooks.scheduleMeterReaderId, scheduleMeterReaderId));

      if (insertData.length > 0) {
        await tx.insert(scheduleZoneBooks).values(insertData);
      }
    });

    // Fetch and return updated data
    return this.findMeterReaderZoneBookByScheduleMeterReaderId(scheduleMeterReaderId);
  }

  /* 
    assigned = get all assigned zone books by schedule meter reader zone book 

    
  
  */
}
