import { Personnel } from "@/server/types/personnel.type";

export interface IPersonnelService {
  getAllPersonnels(page: number, limit: number, query: string): Promise<Personnel[]>;
  getPersonnelById(id: string): Promise<Personnel>;
}
