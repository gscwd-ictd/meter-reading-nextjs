import {
  AssignedMeterReader,
  CreateAssignedMeterReader,
  MeterReader,
  PaginatedAssignedMeterReader,
  PaginatedUnassignedMeterReader,
  UnassignedMeterReader,
} from "@/server/types/meter-reader.type";

export interface IMeterReaderRepository {
  findUnassignedMeterReader(
    page: number,
    limit: number,
    query: string,
  ): Promise<UnassignedMeterReader[] | PaginatedUnassignedMeterReader>;

  findAssignedMeterReader(
    page: number,
    limit: number,
    query: string,
  ): Promise<AssignedMeterReader[] | PaginatedAssignedMeterReader>;

  createMeterReader(data: CreateAssignedMeterReader): Promise<MeterReader>;

  // findPersonnel(): Promise<PersonnelAssignable[]>;
  // findAllPersonnel(page: number, limit: number, query: string): Promise<Personnel[] | PaginatedPersonnel>;
  findMeterReaderById(id: string): Promise<AssignedMeterReader>;
  /* 
  updateById
  removeById
  */
}
