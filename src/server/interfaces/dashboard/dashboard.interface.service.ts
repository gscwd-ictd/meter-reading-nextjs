import { ConsumerCount } from "@mr/server/types/dashboard.type";

export interface IDashboardService {
  countConsumer(): Promise<ConsumerCount>;
}
