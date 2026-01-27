import {
  BilledSummary,
  MobileSummaryReport,
  UnbilledSummary,
  WithRemarksSummary,
} from "@mr/server/types/meter-reading-summary.type";
import { BilledAccountQuery, MobileSummaryQuery } from "@mr/server/types/report.type";

export interface IMeterReadingSummaryService {
  getBilledSummary(query: BilledAccountQuery): Promise<BilledSummary[]>;
  getUnbilledSummary(query: BilledAccountQuery): Promise<UnbilledSummary[]>;
  getWithRemarksSummary(query: BilledAccountQuery): Promise<WithRemarksSummary[]>;
  mobileSummaryReport(data: MobileSummaryQuery): Promise<MobileSummaryReport>;
}
