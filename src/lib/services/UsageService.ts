import { I_Crud } from "../interfaces/crud";
import { UsageRepository } from "../repositories/UsageRepository";
import { Usage } from "../validators/usage-schema";

export class UsageService implements I_Crud<Usage> {
  constructor(private readonly usageRepository: UsageRepository) {}

  async create(dto: Usage): Promise<Usage> {
    return await this.usageRepository.create(dto);
  }

  async getAll(): Promise<Usage[]> {
    return await this.usageRepository.getAll();
  }

  async getById(id: string): Promise<Usage> {
    return await this.usageRepository.getById(id);
  }

  async update(id: string, dto: Omit<Partial<Usage>, "id" | "createdAt">): Promise<Usage> {
    return await this.usageRepository.update(id, dto);
  }

  async delete(id: string): Promise<{ status: string }> {
    return await this.usageRepository.delete(id);
  }
}
