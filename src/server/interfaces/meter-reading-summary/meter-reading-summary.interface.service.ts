import {
  BilledSummary,
  MobileSummaryReport,
  NewMeterSummary,
  Report,
  UnbilledSummary,
  WithRemarksSummary,
  ZoneBookSummaryRow,
} from "@mr/server/types/meter-reading-summary.type";
import { BilledAccountQuery, MobileSummaryQuery } from "@mr/server/types/report.type";

export interface IMeterReadingSummaryService {
  getBilledSummary(query: BilledAccountQuery): Promise<BilledSummary[]>;
  getUnbilledSummary(query: BilledAccountQuery): Promise<UnbilledSummary[]>;
  getWithRemarksSummary(query: BilledAccountQuery): Promise<WithRemarksSummary[]>;
  getNewMeterSummary(query: BilledAccountQuery): Promise<NewMeterSummary[]>;
  getMonthBillingSummary(readingMonth: string): Promise<Report>;
  getZoneBookSummary(readingMonth: string): Promise<ZoneBookSummaryRow[]>;
  mobileSummaryReport(data: MobileSummaryQuery): Promise<MobileSummaryReport>;
}
