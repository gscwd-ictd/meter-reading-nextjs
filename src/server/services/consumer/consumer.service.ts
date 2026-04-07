import { IConsumerService } from "@mr/server/interfaces/consumer/consumer.interface.service";
import { ConsumerRepository } from "./consumer.repository";
import { ConsumerDetails } from "@mr/server/types/consumer.type";

export class ConsumerService implements IConsumerService {
  constructor(private readonly repository: ConsumerRepository) {}

  async getConsumerDetails(accountNumber: string): Promise<ConsumerDetails> {
    return await this.repository.findConsumerDetails(accountNumber);
  }
}
