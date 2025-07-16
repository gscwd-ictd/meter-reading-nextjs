import { IScheduleRepository } from "@/server/interfaces/schedule/schedule.interface.repository";
import { IScheduleService } from "@/server/interfaces/schedule/schedule.interface.service";
import {
  CreateMeterReaderScheduleZoneBook,
  CreateSchedule,
  MeterReaderZoneBook,
  Schedule,
} from "@/server/types/schedule.type";

export class ScheduleService implements IScheduleService {
  constructor(private readonly repository: IScheduleRepository) {}

  async getScheduleByMonthYear(month: string, year: string): Promise<Schedule[]> {
    return await this.repository.findScheduleByMonthYear(month, year);
  }

  async getScheduleByExactDate(query: string): Promise<Schedule | object> {
    return await this.repository.findScheduleByExactDate(query);
  }

  async addMonthYearSchedule(data: CreateSchedule[]): Promise<Schedule[]> {
    return await this.repository.createMonthYearSchedule(data);
  }

  async deleteScheduleByMonthYear(month: string, year: string): Promise<Schedule[]> {
    return await this.repository.removeScheduleByMonthYear(month, year);
  }

  async deleteScheduelByExactYear(query: string): Promise<Schedule> {
    return await this.repository.removeSchedueByExactDate(query);
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
