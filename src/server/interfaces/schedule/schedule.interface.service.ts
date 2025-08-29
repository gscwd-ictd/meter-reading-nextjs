import {
  CreateMeterReaderScheduleReading,
  //CreateMeterReaderScheduleZoneBook,
  CreateMonthSchedule,
  CreateScheduleMeterReader,
  ScheduleMeterReaderZoneBook,
  ScheduleReading,
  ZoneBookScheduleReader,
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

  deleteScheduleMeterReaderById(scheduleMeterReaderId: string): Promise<ScheduleMeterReaderZoneBook>;

  addScheduleMeterReader(data: CreateScheduleMeterReader): Promise<ScheduleMeterReaderZoneBook>;

  getZoneBookScheduleReader(month: number, year: number): Promise<ZoneBookScheduleReader[]>;
}
