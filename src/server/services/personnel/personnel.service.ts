import { IPersonnelRepository } from "@/server/interfaces/personnel/personnel.interface.repository";
import { IPersonnelService } from "@/server/interfaces/personnel/personnel.interface.service";
import { Personnel } from "@/server/types/personnel.type";

export class PersonnelService implements IPersonnelService {
  constructor(private readonly repository: IPersonnelRepository) {}

  async getAllPersonnels(page: number, limit: number, query: string): Promise<Personnel[]> {
    return await this.repository.findAllPersonnels(page, limit, query);
  }

  async getPersonnelById(id: string): Promise<Personnel> {
    return await this.repository.findPersonnelById(id);
  }
}
