import { IPersonnelRepository } from "@/server/interfaces/personnel/personnel.interface.repository";
import { IPersonnelService } from "@/server/interfaces/personnel/personnel.interface.service";
import {
  AssignedPersonnel,
  CreateAssignedPersonnel,
  PaginatedAssignedPersonnel,
  PaginatedUnassignedPersonnel,
  Personnel,
  UnassignedPersonnel,
} from "@/server/types/personnel.type";

export class PersonnelService implements IPersonnelService {
  constructor(private readonly repository: IPersonnelRepository) {}

  async getUnassignedPersonnel(
    page: number,
    limit: number,
    query: string,
  ): Promise<UnassignedPersonnel[] | PaginatedUnassignedPersonnel> {
    return await this.repository.findUnassignedPersonnel(page, limit, query);
  }

  async getAssignedPersonnel(
    page: number,
    limit: number,
    query: string,
  ): Promise<AssignedPersonnel[] | PaginatedAssignedPersonnel> {
    return await this.repository.findAssignedPersonnel(page, limit, query);
  }

  async addPersonnel(data: CreateAssignedPersonnel): Promise<Personnel> {
    return await this.repository.createPersonnel(data);
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

  // async getPersonnelById(id: string): Promise<Personnel> {
  //   return await this.repository.findPersonnelById(id);
  // }
}
