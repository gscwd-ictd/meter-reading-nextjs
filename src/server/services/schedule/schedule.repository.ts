import { meterReadingContext } from "@mr/server/context";
import db from "@mr/server/db/connections";
import { viewMeterReaderZoneBook } from "@mr/server/db/schemas/meter-readers";
import {
  scheduleMeterReaders,
  scheduleReaderZoneBookView,
  schedules,
  scheduleZoneBooks,
  viewScheduleReading,
} from "@mr/server/db/schemas/schedules";
import { IScheduleRepository } from "@mr/server/interfaces/schedule/schedule.interface.repository";
import {
  CreateMeterReaderScheduleZoneBook,
  CreateSchedule,
  MeterReaderZoneBook,
  ScheduleReading,
  ScheduleReadingSchema,
  ScheduleSchema,
} from "@mr/server/types/schedule.type";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class ScheduleRepository implements IScheduleRepository {
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

  async createMonthYearSchedule(data: CreateSchedule[]): Promise<ScheduleReading[]> {
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
              scheduleId: schedule.scheduleId, // Link to the schedule
              meterReaderId: reader.meterReaderId, // Reader assigned
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
