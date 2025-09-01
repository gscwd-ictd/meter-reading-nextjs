import { IZoneBookRepository } from "@mr/server/interfaces/zone-book/zone-book.interface.repository";
import { IZoneBookService } from "@mr/server/interfaces/zone-book/zone-book.interface.service";
import { AssignZoneBookArea, UpdateZoneBookArea, ZoneBook } from "@mr/server/types/zone-book.type";

export class ZoneBookService implements IZoneBookService {
  constructor(private readonly repository: IZoneBookRepository) {}

  async getAllZoneBooksWithArea(): Promise<ZoneBook[]> {
    return this.repository.findAllZoneBooksWithArea();
  }

  async getZoneBookAreaById(zoneBookId: string): Promise<ZoneBook> {
    return this.repository.findZoneBookWithAreaById(zoneBookId);
  }

  async assignZoneBookArea(data: AssignZoneBookArea): Promise<ZoneBook> {
    return this.repository.assignZoneBookArea(data);
  }

  async updateZoneBookArea(zoneBookId: string, data: UpdateZoneBookArea): Promise<ZoneBook> {
    return this.repository.updateZoneBookArea(zoneBookId, data);
  }
}
