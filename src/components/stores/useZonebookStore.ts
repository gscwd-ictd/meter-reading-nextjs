import { Zonebook } from "@mr/lib/types/zonebook";
import { create } from "zustand";

type ZonebookStore = {
  zonebooks: Zonebook[];
  setZonebooks: (zonebooks: Zonebook[]) => void;
  meterReaderZonebooks: Zonebook[];
  setMeterReaderZonebooks: (meterReaderZonebooks: Zonebook[]) => void;
  zonebookSelectorIsOpen: boolean;
  setZonebookSelectorIsOpen: (zonebookSelector: boolean) => void;
};

const defaultValues: Pick<ZonebookStore, "zonebooks"> = {
  zonebooks: [
    {
      zone: "5",
      book: "1",
      zonebook: "5-1",
      area: "ula",
    },
    {
      zone: "2",
      book: "1",
      zonebook: "2-1",
      area: "Dadiangas East",
    },
    {
      zone: "8",
      book: "1",
      zonebook: "8-1",
      area: "",
    },
    {
      zone: "14",
      book: "1",
      zonebook: "14-1",
      area: "",
    },
    {
      zone: "15",
      book: "1",
      zonebook: "15-1",
      area: "",
    },
    {
      zone: "1",
      book: "1",
      zonebook: "1-1",
      area: "Dadiangas South",
    },
    {
      zone: "4",
      book: "1",
      zonebook: "4-1",
      area: "Dadiangas West",
    },
    {
      zone: "13",
      book: "1",
      zonebook: "13-1",
      area: "",
    },
    {
      zone: "23",
      book: "1",
      zonebook: "23-1",
      area: "",
    },
    {
      zone: "27",
      book: "1",
      zonebook: "27-1",
      area: "",
    },
    {
      zone: "29",
      book: "1",
      zonebook: "29-1",
      area: "",
    },
    {
      zone: "35",
      book: "1",
      zonebook: "35-1",
      area: "",
    },
    {
      zone: "45",
      book: "1",
      zonebook: "45-1",
      area: "",
    },
    {
      zone: "60",
      book: "1",
      zonebook: "60-1",
      area: "",
    },
    {
      zone: "11",
      book: "1",
      zonebook: "11-1",
      area: "",
    },
    {
      zone: "32",
      book: "1",
      zonebook: "32-1",
      area: "",
    },
    {
      zone: "30",
      book: "1",
      zonebook: "30-1",
      area: "",
    },
    {
      zone: "31",
      book: "1",
      zonebook: "31-1",
      area: "",
    },
    {
      zone: "16",
      book: "1",
      zonebook: "16-1",
      area: "",
    },
    {
      zone: "65",
      book: "1",
      zonebook: "65-1",
      area: "",
    },
    {
      zone: "14",
      book: "2",
      zonebook: "14-2",
      area: "",
    },
    {
      zone: "13",
      book: "2",
      zonebook: "13-2",
      area: "",
    },
    {
      zone: "31",
      book: "2",
      zonebook: "31-2",
      area: "",
    },
    {
      zone: "45",
      book: "2",
      zonebook: "45-2",
      area: "",
    },
    {
      zone: "2",
      book: "3",
      zonebook: "2-3",
      area: "Dadiangas East",
    },
    {
      zone: "8",
      book: "3",
      zonebook: "8-3",
      area: "",
    },
    {
      zone: "5",
      book: "3",
      zonebook: "5-3",
      area: "ula",
    },
    {
      zone: "9",
      book: "3",
      zonebook: "9-3",
      area: "",
    },
    {
      zone: "14",
      book: "3",
      zonebook: "14-3",
      area: "",
    },
    {
      zone: "1",
      book: "3",
      zonebook: "1-3",
      area: "Dadiangas South",
    },
    {
      zone: "16",
      book: "3",
      zonebook: "16-3",
      area: "",
    },
    {
      zone: "3",
      book: "3",
      zonebook: "3-3",
      area: "Dadiangas North",
    },
    {
      zone: "26",
      book: "3",
      zonebook: "26-3",
      area: "",
    },
    {
      zone: "20",
      book: "3",
      zonebook: "20-3",
      area: "",
    },
    {
      zone: "29",
      book: "3",
      zonebook: "29-3",
      area: "",
    },
    {
      zone: "30",
      book: "3",
      zonebook: "30-3",
      area: "",
    },
    {
      zone: "31",
      book: "3",
      zonebook: "31-3",
      area: "",
    },
    {
      zone: "27",
      book: "3",
      zonebook: "27-3",
      area: "",
    },
    {
      zone: "32",
      book: "3",
      zonebook: "",
      area: "",
    },
  ],
};

export const useZonebookStore = create<ZonebookStore>((set) => ({
  zonebooks: defaultValues.zonebooks.sort((a, b) => {
    const getLeadingNumber = (str: string) => {
      const match = str.match(/^(\d+)-/);
      return match ? parseInt(match[1], 10) : Infinity;
    };
    const numA = getLeadingNumber(a.zonebook);
    const numB = getLeadingNumber(b.zonebook);

    if (numA !== numB) return numA - numB;
    return a.zonebook.localeCompare(b.zonebook);
  }),

  setZonebooks: (zonebooks) => set({ zonebooks }),

  meterReaderZonebooks: [],
  setMeterReaderZonebooks: (meterReaderZonebooks) => set({ meterReaderZonebooks }),

  zonebookSelectorIsOpen: false,
  setZonebookSelectorIsOpen: (zonebookSelectorIsOpen) => set({ zonebookSelectorIsOpen }),
}));
