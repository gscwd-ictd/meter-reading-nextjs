import db from "@mr/server/db/connections";
import { leakages } from "@mr/server/db/schemas/leakages";
import { Leakage } from "../validators/leakage-schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class LeakageRepository {
  async create(dto: Leakage): Promise<Leakage> {
    try {
      const res = await db.pgConn.insert(leakages).values(dto).returning();
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<Leakage[]> {
    return await db.pgConn.select().from(leakages);
  }

  async getById(id: string): Promise<Leakage> {
    try {
      const res = await db.pgConn.select().from(leakages).where(eq(leakages.id, id));

      if (res.length === 0) {
        throw new HTTPException(404, { message: "Not found!" });
      }

      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dto: Omit<Partial<Leakage>, "id">): Promise<Leakage> {
    try {
      const res = await db.pgConn.update(leakages).set(dto).where(eq(leakages.id, id)).returning();
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<{ status: string }> {
    try {
      await db.pgConn.delete(leakages).where(eq(leakages.id, id));
      return { status: "successful" };
    } catch (error) {
      throw error;
    }
  }
}
