import { ConsumerCount } from "@mr/server/types/dashboard.type";

export interface IDashboardRepository {
  countConsumer(): Promise<ConsumerCount>;
}
