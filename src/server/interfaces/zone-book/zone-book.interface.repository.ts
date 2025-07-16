import { AssignZoneBookArea, UpdateZoneBookArea, ZoneBook } from "@/server/types/zone-book.type";

export interface IZoneBookRepository {
  findAllZoneBooksWithArea(): Promise<ZoneBook[]>;
  findZoneBookWithAreaById(zoneBookId: string): Promise<ZoneBook>;
  assignZoneBookArea(data: AssignZoneBookArea): Promise<ZoneBook>;
  updateZoneBookArea(zoneBookId: string, data: UpdateZoneBookArea): Promise<ZoneBook>;
  // findUnassignedAreaZoneBook(): Promise<ZoneBook[]>;
  // findAssignedAreaZoneBook(): Promise<AssignedAreaZoneBook[]>;
  //createAssignedAreaZoneBook(data: CreateAssignedAreaZoneBook): Promise<AssignedAreaZoneBook>;
  /* 
  updateById
  removeById
  */
}
