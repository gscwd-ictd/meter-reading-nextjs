import {
  CreateAssignedMeterReader,
  EmployeeDetails,
  MeterReader,
  MeterReaderEnhance,
  PaginatedMeterReaderEnhance,
  PaginatedEmployeeDetails,
  AssignMeterReader,
} from "@/server/types/meter-reader.type";

export interface IMeterReaderService {
  getEmployeeDetailsByName(query: string): Promise<EmployeeDetails[]>;

  getEmployeeDetailsById(employeeId: string): Promise<EmployeeDetails>;

  getUnassignedMeterReaders(
    page: number,
    limit: number,
    query: string,
  ): Promise<EmployeeDetails[] | PaginatedEmployeeDetails>;

  getAssignedMeterReaders(
    page: number,
    limit: number,
    query: string,
  ): Promise<MeterReaderEnhance[] | PaginatedMeterReaderEnhance>;

  assignMeterReader(data: AssignMeterReader): Promise<MeterReaderEnhance>;

  getMeterReaderById(meterReaderId: string): Promise<MeterReaderEnhance>;

  updateMeterReaderById(meterReaderId: string, data: CreateAssignedMeterReader): Promise<MeterReader>;

  deleteMeterReaderById(meterReaderId: string): Promise<MeterReaderEnhance>;
  /* 
  updateById
  deleteById
  */
}

/* 

  meter login -> meter reader id -> schedule (zone-book based date today)

  filter 3 tables
  
  lib_consumers
  viewMeterReading

  usage
  viewConsumer_previouse_4_months

  history
  viewCustomer_ledger_services


*/
