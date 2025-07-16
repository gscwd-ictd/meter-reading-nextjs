import {
  CreateAssignedMeterReader,
  EmployeeDetails,
  MeterReader,
  MeterReaderEnhance,
  PaginatedMeterReaderEnhance,
  PaginatedEmployeeDetails,
  AssignMeterReader,
} from "@/server/types/meter-reader.type";

export interface IMeterReaderRepository {
  findEmployeeDetailsByName(query: string): Promise<EmployeeDetails[]>;

  findEmployeeDetailsById(employeeId: string): Promise<EmployeeDetails>;

  findUnassignedMeterReaders(
    page: number,
    limit: number,
    query: string,
  ): Promise<EmployeeDetails[] | PaginatedEmployeeDetails>;

  findAssignedMeterReaders(
    page: number,
    limit: number,
    query: string,
  ): Promise<MeterReaderEnhance[] | PaginatedMeterReaderEnhance>;

  assignMeterReader(data: AssignMeterReader): Promise<MeterReaderEnhance>;

  findMeterReaderById(meterReaderId: string): Promise<MeterReaderEnhance>;

  updateMeterReaderById(id: string, data: CreateAssignedMeterReader): Promise<MeterReader>;

  removeMeterReaderById(meterReaderId: string): Promise<MeterReaderEnhance>;

  /* 
  updateById
  removeById
  */
}
