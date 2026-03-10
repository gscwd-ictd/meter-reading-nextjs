import { ConsumerCount, MonthlyReadingCounts } from "@mr/server/types/dashboard.type";

export interface IDashboardRepository {
  countConsumer(): Promise<ConsumerCount>;
  getMonthlyReadingCounts(): Promise<MonthlyReadingCounts>;
}
