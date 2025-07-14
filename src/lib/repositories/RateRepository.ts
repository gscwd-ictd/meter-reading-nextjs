import { rates } from "@/server/db/schemas/rates";
import { I_Crud } from "../interfaces/crud";
import { Rate } from "../validators/rate-schema";
import db from "@/server/db/connections";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class RateRepository implements I_Crud<Rate> {
  async create(dto: Rate): Promise<Rate> {
    try {
      const res = await db.pgConn.insert(rates).values(dto).returning();
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<Rate[]> {
    return await db.pgConn.select().from(rates);
  }

  async getById(id: string): Promise<Rate> {
    try {
      const res = await db.pgConn.select().from(rates).where(eq(rates.id, id));
      if (res.length === 0) {
        throw new HTTPException(404, { message: "Not found!" });
      }

      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dto: Omit<Partial<Rate>, "id">): Promise<Rate> {
    try {
      const res = await db.pgConn.update(rates).set(dto).where(eq(rates.id, id)).returning();
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<{ status: string }> {
    try {
      await db.pgConn.delete(rates).where(eq(rates.id, id));
      return { status: "successful" };
    } catch (error) {
      throw error;
    }
  }
}
