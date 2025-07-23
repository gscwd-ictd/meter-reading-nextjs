import {
  CreateMeterReaderScheduleZoneBook,
  CreateSchedule,
  MeterReaderZoneBook,
  ScheduleReading,
} from "@mr/server/types/schedule.type";

export interface IScheduleService {
  getScheduleByMonthYear(month: number, year: number): Promise<ScheduleReading[]>;
  getScheduleByDate(date: string): Promise<ScheduleReading | object>;
  addMonthYearSchedule(data: CreateSchedule[]): Promise<ScheduleReading[]>;

  deleteScheduleByMonthYear(month: number, year: number): Promise<ScheduleReading[]>;
  deleteScheduleByDate(date: string): Promise<ScheduleReading | object>;

  getMeterReaderZoneBookByScheduleMeterReaderId(scheduleMeterReaderId: string): Promise<MeterReaderZoneBook>;
  addMeterReaderScheduleZoneBook(input: CreateMeterReaderScheduleZoneBook): Promise<MeterReaderZoneBook>;
}
