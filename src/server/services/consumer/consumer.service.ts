import { IConsumerService } from "@mr/server/interfaces/consumer/consumer.interface.service";
import { ConsumerRepository } from "./consumer.repository";
import { ScheduleReadingAccount } from "@mr/server/types/consumer.type";

export class ConsumerService implements IConsumerService {
  constructor(private readonly repository: ConsumerRepository) {}

  async getConsumerDetails(meterReaderId: string): Promise<ScheduleReadingAccount> {
    return await this.repository.findConsumerDetails(meterReaderId);
  }
}
