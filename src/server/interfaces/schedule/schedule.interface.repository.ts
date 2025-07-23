import {
  CreateMeterReaderScheduleZoneBook,
  CreateSchedule,
  MeterReaderZoneBook,
  ScheduleReading,
} from "@mr/server/types/schedule.type";

export interface IScheduleRepository {
  findScheduleByMonthYear(month: number, year: number): Promise<ScheduleReading[]>;
  findScheduleByDate(date: string): Promise<ScheduleReading | object>;
  createMonthYearSchedule(data: CreateSchedule[]): Promise<ScheduleReading[]>;

  removeScheduleByMonthYear(month: number, year: number): Promise<ScheduleReading[]>;
  removeScheduleByDate(date: string): Promise<ScheduleReading | object>;

  findMeterReaderZoneBookByScheduleMeterReaderId(scheduleMeterReaderId: string): Promise<MeterReaderZoneBook>;
  createMeterReaderScheduleZoneBook(input: CreateMeterReaderScheduleZoneBook): Promise<MeterReaderZoneBook>;
}
