import { Area, CreateArea, UpdateArea } from "@/server/types/area.type";

export interface IAreaService {
  addArea(data: CreateArea): Promise<Area>;
  getArea(): Promise<Area[]>;
  getAreaById(id: string): Promise<Area>;
  updateAreaById(id: string, data: UpdateArea): Promise<Area>;
  deleteAreaById(id: string): Promise<Area>;
}
