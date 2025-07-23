import { SampleBatchPostData } from "@mr/lib/mock/SampleBatchPostData";
import { ReadingDetails, ReadingDetailsStatus } from "@mr/lib/types/text-blast/ReadingDetails";
import { create } from "zustand";

type BatchPostStore = {
  consumers: ReadingDetails[];
  setConsumers: (consumers: ReadingDetails[]) => void;

  selectedConsumers: ReadingDetails[];
  setSelectedConsumers: (consumers: ReadingDetails[]) => void;

  addSelectedConsumer: (consumer: ReadingDetails) => void;
  removeSelectedConsumer: (accountNumber: string) => void;
  clearSelectedConsumers: () => void;

  postedReadConsumers: ReadingDetails[];
  setPostedReadConsumers: (postedReadConsumers: ReadingDetails[]) => void;
};

export const useBatchPostStore = create<BatchPostStore>((set) => ({
  consumers: SampleBatchPostData.filter(
    (consumer) => consumer.readingDetailsStatus === ReadingDetailsStatus.NOT_POSTED,
  ),
  setConsumers: (consumers) => set({ consumers }),

  selectedConsumers: [],
  setSelectedConsumers: (consumers) => set({ selectedConsumers: consumers }),

  addSelectedConsumer: (consumer) =>
    set((state) => ({ selectedConsumers: [...state.selectedConsumers, consumer] })),
  removeSelectedConsumer: (accountNumber) =>
    set((state) => ({
      selectedConsumers: state.selectedConsumers.filter((r) => r.accountNumber !== accountNumber),
    })),
  clearSelectedConsumers: () => set({ selectedConsumers: [] }),

  postedReadConsumers: SampleBatchPostData.filter(
    (consumer) => consumer.readingDetailsStatus === ReadingDetailsStatus.POSTED,
  ),
  setPostedReadConsumers: (newPosted) =>
    set((state) => {
      const filteredPosted = newPosted.filter(
        (item) =>
          item.readingDetailsStatus === ReadingDetailsStatus.POSTED &&
          !state.postedReadConsumers.some((existing) => existing.accountNumber === item.accountNumber),
      );

      const updatedConcessionaires = state.consumers.filter(
        (item) => !filteredPosted.some((posted) => posted.accountNumber === item.accountNumber),
      );

      return {
        postedReadConsumers: [...state.postedReadConsumers, ...filteredPosted],
        consumers: updatedConcessionaires,
      };
    }),
}));
