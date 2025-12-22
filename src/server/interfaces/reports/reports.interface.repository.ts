import {
  ReadingAccountProgress,
  ReadingAccountQuery,
  ReadingZoneBookProgress,
  UpdateReadingProgress,
} from "@mr/server/types/report.type";

export interface IReportsRepository {
  findReadingZoneBookProgress(month: number, year: number): Promise<ReadingZoneBookProgress[]>;
  findReadingAccountProgress(query: ReadingAccountQuery): Promise<ReadingAccountProgress[]>;
  updateReadingProgress(data: UpdateReadingProgress): Promise<ReadingAccountProgress[]>;
}
