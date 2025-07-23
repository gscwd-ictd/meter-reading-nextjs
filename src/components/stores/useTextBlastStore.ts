// import { SampleReadingDetailsData } from "@/lib/mock/text-blast/SampleReadingDetailsData";
import { SampleTextBlastReportData } from "@/lib/mock/text-blast/SampleTextBlastReportData";
import { AccountWithDates } from "@/lib/types/text-blast/ReadingDetails";
import { TextMessage, TextMessageData } from "@/lib/types/text-blast/TextMessage";
import { create } from "zustand";

type TextBlastStore = {
  consumers: AccountWithDates[];
  setConsumers: (consumers: AccountWithDates[]) => void;

  selectedConsumers: AccountWithDates[];
  setSelectedConsumers: (selectedConsumers: AccountWithDates[]) => void;

  textMessageRecipients: TextMessage[];
  setTextMessageRecipients: (textMessageRecipients: TextMessage[]) => void;

  // for loading area text blast consumers based on selected zone, book, billMonthYear
  selectedZone: string | null;
  setSelectedZone: (zone: string | null) => void;

  selectedBook: string | null;
  setSelectedBook: (book: string | null) => void;

  selectedBillMonthYear: string | null;
  setSelectedBillMonthYear: (date: string | null) => void;

  addSelectedConsumer: (consumer: AccountWithDates) => void;
  removeSelectedConsumer: (consumerReadingDetailsId: string) => void;

  clearSelectedConsumers: () => void;

  sentTextMessages: TextMessage[];
  setSentTextMessages: (sentTextMessages: TextMessage[]) => void;

  notSentTextMessages: TextMessage[];
  setNotSentTextMessages: (notSentTextMessages: TextMessage[]) => void;

  textMessages: TextMessage[];
  setTextMessages: (successful: TextMessage[], failed: TextMessage[]) => void;

  textBlastReports: TextMessageData[];
  setTextBlastReports: (textBlastReport: TextMessageData[]) => void;
};

export const useTextBlastStore = create<TextBlastStore>((set) => ({
  consumers: [],
  setConsumers: (consumers) => set({ consumers }),

  selectedConsumers: [],
  setSelectedConsumers: (selectedConsumers) => set({ selectedConsumers: selectedConsumers }),

  textMessageRecipients: [],
  setTextMessageRecipients: (newtoSendTextMessageRecipients) =>
    set({ textMessageRecipients: newtoSendTextMessageRecipients }),

  selectedZone: null,
  setSelectedZone: (zone) => set({ selectedZone: zone }),

  selectedBook: null,
  setSelectedBook: (book) => set({ selectedBook: book }),

  selectedBillMonthYear: null,
  setSelectedBillMonthYear: (date) => set({ selectedBillMonthYear: date }),

  addSelectedConsumer: (consumer) =>
    set((state) => ({ selectedConsumers: [...state.selectedConsumers, consumer] })),
  removeSelectedConsumer: (accountNumber) =>
    set((state) => ({
      selectedConsumers: state.selectedConsumers.filter((r) => r.accountNumber !== accountNumber),
    })),
  clearSelectedConsumers: () => set({ selectedConsumers: [] }),

  // text message state after successful/failed sending
  sentTextMessages: [],
  setSentTextMessages: (newSentMessages) => set({ sentTextMessages: newSentMessages }),

  notSentTextMessages: [],
  setNotSentTextMessages: (newFailedMessages) => set({ notSentTextMessages: newFailedMessages }),

  textMessages: [],
  setTextMessages: (successful, failed) =>
    set((state) => ({
      sentTextMessages: [
        ...state.sentTextMessages,
        ...successful.filter(
          (msg) => !state.sentTextMessages.some((existing) => existing.contactNumber === msg.contactNumber),
        ),
      ],
      notSentTextMessages: [
        ...state.notSentTextMessages.filter(
          (msg) => ![...successful, ...failed].some((resend) => resend.contactNumber === msg.contactNumber),
        ),
        ...failed,
      ],
      textMessages: [
        ...state.textMessages.filter(
          (msg) =>
            ![...successful, ...failed].some((incoming) => incoming.contactNumber === msg.contactNumber),
        ),
        ...successful,
        ...failed,
      ],
    })),

  textBlastReports: SampleTextBlastReportData,
  setTextBlastReports: (textBlastReport) => set({ textBlastReports: textBlastReport }),
}));
