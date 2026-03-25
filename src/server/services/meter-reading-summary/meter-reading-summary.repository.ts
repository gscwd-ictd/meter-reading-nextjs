import { IMeterReadingSummaryRepository } from "@mr/server/interfaces/meter-reading-summary/meter-reading-summary.interface.repository";
import {
  BilledSummary,
  BilledSummarySchema,
  MobileSummaryReport,
  MobileSummaryReportSchema,
  NewMeterSummary,
  NewMeterSummarySchema,
  Report,
  ReportSchema,
  UnbilledSummary,
  UnbilledSummarySchema,
  WithRemarksSummary,
  WithRemarksSummarySchema,
  ZoneBookSummaryRow,
  ZoneBookSummaryRowSchema,
} from "@mr/server/types/meter-reading-summary.type";
import db from "@mr/server/db/connections";
import { viewReadingAccountProgress } from "@mr/server/db/schemas/reports";
import { and, eq, isNotNull, ne, sql } from "drizzle-orm";
import { meterReadingContext } from "@mr/server/context";
import { BilledAccountQuery, MobileSummaryQuery } from "@mr/server/types/report.type";
import { newMeters } from "@mr/server/db/schemas/new-meters";
import {
  RawRow,
  transformBillAmount,
  transformConsumption,
  transformNoOfBills,
} from "@mr/server/types/transform";

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

  async findMonthBillingSummary(readingMonth: string): Promise<Report> {
    const [year, month] = readingMonth.split("-").map(Number);
    const start = `${year}-${month.toString().padStart(2, "0")}-01`;
    const endMonth = month === 12 ? 1 : month + 1;
    const endYear = month === 12 ? year + 1 : year;
    const end = `${endYear}-${endMonth.toString().padStart(2, "0")}-01`;

    const [billAmountResult, noOfBillsResult, consumptionResult] = await Promise.all([
      db.pgConn.execute(sql`select * from fn_bill_amount_by_classification_meter_size(${start}, ${end})`),
      db.pgConn.execute(sql`select * from fn_bill_count_by_classification_meter_size(${start}, ${end})`),
      db.pgConn.execute(sql`select * from fn_consumption_by_classification_meter_size(${start}, ${end})`),
    ]);

    return ReportSchema.parse({
      billAmount: transformBillAmount(billAmountResult.rows as RawRow[]),
      noOfBills: transformNoOfBills(noOfBillsResult.rows as RawRow[]),
      consumption: transformConsumption(consumptionResult.rows as RawRow[]),
    });
  }

  async findZoneBookSummary(readingMonth: string): Promise<ZoneBookSummaryRow[]> {
    const [year, month] = readingMonth.split("-").map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const result = await db.pgConn.execute(sql`
          select
              coalesce(zb.zone, 'grandTotal') as zone,
              coalesce(zb.book, 'total') as book,
              count(*) as count,
              coalesce(sum(rd.current_usage)   filter (where rd.is_committed = true), 0) as total_consumption,
              coalesce(sum(rd.billed_amount)   filter (where rd.is_committed = true), 0) as total_billed_amount,
              coalesce(sum(rd.senior_discount) filter (where rd.is_committed = true), 0) as total_senior_discount
          from zone_book zb
          left join reading_details rd
              on zb.zone = lpad(rd.zone_code, 2, '0')
              and zb.book = rd.book_code
              and rd.created_at >= ${start} and rd.created_at < ${end}
          group by
              rollup(zb.zone, zb.book)
          order by
              zb.zone::int nulls last,
              zb.book::int nulls last`);

    const rows = result.rows.map((row: any) => ({
      zone: row.zone,
      book: row.book,
      count: row.count,
      totalConsumption: row.total_consumption,
      totalBilledAmount: row.total_billed_amount,
      totalSeniorDiscount: row.total_senior_discount,
    }));

    return ZoneBookSummaryRowSchema.array().parse(rows);
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
