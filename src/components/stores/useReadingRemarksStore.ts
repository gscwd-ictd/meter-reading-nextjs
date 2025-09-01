import { ReadingRemark } from "@mr/lib/types/reading-remark";
import { create } from "zustand";

type ReadingRemarksStore = {
  readingRemarks: ReadingRemark[];
  setReadingRemarks: (readingRemarks: ReadingRemark[]) => void;
  selectedReadingRemark: ReadingRemark | null;
  setSelectedReadingRemark: (selectedReadingRemark: ReadingRemark | null) => void;
  refetch?: () => void;
  setRefetch: (fn: () => void) => void;
  editReadingRemarksDialogIsOpen: boolean;
  setEditReadingRemarksDialogIsOpen: (editReadingRemarksDialogIsOpen: boolean) => void;
};

export const useReadingRemarksStore = create<ReadingRemarksStore>((set) => ({
  readingRemarks: [],
  setReadingRemarks: (readingRemarks) => set({ readingRemarks }),

  selectedReadingRemark: null,
  setSelectedReadingRemark: (selectedReadingRemark) => set({ selectedReadingRemark }),

  editReadingRemarksDialogIsOpen: false,
  setEditReadingRemarksDialogIsOpen: (editReadingRemarksDialogIsOpen) =>
    set({ editReadingRemarksDialogIsOpen }),

  refetch: undefined,
  setRefetch: (fn) => set({ refetch: fn }),
}));
