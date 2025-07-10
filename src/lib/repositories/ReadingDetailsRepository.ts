import { readingDetails } from "@/server/db/schemas/reading-details";
import { I_Crud } from "../interfaces/crud";
import { ReadingDetails } from "../validators/reading-details-schema";
import db from "@/server/db/connections";
import { eq } from "drizzle-orm";
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
    throw new Error("Method not implemented.");
  }

  async delete(id: string): Promise<{ status: string }> {
    try {
      await db.pgConn.delete(readingDetails).where(eq(readingDetails.id, id));
      return { status: "successful" };
    } catch (error) {
      throw error;
    }
  }
}
