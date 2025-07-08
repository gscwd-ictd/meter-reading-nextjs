export type Zonebook = {
  zoneBook: string;
  zone: string;
  book: string;
  area: string;
  areaId?: string;
  zonebookId?: string;
};

export type ZonebookWithDates = Zonebook & {
  dueDate: Date | undefined;
  disconnectionDate: Date | undefined;
};

export type Area = {
  areaId?: string;
  area: string;
};
