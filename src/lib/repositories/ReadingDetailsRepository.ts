//@ts-nocheck

import { readingDetails } from "@mr/server/db/schemas/reading-details";
import { I_Crud } from "../interfaces/crud";
import { ReadingDetails, UpdateReadingAccountsCompleted } from "../validators/reading-details-schema";
import db from "@mr/server/db/connections";
import { and, eq, or, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class ReadingDetailsRepository implements I_Crud<ReadingDetails> {
  async create(dto: ReadingDetails): Promise<ReadingDetails> {
    try {
      const res = await db.pgConn.insert(readingDetails).values(dto).returning();
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<ReadingDetails[]> {
    return await db.pgConn.select().from(readingDetails);
  }

  async getById(id: string): Promise<ReadingDetails> {
    try {
      const res = await db.pgConn.select().from(readingDetails).where(eq(readingDetails.id, id));

      if (res.length === 0) {
        throw new HTTPException(404, { message: "Not found!" });
      }

      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, dto: Omit<Partial<ReadingDetails>, "id">): Promise<ReadingDetails> {
    try {
      const res = await db.pgConn
        .update(readingDetails)
        .set(dto)
        .where(eq(readingDetails.id, id))
        .returning();
      return res[0];
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<{ status: string }> {
    try {
      await db.pgConn.delete(readingDetails).where(eq(readingDetails.id, id));
      return { status: "successful" };
    } catch (error) {
      throw error;
    }
  }

  async updateReadingAccountsCompleted(dto: UpdateReadingAccountsCompleted): Promise<{ message: string }> {
    const [year, month] = dto.readingMonth.split("-").map(Number);
    const start = `${year}-${month.toString().padStart(2, "0")}-01`;
    const endMonth = month === 12 ? 1 : month + 1;
    const endYear = month === 12 ? year + 1 : year;
    const end = `${endYear}-${endMonth.toString().padStart(2, "0")}-01`;

    const now = new Date();

    if (!dto.zoneBooks.length) {
      return { message: "No zone books provided" };
    }

    await db.pgConn
      .update(readingDetails)
      .set({ isCompleted: true, datetimeCompleted: now })
      .where(
        and(
          eq(readingDetails.meterReaderId, dto.meterReaderId),
          sql`created_at >= ${start} AND created_at < ${end}`,
          or(
            ...dto.zoneBooks.map((zb) =>
              and(eq(readingDetails.zoneCode, zb.zone), eq(readingDetails.bookCode, zb.book)),
            ),
          ),
        ),
      );

    return { message: "Reading accounts updated successfully" };
  }
}
