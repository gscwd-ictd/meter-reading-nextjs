import { Consumer } from "@/server/types/consumer.type";

export interface IConsumerService {
  getConsumerDetails(meterReaderId: string): Promise<Consumer[]>;
}
