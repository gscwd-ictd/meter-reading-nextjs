import { Consumer } from "@mr/server/types/consumer.type";

export interface IConsumerService {
  getConsumerDetails(meterReaderId: string): Promise<Consumer[]>;
}
