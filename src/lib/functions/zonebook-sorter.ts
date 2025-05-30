import { Zonebook } from "../types/zonebook";

export const ZonebookSorter = (zonebooks: Zonebook[]) => {
  return zonebooks.sort((a, b) => {
    const [zoneA, bookA] = a.zonebook.split("-").map(Number);
    const [zoneB, bookB] = b.zonebook.split("-").map(Number);

    if (zoneA !== zoneB) {
      return zoneA - zoneB;
    }
    return bookA - bookB;
  });
};
