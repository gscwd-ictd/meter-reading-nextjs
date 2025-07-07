import z4 from "zod/v4";
import { AccountHistoryRepository } from "../repositories/AccountHistoryRepository";
import {
  AccountHistory,
  CreateAccountHistorySchema,
  UpdateAccountHistorySchema,
} from "../validators/account-history-schema";

export class AccountHistoryService {
  constructor(private readonly accountHistoryRepository: AccountHistoryRepository) {}

  async create(dto: AccountHistory): Promise<AccountHistory> {
    return await this.accountHistoryRepository.create(dto);
  }

  async getAll(): Promise<AccountHistory[]> {
    return await this.accountHistoryRepository.getAll();
  }

  async getById(id: string): Promise<AccountHistory> {
    return await this.accountHistoryRepository.getById(id);
  }

  async update(id: string, dto: z4.infer<typeof UpdateAccountHistorySchema>): Promise<AccountHistory> {
    return await this.accountHistoryRepository.update(id, dto);
  }

  async delete(id: string) {
    return await this.accountHistoryRepository.delete(id);
  }
}
