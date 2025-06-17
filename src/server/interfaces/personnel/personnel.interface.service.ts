import {
  AssignedPersonnel,
  CreateAssignedPersonnel,
  PaginatedAssignedPersonnel,
  PaginatedUnassignedPersonnel,
  Personnel,
  UnassignedPersonnel,
} from "@/server/types/personnel.type";

export interface IPersonnelService {
  getUnassignedPersonnel(
    page: number,
    limit: number,
    query: string,
  ): Promise<UnassignedPersonnel[] | PaginatedUnassignedPersonnel>;

  getAssignedPersonnel(
    page: number,
    limit: number,
    query: string,
  ): Promise<AssignedPersonnel[] | PaginatedAssignedPersonnel>;

  addPersonnel(data: CreateAssignedPersonnel): Promise<Personnel>;

  // getPersonnel(): Promise<PersonnelAssignable[]>;
  // getAllPersonnel(page: number, limit: number, query: string): Promise<Personnel[] | PaginatedPersonnel>;
  getPersonnelById(id: string): Promise<AssignedPersonnel>;
  /* 
  updateById
  deleteById
  */
}
