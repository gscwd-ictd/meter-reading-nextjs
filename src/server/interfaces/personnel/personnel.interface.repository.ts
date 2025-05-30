import { Personnel } from "@/server/types/personnel.type";

export interface IPersonnelRepository {
  findAllPersonnels(page: number, limit: number, query: string): Promise<Personnel[]>;
  findPersonnelById(id: string): Promise<Personnel>;
}
