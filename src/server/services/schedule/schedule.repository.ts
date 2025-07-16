import { meterReadingContext } from "@/server/context";
import db from "@/server/db/connection";
import {
  scheduleMeterReaders,
  scheduleReaderZoneBookView,
  schedules,
  scheduleZoneBooks,
  scheduleZoneBookView,
} from "@/server/db/schemas/schedules";
import { IScheduleRepository } from "@/server/interfaces/schedule/schedule.interface.repository";
import {
  CreateMeterReaderScheduleZoneBook,
  CreateSchedule,
  MeterReaderZoneBook,
  Schedule,
  ScheduleSchema,
} from "@/server/types/schedule.type";
import { eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class ScheduleRepository implements IScheduleRepository {
  async findScheduleByMonthYear(month: string, year: string): Promise<Schedule[]> {
    const stmt = await db.execute(sql`
      SELECT * FROM schedule_month_year_schedule
      WHERE EXTRACT(MONTH FROM schedule_month_year_schedule."readingDate") = ${Number(month)}
        AND EXTRACT(YEAR FROM schedule_month_year_schedule."readingDate") = ${Number(year)}
    `);

    const parsedResult = ScheduleSchema.array().parse(stmt.rows);

    // Now enrich meterReaders with detailed info
    const enrichedResult = await Promise.all(
      parsedResult.map(async (schedule) => {
        const enrichedMeterReaders = await Promise.all(
          schedule.meterReaders.map(async (reader) => {
            // Fetch extra meter reader details by ID
            const meterReaderDetails = await meterReadingContext
              .getMeterReaderService()
              .getMeterReaderById(reader.meterReaderId);

            // Merge details into meterReader object
            return {
              ...meterReaderDetails,
              ...reader,
            };
          }),
        );

        // Return schedule with enriched meterReaders
        return {
          ...schedule,
          meterReaders: enrichedMeterReaders,
        };
      }),
    );

    return enrichedResult;
  }

  async findScheduleByExactDate(query: string): Promise<Schedule | object> {
    const stmtQuery = await db.execute(
      sql`SELECT * FROM schedule_month_year_schedule where "readingDate" = ${query}`,
    );

    if (!stmtQuery || stmtQuery.rows.length === 0) {
      return {};
    }

    const parseResult = ScheduleSchema.parse(stmtQuery.rows[0]);

    const enrichedMeterReaders = await Promise.all(
      parseResult.meterReaders.map(async (reader) => {
        const meterReaderDetails = await meterReadingContext
          .getMeterReaderService()
          .getMeterReaderById(reader.meterReaderId);

        return {
          ...meterReaderDetails,
          ...reader,
        };
      }),
    );

    return {
      ...parseResult,
      meterReaders: enrichedMeterReaders,
    };
  }

  async createMonthYearSchedule(data: CreateSchedule[]): Promise<Schedule[]> {
    const result = await db.transaction(async (tx) => {
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
    const stmtDelete = db
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
    const stmtFind = db
      .select()
      .from(scheduleZoneBookView)
      .where(eq(scheduleZoneBookView.readingDate, query))
      .$dynamic()
      .prepare("get_schedule_by_exact_date");
    const [execute] = await stmtFind.execute();

    if (!execute) {
      throw new HTTPException(404, { message: `no schedule for the date of ${query}` });
    }

    const stmtDelete = db
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
    const stmtAssigned = db
      .select()
      .from(scheduleReaderZoneBookView)
      .where(eq(scheduleReaderZoneBookView.scheduleMeterReaderId, scheduleMeterReaderId))
      .$dynamic()
      .prepare("get_schedule_reader_zone_book_by_meter_reader_id");

    const [rawAssigned] = await stmtAssigned.execute();

    const stmtUnassigned = db
      .select()
      .from(meterReaderZoneBookView)
      .where(eq(meterReaderZoneBookView.meterReaderId, rawAssigned?.meterReaderId ?? ""))
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
    await db.transaction(async (tx) => {
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
