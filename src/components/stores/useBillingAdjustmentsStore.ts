import { BillingAdjustment } from "@mr/lib/types/billing-adjustment";
import { create } from "zustand";

type BillingAdjustmentsStore = {
  billAdjustments: BillingAdjustment[];
  setBillAdjustments: (billAdjustments: BillingAdjustment[]) => void;
  selectedBillAdjustment: BillingAdjustment | null;
  setSelectedBillAdjustment: (selectedBillAdjustment: BillingAdjustment | null) => void;
  refetch?: () => void;
  setRefetch: (fn: () => void) => void;
};

export const useBillingAdjustmentsStore = create<BillingAdjustmentsStore>((set) => ({
  billAdjustments: [],
  setBillAdjustments: (billAdjustments) => set({ billAdjustments }),

  selectedBillAdjustment: null,
  setSelectedBillAdjustment: (selectedBillAdjustment) => set({ selectedBillAdjustment }),

  refetch: undefined,
  setRefetch: (fn) => set({ refetch: fn }),
}));
