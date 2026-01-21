import {
  BilledSummary,
  UnbilledSummary,
  WithRemarksSummary,
} from "@mr/server/types/meter-reading-summary.type";
import { BilledAccountQuery } from "@mr/server/types/report.type";

export interface IMeterReadingSummaryRepository {
  findBilledSummary(query: BilledAccountQuery): Promise<BilledSummary[]>;
  findUnbilledSummary(query: BilledAccountQuery): Promise<UnbilledSummary[]>;
  findWithRemarksSummary(query: BilledAccountQuery): Promise<WithRemarksSummary[]>;
}
