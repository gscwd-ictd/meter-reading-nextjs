import { ConsumerDetails } from "@mr/server/types/consumer.type";

export interface IConsumerRepository {
  findConsumerDetails(accountNumber: string): Promise<ConsumerDetails>;
}
