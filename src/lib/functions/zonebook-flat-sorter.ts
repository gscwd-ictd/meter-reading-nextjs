import { Zonebook } from "../types/zonebook";

export const ZonebookFlatSorter = (zonebooks: Zonebook[]) => {
  return zonebooks.sort((a, b) => {
    const [zoneA, bookA] = a.zoneBook.split("-").map(Number);
    const [zoneB, bookB] = b.zoneBook.split("-").map(Number);

    if (zoneA !== zoneB) {
      return zoneA - zoneB;
    }
    return bookA - bookB;
  });
};
