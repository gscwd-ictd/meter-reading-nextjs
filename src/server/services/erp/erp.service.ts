import { IERPRepository } from "@mr/server/interfaces/erp/erp.interface.repository";
import { IERPService } from "@mr/server/interfaces/erp/erp.interface.service";
import { ErqQuery, ReadingAccount } from "@mr/server/types/erp.type";

export class ERPService implements IERPService {
  constructor(private readonly repository: IERPRepository) {}
  async getAllReadingAccount(query: ErqQuery): Promise<ReadingAccount[]> {
    return await this.repository.findAllReadingAccount(query);
  }
}
