import { I_Crud } from "../interfaces/crud";
import { ReadingDetailsRepository } from "../repositories/ReadingDetailsRepository";
import { ReadingDetails } from "../validators/reading-details-schema";

export class ReadingDetailsService implements I_Crud<ReadingDetails> {
  constructor(private readonly readingDetailsRepository: ReadingDetailsRepository) {}

  async create(dto: ReadingDetails): Promise<ReadingDetails> {
    return await this.readingDetailsRepository.create(dto);
  }

  async getAll(): Promise<ReadingDetails[]> {
    return await this.readingDetailsRepository.getAll();
  }

  async getById(id: string): Promise<ReadingDetails> {
    return await this.readingDetailsRepository.getById(id);
  }

  async update(id: string, dto: Omit<Partial<ReadingDetails>, "id">): Promise<ReadingDetails> {
    return await this.readingDetailsRepository.update(id, dto);
  }

  async delete(id: string): Promise<{ status: string }> {
    return await this.readingDetailsRepository.delete(id);
  }
}
