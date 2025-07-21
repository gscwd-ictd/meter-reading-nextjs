import {
  CreateMeterReaderScheduleZoneBook,
  CreateSchedule,
  MeterReaderZoneBook,
  Schedule,
  ScheduleReading,
} from "@mr/server/types/schedule.type";

export interface IScheduleRepository {
  findScheduleByMonthYear(month: string, year: string): Promise<ScheduleReading[]>;
  findScheduleByExactDate(query: string): Promise<ScheduleReading | object>;

  createMonthYearSchedule(input: CreateSchedule[]): Promise<Schedule[]>;

  removeScheduleByMonthYear(month: string, year: string): Promise<Schedule[]>;
  removeSchedueByExactDate(query: string): Promise<Schedule>;

  findMeterReaderZoneBookByScheduleMeterReaderId(scheduleMeterReaderId: string): Promise<MeterReaderZoneBook>;
  createMeterReaderScheduleZoneBook(input: CreateMeterReaderScheduleZoneBook): Promise<MeterReaderZoneBook>;
}
