import db from "@/server/db/connection";
import { viewZoneBookArea, zoneBook } from "@/server/db/schemas/zone-book";
import { IZoneBookRepository } from "@/server/interfaces/zone-book/zone-book.interface.repository";
import {
  AssignZoneBookArea,
  UpdateZoneBookArea,
  ZoneBook,
  ZoneBookSchema,
} from "@/server/types/zone-book.type";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class ZoneBookRepository implements IZoneBookRepository {
  async findAllZoneBooksWithArea(): Promise<ZoneBook[]> {
    const stmt = db.select().from(viewZoneBookArea).prepare("get_all_zone_books_with_area");
    const result = await stmt.execute();
    return ZoneBookSchema.array().parse(result);
  }

  async findZoneBookWithAreaById(zoneBookId: string): Promise<ZoneBook> {
    const stmt = db
      .select()
      .from(viewZoneBookArea)
      .where(eq(viewZoneBookArea.zoneBookId, zoneBookId))
      .prepare("get_zone_book_area_by_id");

    const [zoneBookAreaFound] = await stmt.execute();

    if (!zoneBookAreaFound) {
      throw new HTTPException(404, { message: `zone book area with id ${zoneBookId} not found.` });
    }

    return ZoneBookSchema.parse(zoneBookAreaFound);
  }

  async assignZoneBookArea(data: AssignZoneBookArea): Promise<ZoneBook> {
    try {
      const stmt = db.insert(zoneBook).values(data).returning().prepare("assign_zone_book_area");
      const [assignedZoneBookArea] = await stmt.execute();

      if (!assignedZoneBookArea) {
        throw new HTTPException(500, { message: "failed to assigned zone book area." });
      }

      return this.findZoneBookWithAreaById(assignedZoneBookArea.zoneBookId);
    } catch (err) {
      throw new HTTPException(500, {
        message: err instanceof Error ? err.message : "unexpected server error",
      });
    }
  }

  async updateZoneBookArea(zoneBookId: string, data: UpdateZoneBookArea): Promise<ZoneBook> {
    const zoneBookAreaFound = await this.findZoneBookWithAreaById(zoneBookId);

    const stmtUpdate = db
      .update(zoneBook)
      .set(data)
      .where(eq(zoneBook.zoneBookId, zoneBookAreaFound.zoneBookId))
      .returning()
      .prepare("update_zone_book_area");

    const [updatedZoneBookArea] = await stmtUpdate.execute();

    if (!updatedZoneBookArea) {
      throw new HTTPException(500, {
        message: `failed to update zone book area with zone book id ${zoneBookId}.`,
      });
    }

    return await this.findZoneBookWithAreaById(updatedZoneBookArea.zoneBookId);
  }
}
