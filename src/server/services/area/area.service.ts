import { IAreaRepository } from "@/server/interfaces/area/area.interface.repository";
import { IAreaService } from "@/server/interfaces/area/area.interface.service";
import { Area, CreateArea, UpdateArea } from "@/server/types/area.type";

export class AreaService implements IAreaService {
  constructor(private readonly repository: IAreaRepository) {}

  async addArea(data: CreateArea): Promise<Area> {
    return await this.repository.createArea(data);
  }

  async getArea(): Promise<Area[]> {
    return await this.repository.findArea();
  }

  async getAreaById(id: string): Promise<Area> {
    return await this.repository.findAreaById(id);
  }

  async updateAreaById(id: string, data: UpdateArea): Promise<Area> {
    return await this.repository.updateAreaById(id, data);
  }

  async deleteAreaById(id: string): Promise<Area> {
    return await this.repository.removeAreaById(id);
  }
}
