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
import { viewReadingAccountProgress, viewReadingZoneBookProgress } from "@mr/server/db/schemas/reports";
import { meterReadingContext } from "@mr/server/context";
import { and, eq, inArray, sql } from "drizzle-orm";
import { readingDetails } from "@mr/server/db/schemas/reading-details";
import { accountHistory, usage } from "@mr/server/db/schemas/account-ledger";

export class ReportsRepository implements IReportsRepository {
  async findReadingZoneBookProgress(month: number, year: number): Promise<ReadingZoneBookProgress[]> {
    const start = `${year}-${month.toString().padStart(2, "0")}-01`;
    const endMonth = month === 12 ? 1 : month + 1;
    const endYear = month === 12 ? year + 1 : year;
    const end = `${endYear}-${endMonth.toString().padStart(2, "0")}-01`;

    const stmt = await db.pgConn
      .select()
      .from(viewReadingZoneBookProgress)
      .where(sql`reading_month >= ${start} AND reading_month < ${end}`);

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

  async updateReadingProgress(data: UpdateReadingProgress): Promise<ReadingAccountProgress[]> {
    const { meterReaderId, zone, book, readingMonth } = data;

    const [year, month] = readingMonth.split("-").map(Number);
    const start = `${year}-${month.toString().padStart(2, "0")}-01`;
    const endMonth = month === 12 ? 1 : month + 1;
    const endYear = month === 12 ? year + 1 : year;
    const end = `${endYear}-${endMonth.toString().padStart(2, "0")}-01`;

    await db.pgConn.transaction(async (tx) => {
      await tx
        .update(readingDetails)
        .set({ isCommitted: true, datetimeCommitted: sql`NOW() AT TIME ZONE 'Asia/Manila'` })
        .where(
          and(
            eq(readingDetails.meterReaderId, meterReaderId),
            eq(readingDetails.zoneCode, zone),
            eq(readingDetails.bookCode, book),
            sql`created_at >= ${start} AND created_at < ${end}`,
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
            sql`created_at >= ${start} AND created_at < ${end}`,
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
            sql`created_at >= ${start} AND created_at < ${end}`,
          ),
        );
    });

    return await this.findReadingAccountProgress(data);
  }
}
