import {
  BilledSummary,
  UnbilledSummary,
  WithRemarksSummary,
} from "@mr/server/types/meter-reading-summary.type";
import { BilledAccountQuery } from "@mr/server/types/report.type";

export interface IMeterReadingSummaryService {
  getBilledSummary(query: BilledAccountQuery): Promise<BilledSummary[]>;
  getUnbilledSummary(query: BilledAccountQuery): Promise<UnbilledSummary[]>;
  getWithRemarksSummary(query: BilledAccountQuery): Promise<WithRemarksSummary[]>;
}
