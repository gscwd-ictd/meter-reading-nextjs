import { ScheduleReadingAccount } from "@mr/server/types/consumer.type";

export interface IConsumerRepository {
  findConsumerDetails(meterReaderId: string): Promise<ScheduleReadingAccount>;
}
