import { IReadingRemarkService } from "@mr/server/interfaces/reading-remarks/reading-remark.interface.service";
import {
  CreateReadingRemark,
  ReadingRemark,
  UpdateReadingRemark,
} from "@mr/server/types/reading-remark.type";
import { ReadingRemarkRepository } from "./reading-remark.repository";

export class ReadingRemarkService implements IReadingRemarkService {
  constructor(private readonly repository: ReadingRemarkRepository) {}

  async addReadingRemark(data: CreateReadingRemark): Promise<ReadingRemark> {
    return await this.repository.createReadingRemark(data);
  }

  async getAllReadingRemark(): Promise<ReadingRemark[]> {
    return await this.repository.findAllReadingRemark();
  }

  async getReadingRemark(id: string): Promise<ReadingRemark> {
    return await this.repository.findReadingRemark(id);
  }

  async updateReadingRemark(id: string, data: UpdateReadingRemark): Promise<ReadingRemark> {
    return await this.repository.updateReadingRemark(id, data);
  }

  async removeReadingRemark(id: string): Promise<ReadingRemark> {
    return await this.repository.deleteReadingRemark(id);
  }
}
