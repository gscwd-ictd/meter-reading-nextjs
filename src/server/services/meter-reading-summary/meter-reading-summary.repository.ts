import { IMeterReadingSummaryRepository } from "@mr/server/interfaces/meter-reading-summary/meter-reading-summary.interface.repository";
import {
  BilledSummary,
  BilledSummarySchema,
  MobileSummaryReport,
  MobileSummaryReportSchema,
  NewMeterSummary,
  NewMeterSummarySchema,
  UnbilledSummary,
  UnbilledSummarySchema,
  WithRemarksSummary,
  WithRemarksSummarySchema,
} from "@mr/server/types/meter-reading-summary.type";
import db from "@mr/server/db/connections";
import { viewReadingAccountProgress } from "@mr/server/db/schemas/reports";
import { and, eq, isNotNull, ne, sql } from "drizzle-orm";
import { meterReadingContext } from "@mr/server/context";
import { BilledAccountQuery, MobileSummaryQuery } from "@mr/server/types/report.type";
import { newMeters } from "@mr/server/db/schemas/new-meters";

export class MeterReadingSummaryRepository implements IMeterReadingSummaryRepository {
  async findBilledSummary(query: BilledAccountQuery): Promise<BilledSummary[]> {
    const conditions = [
      eq(viewReadingAccountProgress.isRead, true),
      eq(viewReadingAccountProgress.isCommitted, true),
    ];

    if (query.meterReaderId) {
      conditions.push(eq(viewReadingAccountProgress.meterReaderId, query.meterReaderId));
    }

    if (query.zone && query.book) {
      conditions.push(
        eq(viewReadingAccountProgress.zone, query.zone),
        eq(viewReadingAccountProgress.book, query.book),
      );
    }

    if (query.readingMonth) {
      const [year, month] = query.readingMonth.split("-").map(Number);
      const start = `${year}-${month.toString().padStart(2, "0")}-01`;
      const endMonth = month === 12 ? 1 : month + 1;
      const endYear = month === 12 ? year + 1 : year;
      const end = `${endYear}-${endMonth.toString().padStart(2, "0")}-01`;
      conditions.push(sql`reading_month >= ${start} AND reading_month < ${end}`);
    }

    const stmt = await db.pgConn
      .select()
      .from(viewReadingAccountProgress)
      .where(and(...conditions));

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

    return BilledSummarySchema.array().parse(result);
  }

  async findUnbilledSummary(query: BilledAccountQuery): Promise<UnbilledSummary[]> {
    const conditions = [
      eq(viewReadingAccountProgress.isRead, false),
      eq(viewReadingAccountProgress.isCommitted, true),
    ];

    if (query.meterReaderId) {
      conditions.push(eq(viewReadingAccountProgress.meterReaderId, query.meterReaderId));
    }

    if (query.zone && query.book) {
      conditions.push(
        eq(viewReadingAccountProgress.zone, query.zone),
        eq(viewReadingAccountProgress.book, query.book),
      );
    }

    if (query.readingMonth) {
      const [year, month] = query.readingMonth.split("-").map(Number);
      const start = `${year}-${month.toString().padStart(2, "0")}-01`;
      const endMonth = month === 12 ? 1 : month + 1;
      const endYear = month === 12 ? year + 1 : year;
      const end = `${endYear}-${endMonth.toString().padStart(2, "0")}-01`;
      conditions.push(sql`reading_month >= ${start} AND reading_month < ${end}`);
    }

    const stmt = await db.pgConn
      .select()
      .from(viewReadingAccountProgress)
      .where(and(...conditions));

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

    return UnbilledSummarySchema.array().parse(result);
  }

  async findWithRemarksSummary(query: BilledAccountQuery): Promise<WithRemarksSummary[]> {
    const conditions = [
      eq(viewReadingAccountProgress.isRead, false),
      eq(viewReadingAccountProgress.isCommitted, true),
      ne(viewReadingAccountProgress.remarks, "Normal Reading"),
      ne(viewReadingAccountProgress.remarks, ""),
      isNotNull(viewReadingAccountProgress.remarks),
    ];

    if (query.meterReaderId) {
      conditions.push(eq(viewReadingAccountProgress.meterReaderId, query.meterReaderId));
    }

    if (query.zone && query.book) {
      conditions.push(
        eq(viewReadingAccountProgress.zone, query.zone),
        eq(viewReadingAccountProgress.book, query.book),
      );
    }

    if (query.readingMonth) {
      const [year, month] = query.readingMonth.split("-").map(Number);
      const start = `${year}-${month.toString().padStart(2, "0")}-01`;
      const endMonth = month === 12 ? 1 : month + 1;
      const endYear = month === 12 ? year + 1 : year;
      const end = `${endYear}-${endMonth.toString().padStart(2, "0")}-01`;
      conditions.push(sql`reading_month >= ${start} AND reading_month < ${end}`);
    }

    const stmt = await db.pgConn
      .select()
      .from(viewReadingAccountProgress)
      .where(and(...conditions));

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

    return WithRemarksSummarySchema.array().parse(result);
  }

  async findNewMeterSummary(query: BilledAccountQuery): Promise<NewMeterSummary[]> {
    try {
      const conditions = [];

      if (query.meterReaderId) {
        conditions.push(eq(newMeters.meterReaderId, query.meterReaderId));
      }

      if (query.readingMonth) {
        const [year, month] = query.readingMonth.split("-").map(Number);
        const start = `${year}-${month.toString().padStart(2, "0")}-01`;
        const endMonth = month === 12 ? 1 : month + 1;
        const endYear = month === 12 ? year + 1 : year;
        const end = `${endYear}-${endMonth.toString().padStart(2, "0")}-01`;
        conditions.push(sql`date_time >= ${start} AND date_time < ${end}`);
      }

      const stmt = await db.pgConn
        .select()
        .from(newMeters)
        .where(and(...conditions));

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

      return NewMeterSummarySchema.array().parse(result);
    } catch (error) {
      throw error;
    }
  }

  async mobileSummaryReport(data: MobileSummaryQuery): Promise<MobileSummaryReport> {
    const billed = await db.pgConn
      .select()
      .from(viewReadingAccountProgress)
      .where(
        and(
          eq(viewReadingAccountProgress.meterReaderId, data.meterReaderId),
          eq(viewReadingAccountProgress.isRead, true),
          eq(viewReadingAccountProgress.isCompleted, true),
          sql`date( ${viewReadingAccountProgress.datetimeCompleted} ) = ${data.datetimeCompleted} `,
        ),
      );

    const [totalBilled] = await db.pgConn
      .select({
        totalAccounts: sql<number>`count(${viewReadingAccountProgress.accountNumber})`,
        totalBilledAmount: sql<number>`coalesce(sum(${viewReadingAccountProgress.billedAmount}), 0)`,
        totalUsage: sql<number>`
                  coalesce(sum(
                    CASE 
                      WHEN ${viewReadingAccountProgress.currentReading} IS NULL THEN 0
                      WHEN ${viewReadingAccountProgress.previousReading} IS NULL THEN 0
                      WHEN ${viewReadingAccountProgress.currentReading} <= ${viewReadingAccountProgress.previousReading} THEN 0
                      ELSE ${viewReadingAccountProgress.currentReading} - ${viewReadingAccountProgress.previousReading}
                    END
                  ), 0)`,
      })
      .from(viewReadingAccountProgress)
      .where(
        and(
          eq(viewReadingAccountProgress.meterReaderId, data.meterReaderId),
          eq(viewReadingAccountProgress.isCompleted, true),
          eq(viewReadingAccountProgress.isRead, true),
          sql`date(${viewReadingAccountProgress.datetimeCompleted}) = date(${data.datetimeCompleted})`,
        ),
      );

    const unbilled = await db.pgConn
      .select()
      .from(viewReadingAccountProgress)
      .where(
        and(
          eq(viewReadingAccountProgress.meterReaderId, data.meterReaderId),
          eq(viewReadingAccountProgress.isRead, false),
          eq(viewReadingAccountProgress.isCompleted, true),
          sql`date( ${viewReadingAccountProgress.datetimeCompleted} ) = ${data.datetimeCompleted} `,
        ),
      );

    const [totalUnbilled] = await db.pgConn
      .select({
        totalAccounts: sql<number>`count(${viewReadingAccountProgress.accountNumber})`,
      })
      .from(viewReadingAccountProgress)
      .where(
        and(
          eq(viewReadingAccountProgress.meterReaderId, data.meterReaderId),
          eq(viewReadingAccountProgress.isCompleted, true),
          eq(viewReadingAccountProgress.isRead, false),
          sql`date(${viewReadingAccountProgress.datetimeCompleted}) = date(${data.datetimeCompleted})`,
        ),
      );

    const withRemarks = await db.pgConn
      .select()
      .from(viewReadingAccountProgress)
      .where(
        and(
          eq(viewReadingAccountProgress.meterReaderId, data.meterReaderId),
          ne(viewReadingAccountProgress.remarks, "Normal Reading"),
          ne(viewReadingAccountProgress.remarks, ""),
          isNotNull(viewReadingAccountProgress.remarks),
          sql`date( ${viewReadingAccountProgress.datetimeCompleted} ) = ${data.datetimeCompleted} `,
        ),
      );

    const [totalWithRemarks] = await db.pgConn
      .select({
        totalAccounts: sql<number>`count(${viewReadingAccountProgress.accountNumber})`,
      })
      .from(viewReadingAccountProgress)
      .where(
        and(
          eq(viewReadingAccountProgress.meterReaderId, data.meterReaderId),
          ne(viewReadingAccountProgress.remarks, "Normal Reading"),
          ne(viewReadingAccountProgress.remarks, ""),
          sql`date(${viewReadingAccountProgress.datetimeCompleted}) = date(${data.datetimeCompleted})`,
        ),
      );

    return MobileSummaryReportSchema.parse({
      billed: {
        accounts: billed,
        totalAccounts: totalBilled.totalAccounts,
        totalBilledAmount: totalBilled.totalBilledAmount,
        totalUsage: totalBilled.totalUsage,
      },
      unbilled: {
        accounts: unbilled,
        totalAccounts: totalUnbilled.totalAccounts,
      },
      withRemarks: {
        accounts: withRemarks,
        totalAccounts: totalWithRemarks.totalAccounts,
      },
    });
  }
}
