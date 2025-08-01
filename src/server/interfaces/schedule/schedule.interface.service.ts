import {
  CreateMeterReaderScheduleReading,
  //CreateMeterReaderScheduleZoneBook,
  CreateMonthSchedule,
  ScheduleMeterReaderZoneBook,
  ScheduleReading,
} from "@mr/server/types/schedule.type";

export interface IScheduleService {
  getScheduleByMonthYear(month: number, year: number): Promise<ScheduleReading[]>;
  getScheduleByDate(date: string): Promise<ScheduleReading | object>;
  addMonthYearSchedule(data: CreateMonthSchedule[]): Promise<ScheduleReading[]>;
  deleteScheduleByMonthYear(month: number, year: number): Promise<ScheduleReading[]>;
  deleteScheduleByDate(date: string): Promise<ScheduleReading | object>;

  getMeterReaderZoneBookByScheduleMeterReaderId(
    scheduleMeterReaderId: string,
  ): Promise<ScheduleMeterReaderZoneBook>;

  addMeterReaderScheduleZoneBook(
    data: CreateMeterReaderScheduleReading,
  ): Promise<ScheduleMeterReaderZoneBook>;
}
