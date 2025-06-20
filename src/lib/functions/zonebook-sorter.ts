import { ZonebookWithDates } from "../types/zonebook";

export const ZonebookSorter = (zoneBooks: ZonebookWithDates[]) => {
  return zoneBooks.sort((a, b) => {
    const [zoneA, bookA] = a.zoneBook.split("-").map(Number);
    const [zoneB, bookB] = b.zoneBook.split("-").map(Number);

    if (zoneA !== zoneB) {
      return zoneA - zoneB;
    }
    return bookA - bookB;
  });
};
