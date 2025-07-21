import {
  CreateMeterReaderScheduleZoneBook,
  CreateSchedule,
  MeterReaderZoneBook,
  Schedule,
  ScheduleReading,
} from "@mr/server/types/schedule.type";

export interface IScheduleService {
  getScheduleByMonthYear(month: string, year: string): Promise<ScheduleReading[]>;
  getScheduleByExactDate(query: string): Promise<ScheduleReading | object>;

  addMonthYearSchedule(data: CreateSchedule[]): Promise<Schedule[]>;

  deleteScheduleByMonthYear(month: string, year: string): Promise<Schedule[]>;
  deleteScheduelByExactYear(query: string): Promise<Schedule>;

  getMeterReaderZoneBookByScheduleMeterReaderId(scheduleMeterReaderId: string): Promise<MeterReaderZoneBook>;
  addMeterReaderScheduleZoneBook(input: CreateMeterReaderScheduleZoneBook): Promise<MeterReaderZoneBook>;
}
