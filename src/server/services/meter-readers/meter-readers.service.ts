import { IMeterReaderRepository } from "@/server/interfaces/meter-readers/meter-readers.interface.repository";
import { IMeterReaderService } from "@/server/interfaces/meter-readers/meter-readers.interface.service";
import {
  AssignedMeterReader,
  CreateAssignedMeterReader,
  MeterReader,
  PaginatedAssignedMeterReader,
  PaginatedUnassignedMeterReader,
  UnassignedMeterReader,
} from "@/server/types/meter-reader.type";

export class MeterReaderService implements IMeterReaderService {
  constructor(private readonly repository: IMeterReaderRepository) {}

  async getUnassignedMeterReader(
    page: number,
    limit: number,
    query: string,
  ): Promise<UnassignedMeterReader[] | PaginatedUnassignedMeterReader> {
    return await this.repository.findUnassignedMeterReader(page, limit, query);
  }

  async getAssignedMeterReader(
    page: number,
    limit: number,
    query: string,
  ): Promise<AssignedMeterReader[] | PaginatedAssignedMeterReader> {
    return await this.repository.findAssignedMeterReader(page, limit, query);
  }

  async addMeterReader(data: CreateAssignedMeterReader): Promise<MeterReader> {
    return await this.repository.createMeterReader(data);
  }

  // async getPersonnel(): Promise<PersonnelAssignable[]> {
  //   return await this.repository.findPersonnel();
  // }

  // async getAllPersonnel(
  //   page: number,
  //   limit: number,
  //   query: string,
  // ): Promise<Personnel[] | PaginatedPersonnel> {
  //   return await this.repository.findAllPersonnel(page, limit, query);
  // }

  async getMeterReaderById(id: string): Promise<AssignedMeterReader> {
    return await this.repository.findMeterReaderById(id);
  }

  /* async updateMeterReaderById(id: string, data: CreateAssignedMeterReader): Promise<MeterReader> {
    return await this.repository.updateMeterReaderById(id, data);
  } */
}
