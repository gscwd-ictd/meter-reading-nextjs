import { ConsumerDetails } from "@mr/server/types/consumer.type";

export interface IConsumerService {
  getConsumerDetails(accountNumber: string): Promise<ConsumerDetails>;
}
