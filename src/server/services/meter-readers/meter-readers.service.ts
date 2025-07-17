import { IMeterReaderRepository } from "@mr/server/interfaces/meter-readers/meter-readers.interface.repository";
import { IMeterReaderService } from "@mr/server/interfaces/meter-readers/meter-readers.interface.service";
import {
  CreateAssignedMeterReader,
  EmployeeDetails,
  MeterReader,
  MeterReaderEnhance,
  PaginatedMeterReaderEnhance,
  PaginatedEmployeeDetails,
  AssignMeterReader,
} from "@mr/server/types/meter-reader.type";

export class MeterReaderService implements IMeterReaderService {
  constructor(private readonly repository: IMeterReaderRepository) {}

  async getEmployeeDetailsByName(query: string): Promise<EmployeeDetails[]> {
    return this.repository.findEmployeeDetailsByName(query);
  }

  async getEmployeeDetailsById(employeeId: string): Promise<EmployeeDetails> {
    return this.repository.findEmployeeDetailsById(employeeId);
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
  ): Promise<MeterReaderEnhance[] | PaginatedMeterReaderEnhance> {
    return await this.repository.findAssignedMeterReaders(page, limit, query);
  }

  async assignMeterReader(data: AssignMeterReader): Promise<MeterReaderEnhance> {
    return await this.repository.assignMeterReader(data);
  }

  async getMeterReaderById(meterReaderId: string): Promise<MeterReaderEnhance> {
    return await this.repository.findMeterReaderById(meterReaderId);
  }

  async updateMeterReaderById(id: string, data: CreateAssignedMeterReader): Promise<MeterReader> {
    return await this.repository.updateMeterReaderById(id, data);
  }

  async deleteMeterReaderById(meterReaderId: string): Promise<MeterReaderEnhance> {
    return await this.repository.removeMeterReaderById(meterReaderId);
  }
}
