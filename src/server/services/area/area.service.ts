import { IAreaRepository } from "@mr/server/interfaces/area/area.interface.repository";
import { IAreaService } from "@mr/server/interfaces/area/area.interface.service";
import { Area, CreateArea, UpdateArea } from "@mr/server/types/area.type";

export class AreaService implements IAreaService {
  constructor(private readonly repository: IAreaRepository) {}

  async createArea(data: CreateArea): Promise<Area> {
    return this.repository.createArea(data);
  }

  async getAllAreas(): Promise<Area[]> {
    return this.repository.findAllAreas();
  }

  async getAreaById(id: string): Promise<Area> {
    return this.repository.findAreaById(id);
  }

  async updateArea(id: string, data: UpdateArea): Promise<Area> {
    return this.repository.updateArea(id, data);
  }

  async deleteArea(id: string): Promise<Area> {
    return this.repository.deleteArea(id);
  }
}
