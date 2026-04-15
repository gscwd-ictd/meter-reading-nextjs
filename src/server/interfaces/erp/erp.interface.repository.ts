import { ErqQuery, ReadingAccount } from "@mr/server/types/erp.type";

export interface IERPRepository {
  findAllReadingAccount(query: ErqQuery): Promise<ReadingAccount[]>;
}
