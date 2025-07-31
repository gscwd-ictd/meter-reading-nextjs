import { IScheduleRepository } from "@mr/server/interfaces/schedule/schedule.interface.repository";
import { IScheduleService } from "@mr/server/interfaces/schedule/schedule.interface.service";
import {
  CreateMeterReaderScheduleReading,
  CreateMonthSchedule,
  ScheduleMeterReaderZoneBook,
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

  async addMonthYearSchedule(data: CreateMonthSchedule[]): Promise<ScheduleReading[]> {
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
  ): Promise<ScheduleMeterReaderZoneBook> {
    return await this.repository.findMeterReaderZoneBookByScheduleMeterReaderId(scheduleMeterReaderId);
  }

  async addMeterReaderScheduleZoneBook(
    data: CreateMeterReaderScheduleReading,
  ): Promise<ScheduleMeterReaderZoneBook> {
    return await this.repository.createMeterReaderScheduleZoneBook(data);
  }
}
