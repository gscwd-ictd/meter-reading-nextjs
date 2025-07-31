import { AssignZoneBookArea, UpdateZoneBookArea, ZoneBook } from "@mr/server/types/zone-book.type";

export interface IZoneBookService {
  getAllZoneBooksWithArea(): Promise<ZoneBook[]>;
  getZoneBookAreaById(zoneBookId: string): Promise<ZoneBook>;
  assignZoneBookArea(data: AssignZoneBookArea): Promise<ZoneBook>;
  updateZoneBookArea(zoneBookId: string, data: UpdateZoneBookArea): Promise<ZoneBook>;
}
