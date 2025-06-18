import {
  AssignedMeterReader,
  CreateAssignedMeterReader,
  MeterReader,
  PaginatedAssignedMeterReader,
  PaginatedUnassignedMeterReader,
  UnassignedMeterReader,
} from "@/server/types/meter-reader.type";

export interface IMeterReaderService {
  getUnassignedMeterReader(
    page: number,
    limit: number,
    query: string,
  ): Promise<UnassignedMeterReader[] | PaginatedUnassignedMeterReader>;

  getAssignedMeterReader(
    page: number,
    limit: number,
    query: string,
  ): Promise<AssignedMeterReader[] | PaginatedAssignedMeterReader>;

  addMeterReader(data: CreateAssignedMeterReader): Promise<MeterReader>;

  // getPersonnel(): Promise<PersonnelAssignable[]>;
  // getAllPersonnel(page: number, limit: number, query: string): Promise<Personnel[] | PaginatedPersonnel>;
  getMeterReaderById(id: string): Promise<AssignedMeterReader>;
  /* 
  updateById
  deleteById
  */
}
