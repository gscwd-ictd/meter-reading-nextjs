import {
  ConsumerCount,
  CountReadingsByReaderZoneBook,
  MonthlyReadingCounts,
} from "@mr/server/types/dashboard.type";

export interface IDashboardService {
  countConsumer(): Promise<ConsumerCount>;
  getMonthlyReadingCounts(): Promise<MonthlyReadingCounts>;
  getReadingsByReaderZoneBookCounts(
    meterReaderId: string,
    zone: string,
    book: string,
  ): Promise<CountReadingsByReaderZoneBook>;
}
