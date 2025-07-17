import db from "@mr/server/db/connections";
import { area } from "@mr/server/db/schemas/area";
import { IAreaRepository } from "@mr/server/interfaces/area/area.interface.repository";
import { Area, CreateArea, UpdateArea } from "@mr/server/types/area.type";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export class AreaRepository implements IAreaRepository {
  async createArea(data: CreateArea): Promise<Area> {
    try {
      const stmt = db.pgConn.insert(area).values(data).returning().prepare("add_area");
      const [createdArea] = await stmt.execute();

      if (!createdArea) {
        throw new HTTPException(500, { message: "failed to create area." });
      }

      return createdArea;
    } catch (err) {
      throw new HTTPException(500, {
        message: err instanceof Error ? err.message : "unexpected server error",
      });
    }
  }

  async findAllAreas(): Promise<Area[]> {
    const stmt = db.pgConn.select().from(area).prepare("get_all_areas");
    return stmt.execute();
  }

  async findAreaById(id: string): Promise<Area> {
    const stmt = db.pgConn.select().from(area).where(eq(area.areaId, id)).prepare("get_area_by_id");
    const [areaFound] = await stmt.execute();

    if (!areaFound) {
      throw new HTTPException(404, { message: `area with id ${id} not found.` });
    }

    return areaFound;
  }

  async updateArea(id: string, data: UpdateArea): Promise<Area> {
    const areaFound = await this.findAreaById(id);

    const stmtUpdate = db.pgConn
      .update(area)
      .set(data)
      .where(eq(area.areaId, areaFound.areaId))
      .returning()
      .prepare("update_area");

    const [updatedArea] = await stmtUpdate.execute();

    if (!updatedArea) {
      throw new HTTPException(500, { message: `failed to update area with id ${id}.` });
    }

    return updatedArea;
  }

  async deleteArea(id: string): Promise<Area> {
    const areaFound = await this.findAreaById(id);

    const stmtDelete = db.pgConn
      .delete(area)
      .where(eq(area.areaId, areaFound.areaId))
      .returning()
      .prepare("delete_area_by_id");

    const [deletedArea] = await stmtDelete.execute();

    if (!deletedArea) {
      throw new HTTPException(500, { message: `failed to delete area with id ${id}.` });
    }

    return deletedArea;
  }
}
