import { ReadingAccount } from "@mr/server/types/erp.type";

export interface IERPRepository {
  findAllReadingAccount(readingMonth: string): Promise<ReadingAccount[]>;
}
