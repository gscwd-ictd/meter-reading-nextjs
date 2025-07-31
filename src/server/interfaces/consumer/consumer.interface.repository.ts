import { Consumer } from "@mr/server/types/consumer.type";

export interface IConsumerRepository {
  findConsumerDetails(meterReaderId: string): Promise<Consumer[]>;
}
