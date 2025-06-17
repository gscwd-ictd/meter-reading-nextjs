import { Area, CreateArea, UpdateArea } from "@/server/types/area.type";

export interface IAreaRepository {
  createArea(data: CreateArea): Promise<Area>;
  findArea(): Promise<Area[]>;
  findAreaById(id: string): Promise<Area>;
  updateAreaById(id: string, data: UpdateArea): Promise<Area>;
  removeAreaById(id: string): Promise<Area>;
}
