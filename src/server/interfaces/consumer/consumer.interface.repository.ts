import { Consumer } from "@/server/types/consumer.type";

export interface IConsumerRepository {
  findConsumerDetails(meterReaderId: string): Promise<Consumer[]>;
}
