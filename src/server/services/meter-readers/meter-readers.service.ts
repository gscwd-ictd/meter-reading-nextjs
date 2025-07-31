import { IMeterReaderRepository } from "@mr/server/interfaces/meter-readers/meter-readers.interface.repository";
import { IMeterReaderService } from "@mr/server/interfaces/meter-readers/meter-readers.interface.service";
import {
  EmployeeDetails,
  MeterReader,
  PaginatedMeterReader,
  PaginatedEmployeeDetails,
  AssignMeterReader,
  MeterReaderDetails,
} from "@mr/server/types/meter-reader.type";
import { ZoneBook } from "@mr/server/types/zone-book.type";

export class MeterReaderService implements IMeterReaderService {
  constructor(private readonly repository: IMeterReaderRepository) {}

  async getEmployeeDetailsByName(query: string): Promise<EmployeeDetails[]> {
    return this.repository.findEmployeeDetailsByName(query);
  }

  async getEmployeeDetailsById(employeeId: string): Promise<EmployeeDetails> {
    return this.repository.findEmployeeDetailsById(employeeId);
  }

  async getZoneBookByStatus(status: string): Promise<ZoneBook[]> {
    return this.repository.findZoneBookByStatus(status);
  }

  async getUnassignedMeterReaders(
    page: number,
    limit: number,
    query: string,
  ): Promise<EmployeeDetails[] | PaginatedEmployeeDetails> {
    return await this.repository.findUnassignedMeterReaders(page, limit, query);
  }

  async getAssignedMeterReaders(
    page: number,
    limit: number,
    query: string,
  ): Promise<MeterReader[] | PaginatedMeterReader> {
    return await this.repository.findAssignedMeterReaders(page, limit, query);
  }

  async assignMeterReader(data: AssignMeterReader): Promise<MeterReader> {
    return await this.repository.assignMeterReader(data);
  }

  async getMeterReaderDetailsById(meterReaderId: string): Promise<MeterReaderDetails> {
    return await this.repository.findMeterReaderDetailsById(meterReaderId);
  }

  async getMeterReaderWithZoneBookById(meterReaderId: string): Promise<MeterReader> {
    return await this.repository.findMeterReaderWithZoneBookById(meterReaderId);
  }

  async updateMeterReaderById(id: string, data: AssignMeterReader): Promise<MeterReader> {
    return await this.repository.updateMeterReaderById(id, data);
  }

  async deleteMeterReaderById(meterReaderId: string): Promise<MeterReader> {
    return await this.repository.removeMeterReaderById(meterReaderId);
  }
}
