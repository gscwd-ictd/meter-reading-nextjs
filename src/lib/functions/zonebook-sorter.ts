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

export const ZonebookDaySorter = (zoneBooks: ZonebookWithDates[]) => {
  return zoneBooks.sort((a, b) => {
    // Handle day sorting with nulls first
    if (a.day === null && b.day !== null) return 1;
    if (a.day !== null && b.day === null) return -1;
    if (a.day !== null && b.day !== null && a.day !== b.day) {
      return a.day - b.day;
    }

    // Days are equal or both null, sort by zone-book
    const [zoneA, bookA] = a.zoneBook.split("-").map(Number);
    const [zoneB, bookB] = b.zoneBook.split("-").map(Number);

    if (zoneA !== zoneB) {
      return zoneA - zoneB;
    }
    return bookA - bookB;
  });
};
