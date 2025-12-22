import {
  ReadingAccountProgress,
  ReadingAccountQuery,
  ReadingZoneBookProgress,
  UpdateReadingProgress,
} from "@mr/server/types/report.type";

export interface IReportsService {
  getReadingZoneBookProgress(month: number, year: number): Promise<ReadingZoneBookProgress[]>;
  getReadingAccountProgress(query: ReadingAccountQuery): Promise<ReadingAccountProgress[]>;
  updateReadingProgress(data: UpdateReadingProgress): Promise<ReadingAccountProgress[]>;
}
