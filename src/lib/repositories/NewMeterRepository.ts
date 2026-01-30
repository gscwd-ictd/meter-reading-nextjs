import { newMeters } from "@mr/server/db/schemas/new-meters";
import { I_Crud } from "../interfaces/crud";
import db from "@mr/server/db/connections";
import { and, eq, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { NewMeter } from "../validators/new-meter-schema";
import { meterReadingContext } from "@mr/server/context";

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
    const newmeter = await db.pgConn.select().from(newMeters);

    const result = await Promise.all(
      newmeter.map(async (item) => {
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

    return result;
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

  async getAllNewMeterByMeterReaderId(meterReaderId: string, readingMonth: string): Promise<NewMeter[]> {
    try {
      const [year, month] = readingMonth.split("-").map(Number);
      const start = `${year}-${month.toString().padStart(2, "0")}-01`;
      const endMonth = month === 12 ? 1 : month + 1;
      const endYear = month === 12 ? year + 1 : year;
      const end = `${endYear}-${endMonth.toString().padStart(2, "0")}-01`;
      const res = await db.pgConn
        .select()
        .from(newMeters)
        .where(
          and(eq(newMeters.meterReaderId, meterReaderId), sql`dateTime >= ${start} AND dateTime < ${end}`),
        );

      return res;
    } catch (error) {
      throw error;
    }
  }
}
