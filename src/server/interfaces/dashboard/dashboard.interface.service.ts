import { ConsumerCount, MonthlyReadingCounts } from "@mr/server/types/dashboard.type";

export interface IDashboardService {
  countConsumer(): Promise<ConsumerCount>;
  getMonthlyReadingCounts(): Promise<MonthlyReadingCounts>;
}
