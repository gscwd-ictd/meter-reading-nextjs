import z4 from "zod/v4";
import db from "@/server/db/connections";
import { eq } from "drizzle-orm";
import { CreateAccountHistorySchema, UpdateAccountHistorySchema } from "../validators/account-history-schema";
import { accountHistory } from "@/server/db/schemas/account-ledger";

export class AccountHistoryRepository {
  async create(dto: z4.infer<typeof CreateAccountHistorySchema>) {
    try {
      const res = await db.pgConn.insert(accountHistory).values(dto).returning();
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async getAll() {
    return await db.pgConn.select().from(accountHistory);
  }

  async getById(id: string) {
    try {
      const res = await db.pgConn.select().from(accountHistory).where(eq(accountHistory.id, id));
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dto: z4.infer<typeof UpdateAccountHistorySchema>) {
    try {
      const res = await db.pgConn
        .update(accountHistory)
        .set(dto)
        .where(eq(accountHistory.id, id))
        .returning();

      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    try {
      await db.pgConn.delete(accountHistory).where(eq(accountHistory.id, id));
      return { status: "successfull" };
    } catch (error) {
      throw error;
    }
  }
}
