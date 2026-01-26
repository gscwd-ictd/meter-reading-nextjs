import { IMeterReadingSummaryRepository } from "@mr/server/interfaces/meter-reading-summary/meter-reading-summary.interface.repository";
import { IMeterReadingSummaryService } from "@mr/server/interfaces/meter-reading-summary/meter-reading-summary.interface.service";
import {
  BilledSummary,
  UnbilledSummary,
  WithRemarksSummary,
} from "@mr/server/types/meter-reading-summary.type";
import { BilledAccountQuery } from "@mr/server/types/report.type";

export class MeterReadingSummaryService implements IMeterReadingSummaryService {
  constructor(private readonly repository: IMeterReadingSummaryRepository) {}

  async getBilledSummary(query: BilledAccountQuery): Promise<BilledSummary[]> {
    return await this.repository.findBilledSummary(query);
  }

  async getUnbilledSummary(query: BilledAccountQuery): Promise<UnbilledSummary[]> {
    return await this.repository.findUnbilledSummary(query);
  }

  async getWithRemarksSummary(query: BilledAccountQuery): Promise<WithRemarksSummary[]> {
    return await this.getWithRemarksSummary(query);
  }

  async mobileSummaryReport(data: { meterReaderId: string; datetimeCompleted: string }): Promise<string> {
    return await this.repository.mobileSummaryReport(data);
  }
}
