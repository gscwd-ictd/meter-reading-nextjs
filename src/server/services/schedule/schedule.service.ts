import { IScheduleRepository } from "@mr/server/interfaces/schedule/schedule.interface.repository";
import { IScheduleService } from "@mr/server/interfaces/schedule/schedule.interface.service";
import {
  CreateMeterReaderScheduleZoneBook,
  CreateSchedule,
  MeterReaderZoneBook,
  Schedule,
  ScheduleReading,
} from "@mr/server/types/schedule.type";

export class ScheduleService implements IScheduleService {
  constructor(private readonly repository: IScheduleRepository) {}

  async getScheduleByMonthYear(month: number, year: number): Promise<ScheduleReading[]> {
    return await this.repository.findScheduleByMonthYear(month, year);
  }

  async getScheduleByDate(date: string): Promise<ScheduleReading | object> {
    return await this.repository.findScheduleByDate(date);
  }

  async addMonthYearSchedule(data: CreateSchedule[]): Promise<ScheduleReading[]> {
    return await this.repository.createMonthYearSchedule(data);
  }

  async deleteScheduleByMonthYear(month: number, year: number): Promise<ScheduleReading[]> {
    return await this.repository.removeScheduleByMonthYear(month, year);
  }

  async deleteScheduleByDate(date: string): Promise<ScheduleReading | object> {
    return await this.repository.removeScheduleByDate(date);
  }

  async getMeterReaderZoneBookByScheduleMeterReaderId(
    scheduleMeterReaderId: string,
  ): Promise<MeterReaderZoneBook> {
    return await this.repository.findMeterReaderZoneBookByScheduleMeterReaderId(scheduleMeterReaderId);
  }

  async addMeterReaderScheduleZoneBook(
    input: CreateMeterReaderScheduleZoneBook,
  ): Promise<MeterReaderZoneBook> {
    return await this.repository.createMeterReaderScheduleZoneBook(input);
  }
}
