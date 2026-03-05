import {
  ReadingAccountProgress,
  ReadingAccountQuery,
  ReadingZoneBookProgress,
  UpdateReadingProgress,
} from "@mr/server/types/report.type";
import { ScheduleReading } from "@mr/server/types/schedule.type";

export interface IReportsService {
  getReadingZoneBookProgress(month: number, year: number): Promise<ReadingZoneBookProgress[]>;
  getReadingAccountProgress(query: ReadingAccountQuery): Promise<ReadingAccountProgress[]>;
  updateReadingProgress(data: UpdateReadingProgress): Promise<ReadingAccountProgress[]>;
  meterReadingScheduleSummary(month: number, year: number): Promise<ScheduleReading[]>;
}
