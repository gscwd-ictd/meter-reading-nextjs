import {
  CreateMeterReaderScheduleZoneBook,
  CreateSchedule,
  MeterReaderZoneBook,
  Schedule,
} from "@/server/types/schedule.type";

export interface IScheduleRepository {
  findScheduleByMonthYear(month: string, year: string): Promise<Schedule[]>;
  findScheduleByExactDate(query: string): Promise<Schedule | object>;
  createMonthYearSchedule(input: CreateSchedule[]): Promise<Schedule[]>;

  removeScheduleByMonthYear(month: string, year: string): Promise<Schedule[]>;
  removeSchedueByExactDate(query: string): Promise<Schedule>;

  findMeterReaderZoneBookByScheduleMeterReaderId(scheduleMeterReaderId: string): Promise<MeterReaderZoneBook>;
  createMeterReaderScheduleZoneBook(input: CreateMeterReaderScheduleZoneBook): Promise<MeterReaderZoneBook>;
}
