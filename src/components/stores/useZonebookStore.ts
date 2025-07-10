import { Area, Zonebook } from "@mr/lib/types/zonebook";
import { create } from "zustand";

type ZonebookStore = {
  zoneBooks: Zonebook[];
  setZonebooks: (zoneBooks: Zonebook[]) => void;
  filteredZonebooks: Zonebook[];
  setFilteredZonebooks: (filteredZonebooks: Zonebook[]) => void;
  tempFilteredZonebooks: Zonebook[];
  setTempFilteredZonebooks: (tempFilteredZonebooks: Zonebook[]) => void;
  meterReaderZonebooks: Zonebook[];
  setMeterReaderZonebooks: (meterReaderZonebooks: Zonebook[]) => void;
  zonebookSelectorIsOpen: boolean;
  setZonebookSelectorIsOpen: (zonebookSelector: boolean) => void;
  selectedZonebook: Zonebook | null;
  setSelectedZonebook: (selectedZonebook: Zonebook | null) => void;
  addAreaDialogIsOpen: boolean;
  setAddAreaDialogIsOpen: (addAreaDialogIsOpen: boolean) => void;
  editAreaDialogIsOpen: boolean;
  setEditAreaDialogIsOpen: (editAreaDialogIsOpen: boolean) => void;
  assignAreaZonebookDialogIsOpen: boolean;
  setAssignAreaZonebookDialogIsOpen: (assignAreaZonebookDialogIsOpen: boolean) => void;
  editAssignAreaZonebookDialogIsOpen: boolean;
  setEditAssignAreaZonebookDialogIsOpen: (editAssignAreaZonebookDialogIsOpen: boolean) => void;
  selectedArea: Area;
  setSelectedArea: (selectedArea: Area) => void;
  refetchAreas?: () => void;
  setRefetchAreas: (fn: () => void) => void;
  refetchZonebooks?: () => void;
  setRefetchZonebooks: (fn: () => void) => void;
};

export const useZonebookStore = create<ZonebookStore>((set) => ({
  zoneBooks: [],
  setZonebooks: (zoneBooks) => set({ zoneBooks }),

  filteredZonebooks: [],
  setFilteredZonebooks: (filteredZonebooks) => set({ filteredZonebooks }),

  tempFilteredZonebooks: [],
  setTempFilteredZonebooks: (tempFilteredZonebooks) => set({ tempFilteredZonebooks }),

  meterReaderZonebooks: [],
  setMeterReaderZonebooks: (meterReaderZonebooks) => set({ meterReaderZonebooks }),

  zonebookSelectorIsOpen: false,
  setZonebookSelectorIsOpen: (zonebookSelectorIsOpen) => set({ zonebookSelectorIsOpen }),

  selectedZonebook: null,
  setSelectedZonebook: (selectedZonebook) => set({ selectedZonebook }),

  addAreaDialogIsOpen: false,
  setAddAreaDialogIsOpen: (addAreaDialogIsOpen) => set({ addAreaDialogIsOpen }),

  editAreaDialogIsOpen: false,
  setEditAreaDialogIsOpen: (editAreaDialogIsOpen) => set({ editAreaDialogIsOpen }),

  assignAreaZonebookDialogIsOpen: false,
  setAssignAreaZonebookDialogIsOpen: (assignAreaZonebookDialogIsOpen) =>
    set({ assignAreaZonebookDialogIsOpen }),

  editAssignAreaZonebookDialogIsOpen: false,
  setEditAssignAreaZonebookDialogIsOpen: (editAssignAreaZonebookDialogIsOpen) =>
    set({ editAssignAreaZonebookDialogIsOpen }),

  refetchAreas: undefined,
  setRefetchAreas: (fn) => set({ refetchAreas: fn }),

  refetchZonebooks: undefined,
  setRefetchZonebooks: (fn) => set({ refetchZonebooks: fn }),

  selectedArea: {} as Area,
  setSelectedArea: (selectedArea) => set({ selectedArea }),
}));
