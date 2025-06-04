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
};

// const defaultValues: Pick<ZonebookStore, "zonebooks"> = {
//   zonebooks: [
//     {
//       zone: "5",
//       book: "1",
//       zoneBook: "5-1",
//       area: "ula",
//     },
//     {
//       zone: "2",
//       book: "1",
//       zoneBook: "2-1",
//       area: "Dadiangas East",
//     },
//     {
//       zone: "8",
//       book: "1",
//       zoneBook: "8-1",
//       area: "",
//     },
//     {
//       zone: "14",
//       book: "1",
//       zoneBook: "14-1",
//       area: "",
//     },
//     {
//       zone: "15",
//       book: "1",
//       zoneBook: "15-1",
//       area: "",
//     },
//     {
//       zone: "1",
//       book: "1",
//       zoneBook: "1-1",
//       area: "Dadiangas South",
//     },
//     {
//       zone: "4",
//       book: "1",
//       zoneBook: "4-1",
//       area: "Dadiangas West",
//     },
//     {
//       zone: "13",
//       book: "1",
//       zoneBook: "13-1",
//       area: "",
//     },
//     {
//       zone: "23",
//       book: "1",
//       zoneBook: "23-1",
//       area: "",
//     },
//     {
//       zone: "27",
//       book: "1",
//       zoneBook: "27-1",
//       area: "",
//     },
//     {
//       zone: "29",
//       book: "1",
//       zoneBook: "29-1",
//       area: "",
//     },
//     {
//       zone: "35",
//       book: "1",
//       zoneBook: "35-1",
//       area: "",
//     },
//     {
//       zone: "45",
//       book: "1",
//       zoneBook: "45-1",
//       area: "",
//     },
//     {
//       zone: "60",
//       book: "1",
//       zoneBook: "60-1",
//       area: "",
//     },
//     {
//       zone: "11",
//       book: "1",
//       zoneBook: "11-1",
//       area: "",
//     },
//     {
//       zone: "32",
//       book: "1",
//       zoneBook: "32-1",
//       area: "",
//     },
//     {
//       zone: "30",
//       book: "1",
//       zoneBook: "30-1",
//       area: "",
//     },
//     {
//       zone: "31",
//       book: "1",
//       zoneBook: "31-1",
//       area: "",
//     },
//     {
//       zone: "16",
//       book: "1",
//       zoneBook: "16-1",
//       area: "",
//     },
//     {
//       zone: "65",
//       book: "1",
//       zoneBook: "65-1",
//       area: "",
//     },
//     {
//       zone: "14",
//       book: "2",
//       zoneBook: "14-2",
//       area: "",
//     },
//     {
//       zone: "13",
//       book: "2",
//       zoneBook: "13-2",
//       area: "",
//     },
//     {
//       zone: "31",
//       book: "2",
//       zoneBook: "31-2",
//       area: "",
//     },
//     {
//       zone: "45",
//       book: "2",
//       zoneBook: "45-2",
//       area: "",
//     },
//     {
//       zone: "2",
//       book: "3",
//       zoneBook: "2-3",
//       area: "Dadiangas East",
//     },
//     {
//       zone: "8",
//       book: "3",
//       zoneBook: "8-3",
//       area: "",
//     },
//     {
//       zone: "5",
//       book: "3",
//       zoneBook: "5-3",
//       area: "ula",
//     },
//     {
//       zone: "9",
//       book: "3",
//       zoneBook: "9-3",
//       area: "",
//     },
//     {
//       zone: "14",
//       book: "3",
//       zoneBook: "14-3",
//       area: "",
//     },
//     {
//       zone: "1",
//       book: "3",
//       zoneBook: "1-3",
//       area: "Dadiangas South",
//     },
//     {
//       zone: "16",
//       book: "3",
//       zoneBook: "16-3",
//       area: "",
//     },
//     {
//       zone: "3",
//       book: "3",
//       zoneBook: "3-3",
//       area: "Dadiangas North",
//     },
//     {
//       zone: "26",
//       book: "3",
//       zoneBook: "26-3",
//       area: "",
//     },
//     {
//       zone: "20",
//       book: "3",
//       zoneBook: "20-3",
//       area: "",
//     },
//     {
//       zone: "29",
//       book: "3",
//       zoneBook: "29-3",
//       area: "",
//     },
//     {
//       zone: "30",
//       book: "3",
//       zoneBook: "30-3",
//       area: "",
//     },
//     {
//       zone: "31",
//       book: "3",
//       zoneBook: "31-3",
//       area: "",
//     },
//     {
//       zone: "27",
//       book: "3",
//       zoneBook: "27-3",
//       area: "",
//     },
//   ],
// };

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
}));
