import { AssignedAreaZoneBook, CreateAssignedAreaZoneBook, ZoneBook } from "@/server/types/zone-book.type";

export interface IZoneBookService {
  getZoneBook(): Promise<ZoneBook[]>;
  getUnassignedAreaZoneBook(): Promise<ZoneBook[]>;
  getAssignedAreaZoneBook(): Promise<AssignedAreaZoneBook[]>;
  addAssignedAreaZoneBook(data: CreateAssignedAreaZoneBook): Promise<AssignedAreaZoneBook>;
  /* 
  updateById
  removeById
  */
}
