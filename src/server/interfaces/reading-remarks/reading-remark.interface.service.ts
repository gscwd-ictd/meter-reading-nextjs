import {
  CreateReadingRemark,
  ReadingRemark,
  UpdateReadingRemark,
} from "@mr/server/types/reading-remark.type";

export interface IReadingRemarkService {
  addReadingRemark(data: CreateReadingRemark): Promise<ReadingRemark>;
  getAllReadingRemark(): Promise<ReadingRemark[]>;
  getReadingRemark(id: string): Promise<ReadingRemark>;
  updateReadingRemark(id: string, data: UpdateReadingRemark): Promise<ReadingRemark>;
  removeReadingRemark(id: string): Promise<ReadingRemark>;
}
