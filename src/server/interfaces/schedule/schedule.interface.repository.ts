import {
  CreateMeterReaderScheduleReading,
  CreateMonthSchedule,
  ScheduleMeterReaderZoneBook,
  ScheduleReading,
} from "@mr/server/types/schedule.type";

export interface IScheduleRepository {
  findScheduleByMonthYear(month: number, year: number): Promise<ScheduleReading[]>;
  findScheduleByDate(date: string): Promise<ScheduleReading | object>;
  createMonthYearSchedule(data: CreateMonthSchedule[]): Promise<ScheduleReading[]>;

  removeScheduleByMonthYear(month: number, year: number): Promise<ScheduleReading[]>;
  removeScheduleByDate(date: string): Promise<ScheduleReading | object>;

  findMeterReaderZoneBookByScheduleMeterReaderId(
    scheduleMeterReaderId: string,
  ): Promise<ScheduleMeterReaderZoneBook>;

  createMeterReaderScheduleZoneBook(
    data: CreateMeterReaderScheduleReading,
  ): Promise<ScheduleMeterReaderZoneBook>;
}
