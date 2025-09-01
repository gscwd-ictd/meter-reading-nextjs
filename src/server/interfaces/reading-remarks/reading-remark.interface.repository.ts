import {
  CreateReadingRemark,
  ReadingRemark,
  UpdateReadingRemark,
} from "@mr/server/types/reading-remark.type";

export interface IReadingRemarkRepository {
  createReadingRemark(data: CreateReadingRemark): Promise<ReadingRemark>;
  findAllReadingRemark(): Promise<ReadingRemark[]>;
  findReadingRemark(id: string): Promise<ReadingRemark>;
  updateReadingRemark(id: string, data: UpdateReadingRemark): Promise<ReadingRemark>;
  deleteReadingRemark(id: string): Promise<ReadingRemark>;
}
