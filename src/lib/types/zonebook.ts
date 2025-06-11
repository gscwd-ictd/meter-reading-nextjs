export type Zonebook = {
  zoneBook: string;
  zone: string;
  book: string;
  area: string;
};

export type ZonebookWithDates = Zonebook & {
  dueDate: Date | undefined;
  disconnectionDate: Date | undefined;
};
