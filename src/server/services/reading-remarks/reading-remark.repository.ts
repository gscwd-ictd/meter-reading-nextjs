import { IReadingRemarkRepository } from "@mr/server/interfaces/reading-remarks/reading-remark.interface.repository";
import {
  CreateReadingRemark,
  ReadingRemark,
  UpdateReadingRemark,
} from "@mr/server/types/reading-remark.type";

import db from "@mr/server/db/connections";
import { readingRemarks } from "@mr/server/db/schemas/reading-remarks";
import { HTTPException } from "hono/http-exception";
import { eq } from "drizzle-orm";

export class ReadingRemarkRepository implements IReadingRemarkRepository {
  async createReadingRemark(data: CreateReadingRemark): Promise<ReadingRemark> {
    try {
      const [stmt] = await db.pgConn.insert(readingRemarks).values(data).returning();

      if (!stmt) {
        throw new HTTPException(500, { message: "Failed to create reading remark" });
      }

      return stmt;
    } catch (error) {
      throw new HTTPException(500, {
        message: error instanceof Error ? error.message : "unexpected server error",
      });
    }
  }

  async findAllReadingRemark(): Promise<ReadingRemark[]> {
    const stmt = await db.pgConn.select().from(readingRemarks);
    return stmt;
  }

  async findReadingRemark(id: string): Promise<ReadingRemark> {
    const [stmt] = await db.pgConn.select().from(readingRemarks).where(eq(readingRemarks.id, id));

    if (!stmt) {
      throw new HTTPException(404, { message: "Reading remark not found" });
    }

    return stmt;
  }

  async updateReadingRemark(id: string, data: UpdateReadingRemark): Promise<ReadingRemark> {
    try {
      const [stmt] = await db.pgConn
        .update(readingRemarks)
        .set(data)
        .where(eq(readingRemarks.id, id))
        .returning();

      if (!stmt) {
        throw new HTTPException(404, { message: "Reading remark not found" });
      }

      return stmt;
    } catch (error) {
      throw new HTTPException(500, {
        message: error instanceof Error ? error.message : "unexpected server error",
      });
    }
  }

  async deleteReadingRemark(id: string): Promise<ReadingRemark> {
    const [result] = await db.pgConn.delete(readingRemarks).where(eq(readingRemarks.id, id)).returning();

    if (!result) {
      throw new HTTPException(404, { message: "Reading remark not found" });
    }

    return result;
  }
}
