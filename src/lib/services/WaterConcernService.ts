import { I_Crud } from "../interfaces/crud";
import { WaterConcernRepository } from "../repositories/WaterConcernRepository";
import { WaterConcern } from "../validators/water-concerns-schema";

export class WaterConcernService implements I_Crud<WaterConcern> {
  constructor(private readonly waterConcernRepository: WaterConcernRepository) {}

  async create(dto: WaterConcern): Promise<WaterConcern> {
    return await this.waterConcernRepository.create(dto);
  }

  async getAll(): Promise<WaterConcern[]> {
    return await this.waterConcernRepository.getAll();
  }

  async getById(id: string): Promise<WaterConcern> {
    return await this.waterConcernRepository.getById(id);
  }

  async update(id: string, dto: Omit<Partial<WaterConcern>, "id">): Promise<WaterConcern> {
    return await this.waterConcernRepository.update(id, dto);
  }

  async delete(id: string): Promise<{ status: string }> {
    return await this.waterConcernRepository.delete(id);
  }
}
