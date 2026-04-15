import { IERPRepository } from "@mr/server/interfaces/erp/erp.interface.repository";
import { ReadingAccount, ReadingAccountSchema } from "@mr/server/types/erp.type";
import db from "@mr/server/db/connections";
import { viewReadingAccountProgress } from "@mr/server/db/schemas/reports";
import { and, eq, sql } from "drizzle-orm";
import { ReadingAccountQuery } from "@mr/server/types/report.type";
import { meterReadingContext } from "@mr/server/context";

export class ERPRepository implements IERPRepository {
  async findAllReadingAccount(query: ReadingAccountQuery): Promise<ReadingAccount[]> {
    const [year, month] = query.readingMonth.split("-").map(Number);
    const start = `${year}-${month.toString().padStart(2, "0")}-01`;
    const endMonth = month === 12 ? 1 : month + 1;
    const endYear = month === 12 ? year + 1 : year;
    const end = `${endYear}-${endMonth.toString().padStart(2, "0")}-01`;

    const conditions = [sql`reading_month >= ${start} AND reading_month < ${end}`];

    if (query.meterReaderId) {
      conditions.push(eq(viewReadingAccountProgress.meterReaderId, query.meterReaderId));
    }

    if (query.zone && query.book) {
      conditions.push(
        eq(viewReadingAccountProgress.zone, query.zone),
        eq(viewReadingAccountProgress.book, query.book),
      );
    }

    const stmt = await db.pgConn
      .select()
      .from(viewReadingAccountProgress)
      .where(and(and(...conditions)));

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

    return ReadingAccountSchema.array().parse(result);
  }
}
