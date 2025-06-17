import { db } from "@/server/db/postgres-connection";
import { area } from "@/server/db/schemas/area";
import { IAreaRepository } from "@/server/interfaces/area/area.interface.repository";
import { Area, CreateArea, UpdateArea } from "@/server/types/area.type";
import { eq } from "drizzle-orm";

export class AreaRepository implements IAreaRepository {
  async createArea(data: CreateArea): Promise<Area> {
    try {
      const stmt = db.insert(area).values(data).returning().prepare("add_area");
      const [createdArea] = await stmt.execute();

      if (!createdArea) {
        throw new Error("Failed to create area.");
      }

      return createdArea;
    } catch (err) {
      // Re-throw as generic Error to keep stack trace
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }

  async findArea(): Promise<Area[]> {
    const stmt = db.select().from(area).prepare("get_all_areas");
    return await stmt.execute();
  }

  async findAreaById(id: string): Promise<Area> {
    const stmt = db.select().from(area).where(eq(area.id, id)).prepare("get_area_by_id");
    const [areaFound] = await stmt.execute();

    if (!areaFound) {
      throw new Error(`Area with id ${id} not found.`);
    }

    return areaFound;
  }

  async updateAreaById(id: string, data: UpdateArea): Promise<Area> {
    return await db.transaction(async (tx) => {
      // Check existence
      const stmtFind = tx.select().from(area).where(eq(area.id, id)).prepare("get_area_by_id");
      const [areaFound] = await stmtFind.execute();

      if (!areaFound) {
        throw new Error(`Area with id ${id} not found.`);
      }

      // Update
      const stmtUpdate = tx.update(area).set(data).where(eq(area.id, id)).returning().prepare("update_area");
      const [updatedArea] = await stmtUpdate.execute();

      if (!updatedArea) {
        throw new Error(`Failed to update area with id ${id}.`);
      }

      return updatedArea;
    });
  }

  async removeAreaById(id: string): Promise<Area> {
    return await db.transaction(async (tx) => {
      // Check existence
      const stmtFind = tx.select().from(area).where(eq(area.id, id)).prepare("get_area_by_id");
      const [areaFound] = await stmtFind.execute();

      if (!areaFound) {
        throw new Error(`Area with id ${id} not found.`);
      }

      // Delete
      const stmtDelete = tx.delete(area).where(eq(area.id, id)).returning().prepare("delete_area_by_id");
      const [deletedArea] = await stmtDelete.execute();

      if (!deletedArea) {
        throw new Error(`Failed to delete area with id ${id}.`);
      }

      return deletedArea;
    });
  }
}
