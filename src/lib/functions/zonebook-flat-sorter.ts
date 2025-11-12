import { Zonebook } from "../types/zonebook";

export const ZonebookFlatSorter = (zoneBooks: Zonebook[]) => {
  return zoneBooks.sort((a, b) => {
    // First, sort by whether they have a day assigned
    // Zonebooks with days come first (1), then those without (0)
    const hasDayA = a.day !== undefined && a.day !== null ? 1 : 0;
    const hasDayB = b.day !== undefined && b.day !== null ? 1 : 0;

    if (hasDayA !== hasDayB) {
      return hasDayB - hasDayA; // Descending: 1 (has day) comes before 0 (no day)
    }

    // If both have days or both don't have days, sort by zone-book
    const [zoneA, bookA] = a.zoneBook.split("-").map(Number);
    const [zoneB, bookB] = b.zoneBook.split("-").map(Number);

    if (zoneA !== zoneB) return zoneA - zoneB;
    return bookA - bookB;
  });
};
