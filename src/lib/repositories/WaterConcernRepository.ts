import { waterConcerns } from "@/server/db/schemas/water-concerns";
import { I_Crud } from "../interfaces/crud";
import { WaterConcern } from "../validators/water-concerns-schema";
import db from "@/server/db/connections";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class WaterConcernRepository implements I_Crud<WaterConcern> {
  async create(dto: WaterConcern): Promise<WaterConcern> {
    try {
      const res = await db.pgConn.insert(waterConcerns).values(dto).returning();
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<WaterConcern[]> {
    return await db.pgConn.select().from(waterConcerns);
  }

  async getById(id: string): Promise<WaterConcern> {
    try {
      const res = await db.pgConn.select().from(waterConcerns).where(eq(waterConcerns.id, id));

      if (res.length === 0) {
        throw new HTTPException(404, { message: "Not found!" });
      }

      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dto: Omit<Partial<WaterConcern>, "id">): Promise<WaterConcern> {
    try {
      const res = await db.pgConn.update(waterConcerns).set(dto).where(eq(waterConcerns.id, id)).returning();
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<{ status: string }> {
    try {
      await db.pgConn.delete(waterConcerns).where(eq(waterConcerns.id, id));
      return { status: "successful" };
    } catch (error) {
      throw error;
    }
  }
}
