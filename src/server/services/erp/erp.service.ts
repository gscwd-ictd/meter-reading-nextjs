import { IERPRepository } from "@mr/server/interfaces/erp/erp.interface.repository";
import { IERPService } from "@mr/server/interfaces/erp/erp.interface.service";
import { ReadingAccount } from "@mr/server/types/erp.type";
import { ReadingAccountQuery } from "@mr/server/types/report.type";

export class ERPService implements IERPService {
  constructor(private readonly repository: IERPRepository) {}
  async getAllReadingAccount(query: ReadingAccountQuery): Promise<ReadingAccount[]> {
    return await this.repository.findAllReadingAccount(query);
  }
}
