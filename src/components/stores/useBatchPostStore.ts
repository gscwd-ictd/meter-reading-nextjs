import { SampleBatchPostData } from "@/lib/mock/SampleBatchPostData";
import { BatchPost, BatchPostStatus } from "@/lib/types/batch-post";
import { create } from "zustand";

type BatchPostStore = {
  concessionaires: BatchPost[];
  setConcessionaires: (concessionaires: BatchPost[]) => void;

  selectedConcessionaires: BatchPost[];
  setSelectedConcessionaires: (concessionaires: BatchPost[]) => void;

  addSelectedConcessionaire: (concessionaire: BatchPost) => void;
  removeSelectedConcessionaire: (accountNo: string) => void;
  clearSelectedConcessionaires: () => void;

  batchPostPostedConcessionaires: BatchPost[];
  setBatchPostPostedConcessionaires: (batchPostPostedConcessionaires: BatchPost[]) => void;
};

export const useBatchPostStore = create<BatchPostStore>((set) => ({
  concessionaires: SampleBatchPostData.filter(
    (concessionaire) => concessionaire.status === BatchPostStatus.NOT_POSTED,
  ),
  setConcessionaires: (concessionaires) => set({ concessionaires }),

  selectedConcessionaires: [],
  setSelectedConcessionaires: (concessionaires) => set({ selectedConcessionaires: concessionaires }),

  addSelectedConcessionaire: (concessionaire) =>
    set((state) => ({ selectedConcessionaires: [...state.selectedConcessionaires, concessionaire] })),
  removeSelectedConcessionaire: (accountNo) =>
    set((state) => ({
      selectedConcessionaires: state.selectedConcessionaires.filter((r) => r.accountNo !== accountNo),
    })),
  clearSelectedConcessionaires: () => set({ selectedConcessionaires: [] }),

  batchPostPostedConcessionaires: SampleBatchPostData.filter(
    (concessionaire) => concessionaire.status === BatchPostStatus.POSTED,
  ),
  setBatchPostPostedConcessionaires: (newPosted) =>
    set((state) => {
      const filteredPosted = newPosted.filter(
        (item) =>
          item.status === BatchPostStatus.POSTED &&
          !state.batchPostPostedConcessionaires.some((existing) => existing.accountNo === item.accountNo),
      );

      const updatedConcessionaires = state.concessionaires.filter(
        (item) => !filteredPosted.some((posted) => posted.accountNo === item.accountNo),
      );

      return {
        batchPostPostedConcessionaires: [...state.batchPostPostedConcessionaires, ...filteredPosted],
        concessionaires: updatedConcessionaires,
      };
    }),
}));
