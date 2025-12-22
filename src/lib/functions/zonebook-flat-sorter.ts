import { Zonebook, ZonebookWithDates } from "../types/zonebook";

export const ZonebookFlatSorter = (zoneBooks: Zonebook[]) => {
  return zoneBooks.sort((a, b) => {
    // Check if both have valid days
    const hasDayA = a.day !== null && a.day !== undefined;
    const hasDayB = b.day !== null && b.day !== undefined;

    // First priority: sort by day (ascending) for items with days
    if (hasDayA && hasDayB) {
      if (a.day! !== b.day!) {
        return a.day! - b.day!; // Ascending
      }
    }
    // Second priority: items with days come before items without days
    else if (hasDayA && !hasDayB) {
      return -1;
    } else if (!hasDayA && hasDayB) {
      return 1;
    }
    // Both have no days - fall through

    // Third priority: sort by zone-book
    const [zoneA, bookA] = a.zoneBook.split("-").map(Number);
    const [zoneB, bookB] = b.zoneBook.split("-").map(Number);

    if (zoneA !== zoneB) {
      return zoneA - zoneB;
    }
    return bookA - bookB;
  });
};

export const ZonebookFlatSorterV2 = (zoneBooks: ZonebookWithDates[]) => {
  return zoneBooks.sort((a, b) => {
    // Check if both have valid days
    const hasDayA = a.day !== null && a.day !== undefined;
    const hasDayB = b.day !== null && b.day !== undefined;

    // First priority: sort by day (ascending) for items with days
    if (hasDayA && hasDayB) {
      if (a.day! !== b.day!) {
        return a.day! - b.day!; // Ascending
      }
    }
    // Second priority: items with days come before items without days
    else if (hasDayA && !hasDayB) {
      return -1;
    } else if (!hasDayA && hasDayB) {
      return 1;
    }
    // Both have no days - fall through

    // Third priority: sort by zone-book
    const [zoneA, bookA] = a.zoneBook.split("-").map(Number);
    const [zoneB, bookB] = b.zoneBook.split("-").map(Number);

    if (zoneA !== zoneB) {
      return zoneA - zoneB;
    }
    return bookA - bookB;
  });
};
