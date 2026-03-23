import {
  BilledSummary,
  MobileSummaryReport,
  NewMeterSummary,
  UnbilledSummary,
  WithRemarksSummary,
} from "@mr/server/types/meter-reading-summary.type";
import { BilledAccountQuery, MobileSummaryQuery } from "@mr/server/types/report.type";

export interface IMeterReadingSummaryRepository {
  findBilledSummary(query: BilledAccountQuery): Promise<BilledSummary[]>;
  findUnbilledSummary(query: BilledAccountQuery): Promise<UnbilledSummary[]>;
  findWithRemarksSummary(query: BilledAccountQuery): Promise<WithRemarksSummary[]>;
  findNewMeterSummary(query: BilledAccountQuery): Promise<NewMeterSummary[]>;
  mobileSummaryReport(data: MobileSummaryQuery): Promise<MobileSummaryReport>;
}
