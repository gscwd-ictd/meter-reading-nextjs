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

export interface IMeterReaderRepository {
  findEmployeeDetailsByName(query: string): Promise<EmployeeDetails[]>;

  findEmployeeDetailsById(employeeId: string): Promise<EmployeeDetails>;

  findZoneBookByStatus(status: string): Promise<ZoneBook[]>;

  findUnassignedMeterReaders(
    page: number,
    limit: number,
    query: string,
  ): Promise<EmployeeDetails[] | PaginatedEmployeeDetails>;

  findAssignedMeterReaders(
    page: number,
    limit: number,
    query: string,
  ): Promise<MeterReader[] | PaginatedMeterReader>;

  assignMeterReader(data: AssignMeterReader): Promise<MeterReader>;

  findMeterReaderDetailsById(meterReaderId: string): Promise<MeterReaderDetails>;

  findMeterReaderWithZoneBookById(meterReaderId: string): Promise<MeterReader>;

  updateMeterReaderById(id: string, data: AssignMeterReader): Promise<MeterReader>;

  removeMeterReaderById(meterReaderId: string): Promise<MeterReader>;

  findScheduleReadingAccountByMeterReader(meterReaderId: string): Promise<ScheduleReadingAccount>;
}
