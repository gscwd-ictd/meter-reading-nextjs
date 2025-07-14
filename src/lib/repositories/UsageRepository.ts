import db from "@/server/db/connections";
import z4 from "zod/v4";
import { I_Crud } from "../interfaces/crud";
import { UpdateUsageSchema, Usage } from "../validators/usage-schema";
import { usage } from "@/server/db/schemas/account-ledger";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class UsageRepository implements I_Crud<Usage> {
  async create(dto: Usage): Promise<Usage> {
    try {
      const res = await db.pgConn.insert(usage).values(dto).returning();
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<Usage[]> {
    return await db.pgConn.select().from(usage);
  }

  async getById(id: string): Promise<Usage> {
    try {
      const res = await db.pgConn.select().from(usage).where(eq(usage.id, id));

      if (res.length === 0) {
        throw new HTTPException(404, { message: "Not found!" });
      }

      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dto: z4.infer<typeof UpdateUsageSchema>): Promise<Usage> {
    try {
      const res = await db.pgConn.update(usage).set(dto).where(eq(usage.id, id)).returning();
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<{ status: string }> {
    try {
      await db.pgConn.delete(usage).where(eq(usage.id, id));
      return { status: "successful" };
    } catch (error) {
      throw error;
    }
  }
}
