import { db } from "@/server/db/postgres-connection";
import { area } from "@/server/db/schemas/area";
import { zoneBook } from "@/server/db/schemas/zone-book";
import { IZoneBookRepository } from "@/server/interfaces/zone-book/zone-book.interface.repository";
import {
  AssignedAreaZoneBook,
  CreateAssignedAreaZoneBook,
  ZoneBook,
  ZoneBookSchema,
} from "@/server/types/zone-book.type";
import { eq, sql } from "drizzle-orm";

export class ZoneBookRepository implements IZoneBookRepository {
  async findZoneBook(): Promise<ZoneBook[]> {
    const stmt = await db.execute(
      sql`select zone_code as zone, book_code as book, zone_code || '-' || book_code as "zoneBook" from "viewZoneBook" order by zone_code, book_code`,
    );

    const result = ZoneBookSchema.array().parse(stmt.rows);

    return result;
  }

  async findUnassignedAreaZoneBook(): Promise<ZoneBook[]> {
    const stmt = await db.execute(
      sql`select zone_code as zone, book_code as book, zone_code || '-' || book_code as "zoneBook" from "viewZoneBook" order by zone_code, book_code`,
    );

    const allZoneBooks = ZoneBookSchema.array().parse(stmt.rows);

    // Fetch already assigned zone-book entries
    const allAssignedAreaZoneBook = db.select().from(zoneBook).prepare("get_assigned_zone_book");
    const assignedZoneBooks = await allAssignedAreaZoneBook.execute();

    // Create a Set of assigned zone-book keys for fast lookup
    const assignedSet = new Set(assignedZoneBooks.map(({ zone, book }) => `${zone}-${book}`));

    // Filter out assigned zone-book combinations
    const unassignedZoneBooks = allZoneBooks.filter(({ zone, book }) => !assignedSet.has(`${zone}-${book}`));

    // Return only unassigned zone-book entries
    return unassignedZoneBooks;
  }

  async findAssignedAreaZoneBook(): Promise<AssignedAreaZoneBook[]> {
    const stmt = db
      .select({
        id: zoneBook.id,
        zone: zoneBook.zone,
        book: zoneBook.book,
        zoneBook: sql<string>`${zoneBook.zone} || '-' || ${zoneBook.book}`.as("zoneBook"),
        areaId: zoneBook.areaId,
        area: area.area,
        createdAt: zoneBook.createdAt,
        updatedAt: zoneBook.updatedAt,
      })
      .from(zoneBook)
      .innerJoin(area, eq(zoneBook.areaId, area.id))
      .prepare("get_all_assigned_zone_book");

    const result = await stmt.execute();

    return result;
  }

  async createAssignedAreaZoneBook(data: CreateAssignedAreaZoneBook): Promise<AssignedAreaZoneBook> {
    const stmt = db.insert(zoneBook).values(data).returning().prepare("add_zone_book");
    const [inserted] = await stmt.execute();

    const findAreaStmt = db.select().from(area).where(eq(area.id, inserted.areaId)).prepare("get_area_by_id");

    const [areaFound] = await findAreaStmt.execute();

    return {
      ...inserted,
      zoneBook: `${inserted.zone}-${inserted.book}`,
      area: areaFound.area,
    };
  }
}
