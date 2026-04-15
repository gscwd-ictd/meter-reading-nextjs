import { ReadingAccount } from "@mr/server/types/erp.type";

export interface IERPService {
  getAllReadingAccount(readingMonth: string): Promise<ReadingAccount[]>;
}
