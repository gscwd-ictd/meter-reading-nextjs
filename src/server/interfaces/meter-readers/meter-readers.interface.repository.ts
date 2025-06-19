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

  findMeterReaderById(id: string): Promise<AssignedMeterReader>;

  //updateMeterReaderById(id: string, data: CreateAssignedMeterReader): Promise<MeterReader>;
  /* 
  updateById
  removeById
  */
}
