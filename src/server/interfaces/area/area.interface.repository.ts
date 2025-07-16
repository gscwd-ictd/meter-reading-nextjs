/**
 * Interface for Area repository operations.
 *
 * Defines methods to create, retrieve, update, and delete Area records.
 * Ensures strong typing using Zod-inferred types.
 */

import { Area, CreateArea, UpdateArea } from "@/server/types/area.type";

export interface IAreaRepository {
  /**
   * Create a new area.
   */
  createArea(data: CreateArea): Promise<Area>;

  /**
   * Retrieve all areas.
   */
  findAllAreas(): Promise<Area[]>;

  /**
   * Retrieve a single area by its ID.
   */
  findAreaById(id: string): Promise<Area>;

  /**
   * Update an existing area by its ID.
   */
  updateArea(id: string, data: UpdateArea): Promise<Area>;

  /**
   * Delete an area by its ID and return the deleted area.
   */
  deleteArea(id: string): Promise<Area>;
}
