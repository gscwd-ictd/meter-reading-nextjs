import { I_Crud } from "../interfaces/crud";
import { RateRepository } from "../repositories/RateRepository";
import { Rate } from "../validators/rate-schema";

export class RateService implements I_Crud<Rate> {
  constructor(private readonly rateRepository: RateRepository) {}

  async create(dto: Rate): Promise<Rate> {
    return await this.rateRepository.create(dto);
  }

  async getAll(): Promise<Rate[]> {
    return await this.rateRepository.getAll();
  }

  async getById(id: string): Promise<Rate> {
    return await this.rateRepository.getById(id);
  }

  async update(id: string, dto: Omit<Partial<Rate>, "id">): Promise<Rate> {
    return await this.rateRepository.update(id, dto);
  }

  async delete(id: string): Promise<{ status: string }> {
    return await this.rateRepository.delete(id);
  }
}
