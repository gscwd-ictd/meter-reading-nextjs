import { IERPRepository } from "@mr/server/interfaces/erp/erp.interface.repository";
import { ReadingAccount, ReadingAccountSchema } from "@mr/server/types/erp.type";
import db from "@mr/server/db/connections";
import { viewReadingAccountProgress } from "@mr/server/db/schemas/reports";
import { and, sql } from "drizzle-orm";

export class ERPRepository implements IERPRepository {
  async findAllReadingAccount(readingMonth: string): Promise<ReadingAccount[]> {
    const [year, month] = readingMonth.split("-").map(Number);
    const start = `${year}-${month.toString().padStart(2, "0")}-01`;
    const endMonth = month === 12 ? 1 : month + 1;
    const endYear = month === 12 ? year + 1 : year;
    const end = `${endYear}-${endMonth.toString().padStart(2, "0")}-01`;

    const stmt = await db.pgConn
      .select()
      .from(viewReadingAccountProgress)
      .where(and(sql`reading_month >= ${start} AND reading_month < ${end}`));

    return ReadingAccountSchema.array().parse(stmt);
  }
}
