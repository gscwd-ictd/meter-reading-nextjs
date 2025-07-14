import z4 from "zod/v4";
import db from "@/server/db/connections";
import {
  AccountHistory,
  CreateAccountHistorySchema,
  UpdateAccountHistorySchema,
} from "../validators/account-history-schema";
import { eq } from "drizzle-orm";
import { I_Crud } from "../interfaces/crud";
import { accountHistory } from "@/server/db/schemas/account-ledger";
import { HTTPException } from "hono/http-exception";

export class AccountHistoryRepository implements I_Crud<AccountHistory> {
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

      if (res.length === 0) {
        throw new HTTPException(404, { message: "Not found!" });
      }
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
