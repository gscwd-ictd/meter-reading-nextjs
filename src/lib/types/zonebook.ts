export type Zonebook = {
  zoneBook: string;
  zone: string;
  book: string;
  area: Area;
  id?: string;
};

export type ZonebookWithDates = Zonebook & {
  dueDate: Date | undefined;
  disconnectionDate: Date | undefined;
};

export type Area = {
  id: string;
  name: string;
};
