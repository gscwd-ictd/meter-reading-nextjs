import { AssignedAreaZoneBook, CreateAssignedAreaZoneBook, ZoneBook } from "@/server/types/zone-book.type";

export interface IZoneBookRepository {
  findZoneBook(): Promise<ZoneBook[]>;
  findUnassignedAreaZoneBook(): Promise<ZoneBook[]>;
  findAssignedAreaZoneBook(): Promise<AssignedAreaZoneBook[]>;
  createAssignedAreaZoneBook(data: CreateAssignedAreaZoneBook): Promise<AssignedAreaZoneBook>;
  /* 
  updateById
  removeById
  */
}
