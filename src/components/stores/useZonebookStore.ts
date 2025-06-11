import { Zonebook } from "@mr/lib/types/zonebook";
import { create } from "zustand";

type ZonebookStore = {
  zonebooks: Zonebook[];
  setZonebooks: (zonebooks: Zonebook[]) => void;
  filteredZonebooks: Zonebook[];
  setFilteredZonebooks: (filteredZonebooks: Zonebook[]) => void;
  meterReaderZonebooks: Zonebook[];
  setMeterReaderZonebooks: (meterReaderZonebooks: Zonebook[]) => void;
  zonebookSelectorIsOpen: boolean;
  setZonebookSelectorIsOpen: (zonebookSelector: boolean) => void;
  selectedZonebook: Zonebook | null;
  setSelectedZonebook: (selectedZonebook: Zonebook | null) => void;
};

export const useZonebookStore = create<ZonebookStore>((set) => ({
  // zonebooks: defaultValues.zonebooks.sort((a, b) => {
  //   const getLeadingNumber = (str: string) => {
  //     const match = str.match(/^(\d+)-/);
  //     return match ? parseInt(match[1], 10) : Infinity;
  //   };
  //   const numA = getLeadingNumber(a.zoneBook);
  //   const numB = getLeadingNumber(b.zoneBook);

  //   if (numA !== numB) return numA - numB;
  //   return a.zoneBook.localeCompare(b.zoneBook);
  // }),

  zonebooks: [],

  setZonebooks: (zonebooks) => set({ zonebooks }),

  filteredZonebooks: [],
  setFilteredZonebooks: (filteredZonebooks) => set({ filteredZonebooks }),

  meterReaderZonebooks: [],
  setMeterReaderZonebooks: (meterReaderZonebooks) => set({ meterReaderZonebooks }),

  zonebookSelectorIsOpen: false,
  setZonebookSelectorIsOpen: (zonebookSelectorIsOpen) => set({ zonebookSelectorIsOpen }),

  selectedZonebook: null,
  setSelectedZonebook: (selectedZonebook) => set({ selectedZonebook }),
}));
