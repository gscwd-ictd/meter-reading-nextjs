import { ZonebookProgress } from "@mr/lib/types/zonebook";
import { format } from "date-fns";
import { create } from "zustand";

type ZonebookProgressStore = {
  monthYear: string;
  setMonthYear: (monthYear: string) => void;
  refetch?: () => void;
  setRefetch: (fn: () => void) => void;
  selectedZonebookEntry: ZonebookProgress;
  setSelectedZonebookEntry: (selectedZonebookEntry: ZonebookProgress) => void;
  zonebookProgressEntryDialogIsOpen: boolean;
  setZonebookProgressEntryDialogIsOpen: (zonebookProgressEntryDialogIsOpen: boolean) => void;
};

export const useZonebookProgressStore = create<ZonebookProgressStore>((set) => ({
  monthYear: format(new Date(), "yyyy-MM"),
  setMonthYear: (monthYear) => set({ monthYear }),
  selectedZonebookEntry: {} as ZonebookProgress,
  setSelectedZonebookEntry: (selectedZonebookEntry) => set({ selectedZonebookEntry }),
  refetch: undefined,
  setRefetch: (fn) => set({ refetch: fn }),
  zonebookProgressEntryDialogIsOpen: false,
  setZonebookProgressEntryDialogIsOpen: (zonebookProgressEntryDialogIsOpen) =>
    set({ zonebookProgressEntryDialogIsOpen }),
}));
