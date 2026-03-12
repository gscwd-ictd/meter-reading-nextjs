import {
  ConsumerCount,
  CountReadingsByReaderZoneBook,
  MonthlyReadingCounts,
} from "@mr/server/types/dashboard.type";

export interface IDashboardRepository {
  countConsumer(): Promise<ConsumerCount>;
  getMonthlyReadingCounts(): Promise<MonthlyReadingCounts>;
  mobileCountReadingsByReaderZoneBook(
    meterReaderId: string,
    zone: string,
    book: string,
  ): Promise<CountReadingsByReaderZoneBook>;
}
