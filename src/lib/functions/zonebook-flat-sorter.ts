import { Zonebook } from "../types/zonebook";

export const ZonebookFlatSorter = (zoneBooks: Zonebook[]) => {
  return zoneBooks.sort((a, b) => {
    const [zoneA, bookA] = a.zoneBook.split("-").map(Number);
    const [zoneB, bookB] = b.zoneBook.split("-").map(Number);

    if (zoneA !== zoneB) return zoneA - zoneB;
    return bookA - bookB;
  });
};
