import { IReportsRepository } from "@mr/server/interfaces/reports/reports.interface.repository";
import {
  ReadingAccountProgress,
  ReadingAccountProgressSchema,
  ReadingAccountQuery,
  ReadingZoneBookProgress,
  ReadingZoneBookProgressSchema,
  UpdateReadingProgress,
} from "@mr/server/types/report.type";
import db from "@mr/server/db/connections";
import {
  viewMeterReadingScheduleSummary,
  viewReadingAccountProgress,
  viewReadingZoneBookProgress,
} from "@mr/server/db/schemas/reports";
import { meterReadingContext } from "@mr/server/context";
import { and, eq, sql } from "drizzle-orm";
import { readingDetails } from "@mr/server/db/schemas/reading-details";
import { accountHistory, usage } from "@mr/server/db/schemas/account-ledger";
import { addMonths, format, startOfMonth } from "date-fns";
import { AccountReadingDetails } from "@mr/server/types/reading-details.type";
import { ReadingDetails } from "@mr/lib/validators/reading-details-schema";
import { viewScheduleReading } from "@mr/server/db/schemas/schedules";
import { ScheduleReading, ScheduleReadingSchema, ScheduleSchema } from "@mr/server/types/schedule.type";

export class ReportsRepository implements IReportsRepository {
  async findReadingZoneBookProgress(month: number, year: number): Promise<ReadingZoneBookProgress[]> {
    const start = `${year}-${month.toString().padStart(2, "0")}-01`;
    const endMonth = month === 12 ? 1 : month + 1;
    const endYear = month === 12 ? year + 1 : year;
    const end = `${endYear}-${endMonth.toString().padStart(2, "0")}-01`;

    const stmt = await db.pgConn
      .select()
      .from(viewReadingZoneBookProgress)
      .where(
        and(
          sql`reading_month >= ${start} AND reading_month < ${end}`,
          sql`reading_date >= ${start} AND reading_date <${end}`,
        ),
      );

    // Map results to include meter reader details
    const result = await Promise.all(
      stmt.map(async (item) => {
        const details = await meterReadingContext
          .getMeterReaderService()
          .getMeterReaderDetailsById(item.meterReaderId);

        return {
          meterReader: {
            id: details.id,
            name: details.name,
          },
          ...item,
        };
      }),
    );

    return ReadingZoneBookProgressSchema.array().parse(result);
  }

  async findReadingAccountProgress(query: ReadingAccountQuery): Promise<ReadingAccountProgress[]> {
    const { meterReaderId, zone, book, readingMonth } = query;

    const [year, month] = readingMonth.split("-").map(Number);
    const start = `${year}-${month.toString().padStart(2, "0")}-01`;
    const endMonth = month === 12 ? 1 : month + 1;
    const endYear = month === 12 ? year + 1 : year;
    const end = `${endYear}-${endMonth.toString().padStart(2, "0")}-01`;

    const stmt = await db.pgConn
      .select()
      .from(viewReadingAccountProgress)
      .where(
        and(
          eq(viewReadingAccountProgress.meterReaderId, meterReaderId),
          eq(viewReadingAccountProgress.zone, zone),
          eq(viewReadingAccountProgress.book, book),
          sql`reading_month >= ${start} AND reading_month < ${end}`,
        ),
      );

    // Map results to include meter reader details
    const result = await Promise.all(
      stmt.map(async (item) => {
        const details = await meterReadingContext
          .getMeterReaderService()
          .getMeterReaderDetailsById(item.meterReaderId);

        return {
          meterReader: {
            id: details.id,
            name: details.name,
          },
          ...item,
        };
      }),
    );

    return ReadingAccountProgressSchema.array().parse(result);
  }

  private getDateRange(readingMonth: string): { start: string; end: string } {
    const [year, month] = readingMonth.split("-").map(Number);

    const startDate = new Date(year, month - 1, 1);
    const start = format(startOfMonth(startDate), "yyyy-MM-dd");
    const end = format(addMonths(startDate, 1), "yyyy-MM-dd");

    return { start, end };
  }

  async updateReadingProgress(data: UpdateReadingProgress): Promise<ReadingAccountProgress[]> {
    const { meterReaderId, zone, book, readingMonth } = data;

    const dateRange = this.getDateRange(readingMonth);
    const dateRangeCondition = sql`created_at >= ${dateRange.start} AND created_at < ${dateRange.end}`;

    try {
      const accountsToPost = await db.pgConn.transaction(async (tx) => {
        await tx
          .update(readingDetails)
          .set({ isCommitted: true, datetimeCommitted: sql`NOW() AT TIME ZONE 'Asia/Manila'` })
          .where(
            and(
              eq(readingDetails.meterReaderId, meterReaderId),
              eq(readingDetails.zoneCode, zone),
              eq(readingDetails.bookCode, book),
              dateRangeCondition,
            ),
          );

        await tx
          .update(accountHistory)
          .set({ isCommitted: true })
          .where(
            and(
              eq(accountHistory.meterReaderId, meterReaderId),
              eq(accountHistory.zoneCode, zone),
              eq(accountHistory.bookCode, book),
              dateRangeCondition,
            ),
          );

        await tx
          .update(usage)
          .set({ isCommitted: true })
          .where(
            and(
              eq(usage.meterReaderId, meterReaderId),
              eq(usage.zoneCode, zone),
              eq(usage.bookCode, book),
              dateRangeCondition,
            ),
          );

        return await tx
          .select()
          .from(readingDetails)
          .where(
            and(
              eq(readingDetails.isRead, true),
              eq(readingDetails.isCompleted, true),
              eq(readingDetails.isCommitted, true),
              eq(readingDetails.meterReaderId, meterReaderId),
              eq(readingDetails.zoneCode, zone),
              eq(readingDetails.bookCode, book),
              dateRangeCondition,
              sql`current_usage >= 0`,
            ),
          );
      });

      // Post to MSSQL outside transaction
      const meterReader = await meterReadingContext
        .getMeterReaderService()
        .getMeterReaderDetailsById(meterReaderId);

      const reformatName = (fullName: string): string => {
        const [lastName, rest] = fullName.split(", ");
        const parts = rest.trim().split(" ");
        const firstName = parts[0];
        const middle = parts.slice(1).join(" ");
        return `${firstName} ${middle} ${lastName}`.trim();
      };

      // "Artajo, Charlesbe D." → "Charlesbe D. Artajo"
      const meterReaderName = reformatName(meterReader.name);

      await this.postAccountsSequentially(accountsToPost, meterReaderName);

      return await this.findReadingAccountProgress(data);
    } catch (error) {
      console.error("Failed to update reading progress:", error);
      throw new Error(
        `Reading progress update failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  private async postAccountsSequentially(accounts: ReadingDetails[], meterReaderName: string): Promise<void> {
    for (const account of accounts) {
      try {
        await db.pgConn
          .update(readingDetails)
          .set({ isPosted: true, datetimePosted: sql`NOW() AT TIME ZONE 'Asia/Manila'` })
          .where(eq(readingDetails.id, account.id));

        await this.postedAccounts(account, meterReaderName);
        // Add delay between each account
        //await new Promise((resolve) => setTimeout(resolve, 5500));
      } catch (error) {
        console.error(`Failed to post account ${account.accountNumber}:`, error);
        // Consider: retry logic, dead letter queue, or continue with next
        throw error;
      }
    }
  }

  async postedAccounts(data: AccountReadingDetails, meterReaderName: string): Promise<void> {
    const readingDate = data.readingDate ? format(data.readingDate, "MM/dd/yyyy") : "";
    const dueDate = data.dueDate ? format(data.dueDate, "MM/dd/yyyy") : "";
    const disconnectionDate = data.disconnectionDate ? format(data.disconnectionDate, "MM/dd/yyyy") : "";
    const timeStart = data.timeStart ? format(data.timeStart, "MM/dd/yyyy h:mm a") : "";
    const timeEnd = data.timeEnd ? format(data.timeEnd, "MM/dd/yyyy h:mm a") : "";
    const currentUsage = data.currentUsage ?? 0;

    let billNumber;
    const date = new Date();
    const monthYear = date.getFullYear() * 100 + (date.getMonth() + 1);
    const maxBill = await db.mssqlConn
      .query`select max(bill_no) as max_bill from transactions_history where bill_no like ${monthYear.toString() + "%"}`;
    if (maxBill.recordset[0].max_bill != null) {
      billNumber = maxBill.recordset[0].max_bill + 1;
    } else {
      billNumber = parseInt(monthYear.toString() + "000001");
    }

    try {
      const res = await db.mssqlConn.query`
          EXEC post2Ledger
            @accountNo = ${data.accountNumber},
            @readingDate = ${readingDate},
            @billDate = ${readingDate},
            @dueDate = ${dueDate},
            @disconDate = ${disconnectionDate},
            @presentReading = ${data.currentReading},
            @previousReading = ${data.previousReading},
            @presentUsage = ${currentUsage},
            @billedAmount = ${data.billedAmount},
            @penaltyAmount = ${data.penaltyAmount},
            @meterReader = ${meterReaderName},
            @seniorDiscount = ${data.seniorDiscount},
            @changeMeterAmount = ${data.changeMeterAmount},
            @arrears = ${data.arrears},
            @remarks = ${data.remarks},
            @timeStart = ${timeStart},
            @timeEnd = ${timeEnd},
            @billNo = ${billNumber.toString()}`;

      console.log(billNumber);
      console.log(res.recordset);
      console.log(`Successfully posted account ${data.accountNumber}`, res.recordsets);
    } catch (error) {
      console.error(`MSSQL post2Ledger failed for account ${data.accountNumber}:`, error);
      throw error;
    }
  }

  // view_meter_reading_schedule_summary
  async meterReadingScheduleSummary(month: number, year: number): Promise<ScheduleReading[]> {
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
        const meterReaders = (
          await Promise.all(
            schedule.meterReaders.map(async (readers) => {
              const details = await meterReadingContext
                .getMeterReaderService()
                .getMeterReaderDetailsById(readers.id);
              return {
                ...readers,
                ...details,
              };
            }),
          )
        ).sort((a, b) => a.name.localeCompare(b.name)); // 👈 sort here

        return ScheduleReadingSchema.parse({ ...schedule, meterReaders });
      }),
    );
  }
}
