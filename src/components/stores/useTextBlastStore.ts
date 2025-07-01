import { SampleConcessionaireData } from "@/lib/mock/SampleConcessionaireData";
import { SampleTextBlastReportData } from "@/lib/mock/SampleTextBlastReportData";
import { Concessionaire } from "@/lib/types/concessionaire";
import { TextMessage } from "@/lib/types/text-message";
import { create } from "zustand";

type TextBlastStore = {
  concessionaires: Concessionaire[];
  setConcessionaires: (concessionaires: Concessionaire[]) => void;

  sentTextMessages: TextMessage[];
  setSentTextMessages: (sentTextMessages: TextMessage[]) => void;

  notSentTextMessages: TextMessage[];
  setNotSentTextMessages: (notSentTextMessages: TextMessage[]) => void;

  textMessages: TextMessage[];
  setTextMessages: (successful: TextMessage[], failed: TextMessage[]) => void;

  textBlastReports: TextMessage[];
  setTextBlastReports: (textBlastReport: TextMessage[]) => void;

  // for loading area text blast concessionaires based on selected zone, book, billMonthYear
  selectedZone: string | null;
  setSelectedZone: (zone: string | null) => void;

  selectedBook: string | null;
  setSelectedBook: (book: string | null) => void;

  selectedBillMonthYear: string | null;
  setSelectedBillMonthYear: (date: string | null) => void;

  // for loading text blast report based on selected DateFrom, DateTo, status
  selectedDateFrom: string | null;
  setSelectedDateFrom: (dateFrom: string | null) => void;

  selectedDateTo: string | null;
  setSelectedDateTo: (dateTo: string | null) => void;

  selectedStatus: string | null;
  setSelectedStatus: (status: string | null) => void;

  selectedRecipients: Concessionaire[];
  setSelectedRecipients: (recipients: Concessionaire[]) => void;
  addSelectedRecipient: (recipient: Concessionaire) => void;
  removeSelectedRecipient: (consumerId: string) => void;
  clearSelectedRecipients: () => void;
};

export const useTextBlastStore = create<TextBlastStore>((set) => ({
  concessionaires: SampleConcessionaireData,
  setConcessionaires: (concessionaires) => set({ concessionaires }),

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
          (msg) =>
            !state.sentTextMessages.some(
              (existing) =>
                existing.consumerId === msg.consumerId && existing.billMonthYear === msg.billMonthYear,
            ),
        ),
      ],
      notSentTextMessages: [
        ...state.notSentTextMessages.filter(
          (msg) =>
            ![...successful, ...failed].some(
              (resend) => resend.consumerId === msg.consumerId && resend.billMonthYear === msg.billMonthYear,
            ),
        ),
        ...failed,
      ],
      textMessages: [
        ...state.textMessages.filter(
          (msg) =>
            ![...successful, ...failed].some(
              (incoming) =>
                incoming.consumerId === msg.consumerId && incoming.billMonthYear === msg.billMonthYear,
            ),
        ),
        ...successful,
        ...failed,
      ],
    })),

  selectedZone: null,
  setSelectedZone: (zone) => set({ selectedZone: zone }),

  selectedBook: null,
  setSelectedBook: (book) => set({ selectedBook: book }),

  selectedBillMonthYear: null,
  setSelectedBillMonthYear: (date) => set({ selectedBillMonthYear: date }),

  selectedDateFrom: null,
  setSelectedDateFrom: (dateFrom) => set({ selectedDateFrom: dateFrom }),

  selectedDateTo: null,
  setSelectedDateTo: (dateTo) => set({ selectedDateTo: dateTo }),

  selectedStatus: null,
  setSelectedStatus: (status) => set({ selectedStatus: status }),

  textBlastReports: SampleTextBlastReportData,
  setTextBlastReports: (textBlastReport) => set({ textBlastReports: textBlastReport }),

  selectedRecipients: [],
  setSelectedRecipients: (recipients) => set({ selectedRecipients: recipients }),
  addSelectedRecipient: (recipient) =>
    set((state) => ({ selectedRecipients: [...state.selectedRecipients, recipient] })),
  removeSelectedRecipient: (consumerId) =>
    set((state) => ({
      selectedRecipients: state.selectedRecipients.filter((r) => r.consumerId !== consumerId),
    })),
  clearSelectedRecipients: () => set({ selectedRecipients: [] }),
}));
