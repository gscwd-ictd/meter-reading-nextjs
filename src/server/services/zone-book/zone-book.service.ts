import { IZoneBookRepository } from "@/server/interfaces/zone-book/zone-book.interface.repository";
import { IZoneBookService } from "@/server/interfaces/zone-book/zone-book.interface.service";
import { AssignedAreaZoneBook, CreateAssignedAreaZoneBook, ZoneBook } from "@/server/types/zone-book.type";

export class ZoneBookService implements IZoneBookService {
  constructor(private readonly repository: IZoneBookRepository) {}

  async getZoneBook(): Promise<ZoneBook[]> {
    return await this.repository.findZoneBook();
  }

  async getUnassignedAreaZoneBook(): Promise<ZoneBook[]> {
    return await this.repository.findUnassignedAreaZoneBook();
  }

  async getAssignedAreaZoneBook(): Promise<AssignedAreaZoneBook[]> {
    return await this.repository.findAssignedAreaZoneBook();
  }

  async addAssignedAreaZoneBook(data: CreateAssignedAreaZoneBook): Promise<AssignedAreaZoneBook> {
    return await this.repository.createAssignedAreaZoneBook(data);
  }
}
