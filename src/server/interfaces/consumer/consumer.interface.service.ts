import { ScheduleReadingAccount } from "@mr/server/types/consumer.type";

export interface IConsumerService {
  getConsumerDetails(meterReaderId: string): Promise<ScheduleReadingAccount>;
}
