import db from "@mr/server/db/connections";
import { viewZoneBookArea, zoneBook } from "@mr/server/db/schemas/zone-book";
import { IZoneBookRepository } from "@mr/server/interfaces/zone-book/zone-book.interface.repository";
import {
  AssignZoneBookArea,
  UpdateZoneBookArea,
  ZoneBook,
  ZoneBookSchema,
} from "@mr/server/types/zone-book.type";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class ZoneBookRepository implements IZoneBookRepository {
  async findAllZoneBooksWithArea(): Promise<ZoneBook[]> {
    const stmt = await db.pgConn.select().from(viewZoneBookArea);
    return ZoneBookSchema.array().parse(stmt);
  }

  async findZoneBookWithAreaById(zoneBookId: string): Promise<ZoneBook> {
    const stmt = await db.pgConn.select().from(viewZoneBookArea).where(eq(viewZoneBookArea.id, zoneBookId));

    if (!stmt[0]) {
      throw new HTTPException(404, { message: `zone book area with id ${zoneBookId} not found.` });
    }

    return ZoneBookSchema.parse(stmt[0]);
  }

  async assignZoneBookArea(data: AssignZoneBookArea): Promise<ZoneBook> {
    try {
      const { area, ...rest } = data;
      const stmt = await db.pgConn
        .insert(zoneBook)
        .values({ areaId: area.id, ...rest })
        .returning();

      if (!stmt[0]) {
        throw new HTTPException(500, { message: "failed to assigned zone book area." });
      }

      return this.findZoneBookWithAreaById(stmt[0].id);
    } catch (err) {
      throw new HTTPException(500, {
        message: err instanceof Error ? err.message : "unexpected server error",
      });
    }
  }

  async updateZoneBookArea(zoneBookId: string, data: UpdateZoneBookArea): Promise<ZoneBook> {
    const zoneBookAreaFound = await this.findZoneBookWithAreaById(zoneBookId);

    const { area, ...rest } = data;
    const stmtUpdate = db.pgConn
      .update(zoneBook)
      .set({ areaId: area.id, ...rest })
      .where(eq(zoneBook.id, zoneBookAreaFound.id))
      .returning()
      .prepare("update_zone_book_area");

    const [updatedZoneBookArea] = await stmtUpdate.execute();

    if (!updatedZoneBookArea) {
      throw new HTTPException(500, {
        message: `failed to update zone book area with zone book id ${zoneBookId}.`,
      });
    }

    return await this.findZoneBookWithAreaById(updatedZoneBookArea.id);
  }
}
