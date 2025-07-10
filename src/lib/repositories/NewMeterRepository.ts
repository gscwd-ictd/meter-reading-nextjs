import { newMeters } from "@/server/db/schemas/new-meters";
import { I_Crud } from "../interfaces/crud";
import { NewMeter } from "../validators/new-meter-schema";
import db from "@/server/db/connections";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class NewMeterRepository implements I_Crud<NewMeter> {
  async create(dto: NewMeter): Promise<NewMeter> {
    try {
      const res = await db.pgConn.insert(newMeters).values(dto).returning();
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<NewMeter[]> {
    return await db.pgConn.select().from(newMeters);
  }

  async getById(id: string): Promise<NewMeter> {
    try {
      const res = await db.pgConn.select().from(newMeters).where(eq(newMeters.id, id));

      if (res.length === 0) {
        throw new HTTPException(404, { message: "Not found!" });
      }

      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dto: Omit<Partial<NewMeter>, "id">): Promise<NewMeter> {
    try {
      const res = await db.pgConn.update(newMeters).set(dto).where(eq(newMeters.id, id)).returning();
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<{ status: string }> {
    try {
      await db.pgConn.delete(newMeters).where(eq(newMeters.id, id));
      return { status: "successful" };
    } catch (error) {
      throw error;
    }
  }
}
