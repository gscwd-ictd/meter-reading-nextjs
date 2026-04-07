import { ScheduleReadingAccount } from "@mr/server/types/consumer.type";
import {
  EmployeeDetails,
  MeterReader,
  PaginatedMeterReader,
  PaginatedEmployeeDetails,
  AssignMeterReader,
  MeterReaderDetails,
} from "@mr/server/types/meter-reader.type";
import { ZoneBook } from "@mr/server/types/zone-book.type";

export interface IMeterReaderService {
  getEmployeeDetailsByName(query: string): Promise<EmployeeDetails[]>;

  getEmployeeDetailsById(employeeId: string): Promise<EmployeeDetails>;

  getZoneBookByStatus(status: string): Promise<ZoneBook[]>;

  getUnassignedMeterReaders(
    page: number,
    limit: number,
    query: string,
  ): Promise<EmployeeDetails[] | PaginatedEmployeeDetails>;

  getAssignedMeterReaders(
    page: number,
    limit: number,
    query: string,
  ): Promise<MeterReader[] | PaginatedMeterReader>;

  assignMeterReader(data: AssignMeterReader): Promise<MeterReader>;

  getMeterReaderDetailsById(meterReaderId: string): Promise<MeterReaderDetails>;

  getMeterReaderWithZoneBookById(meterReaderId: string): Promise<MeterReader>;

  updateMeterReaderById(meterReaderId: string, data: AssignMeterReader): Promise<MeterReader>;

  deleteMeterReaderById(meterReaderId: string): Promise<MeterReader>;

  getScheduleReadingAccountByMeterReader(meterReaderId: string): Promise<ScheduleReadingAccount>;
}
