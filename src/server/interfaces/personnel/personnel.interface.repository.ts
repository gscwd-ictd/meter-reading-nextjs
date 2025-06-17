import {
  AssignedPersonnel,
  CreateAssignedPersonnel,
  PaginatedAssignedPersonnel,
  PaginatedUnassignedPersonnel,
  Personnel,
  UnassignedPersonnel,
} from "@/server/types/personnel.type";

export interface IPersonnelRepository {
  findUnassignedPersonnel(
    page: number,
    limit: number,
    query: string,
  ): Promise<UnassignedPersonnel[] | PaginatedUnassignedPersonnel>;

  findAssignedPersonnel(
    page: number,
    limit: number,
    query: string,
  ): Promise<AssignedPersonnel[] | PaginatedAssignedPersonnel>;

  createPersonnel(data: CreateAssignedPersonnel): Promise<Personnel>;

  // findPersonnel(): Promise<PersonnelAssignable[]>;
  // findAllPersonnel(page: number, limit: number, query: string): Promise<Personnel[] | PaginatedPersonnel>;
  findPersonnelById(id: string): Promise<AssignedPersonnel>;
  /* 
  updateById
  removeById
  */
}
