import { IReportsRepository } from "@mr/server/interfaces/reports/reports.interface.repository";
import { IReportsService } from "@mr/server/interfaces/reports/reports.interface.service";
import {
  ReadingAccountProgress,
  ReadingAccountQuery,
  ReadingZoneBookProgress,
  UpdateReadingProgress,
} from "@mr/server/types/report.type";
import { ScheduleReading } from "@mr/server/types/schedule.type";

export class ReportsService implements IReportsService {
  constructor(private readonly repository: IReportsRepository) {}

  async getReadingZoneBookProgress(month: number, year: number): Promise<ReadingZoneBookProgress[]> {
    return await this.repository.findReadingZoneBookProgress(month, year);
  }

  async getReadingAccountProgress(query: ReadingAccountQuery): Promise<ReadingAccountProgress[]> {
    return await this.repository.findReadingAccountProgress(query);
  }

  async updateReadingProgress(data: UpdateReadingProgress): Promise<ReadingAccountProgress[]> {
    return await this.repository.updateReadingProgress(data);
  }

  async meterReadingScheduleSummary(month: number, year: number): Promise<ScheduleReading[]> {
    return await this.repository.meterReadingScheduleSummary(month, year);
  }
}
