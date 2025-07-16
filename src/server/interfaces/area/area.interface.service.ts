/**
 * Interface for Area service logic.
 *
 * Contains methods for handling business rules related to creating,
 * retrieving, updating, and deleting area records.
 */

import { Area, CreateArea, UpdateArea } from "@/server/types/area.type";

export interface IAreaService {
  /**
   * Create a new area.
   */
  createArea(data: CreateArea): Promise<Area>;

  /**
   * Get all areas.
   */
  getAllAreas(): Promise<Area[]>;

  /**
   * Get a single area by ID.
   */
  getAreaById(id: string): Promise<Area>;

  /**
   * Update an area by ID.
   */
  updateArea(id: string, data: UpdateArea): Promise<Area>;

  /**
   * Delete an area by ID and return the deleted area.
   */
  deleteArea(id: string): Promise<Area>;
}
