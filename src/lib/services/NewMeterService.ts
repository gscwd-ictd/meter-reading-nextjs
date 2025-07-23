import { I_Crud } from "../interfaces/crud";
import { NewMeterRepository } from "../repositories/NewMeterRepository";
import { NewMeter } from "../validators/new-meter-schema";

export class NewMeterService implements I_Crud<NewMeter> {
  constructor(private readonly newMeterRepository: NewMeterRepository) {}

  async create(dto: NewMeter): Promise<NewMeter> {
    return await this.newMeterRepository.create(dto);
  }

  async getAll(): Promise<NewMeter[]> {
    return await this.newMeterRepository.getAll();
  }

  async getById(id: string): Promise<NewMeter> {
    return await this.newMeterRepository.getById(id);
  }

  async update(id: string, dto: Omit<Partial<NewMeter>, "id">): Promise<NewMeter> {
    return await this.newMeterRepository.update(id, dto);
  }

  async delete(id: string): Promise<{ status: string }> {
    return await this.newMeterRepository.delete(id);
  }
}
