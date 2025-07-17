import { I_Crud } from "../interfaces/crud";
import { Leakage } from "../validators/leakage-schema";
import { LeakageRepository } from "../repositories/LeakageRepository";

export class LeakageService implements I_Crud<Leakage> {
  constructor(private readonly leakageRepository: LeakageRepository) {}

  async create(dto: Leakage): Promise<Leakage> {
    return await this.leakageRepository.create(dto);
  }

  async getAll(): Promise<Leakage[]> {
    return await this.leakageRepository.getAll();
  }

  async getById(id: string): Promise<Leakage> {
    return await this.leakageRepository.getById(id);
  }

  async update(id: string, dto: Omit<Partial<Leakage>, "id">): Promise<Leakage> {
    return await this.leakageRepository.update(id, dto);
  }

  async delete(id: string): Promise<{ status: string }> {
    return await this.leakageRepository.delete(id);
  }
}
