import {
  CreateMeterReaderScheduleZoneBook,
  CreateSchedule,
  MeterReaderZoneBook,
  Schedule,
} from "@/server/types/schedule.type";

export interface IScheduleService {
  getScheduleByMonthYear(month: string, year: string): Promise<Schedule[]>;
  getScheduleByExactDate(query: string): Promise<Schedule | object>;
  addMonthYearSchedule(data: CreateSchedule[]): Promise<Schedule[]>;

  deleteScheduleByMonthYear(month: string, year: string): Promise<Schedule[]>;
  deleteScheduelByExactYear(query: string): Promise<Schedule>;

  getMeterReaderZoneBookByScheduleMeterReaderId(scheduleMeterReaderId: string): Promise<MeterReaderZoneBook>;
  addMeterReaderScheduleZoneBook(input: CreateMeterReaderScheduleZoneBook): Promise<MeterReaderZoneBook>;
}
