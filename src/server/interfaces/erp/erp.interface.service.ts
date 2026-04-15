import { ReadingAccount } from "@mr/server/types/erp.type";
import { ReadingAccountQuery } from "@mr/server/types/report.type";

export interface IERPService {
  getAllReadingAccount(query: ReadingAccountQuery): Promise<ReadingAccount[]>;
}
