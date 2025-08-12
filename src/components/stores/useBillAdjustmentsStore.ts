import { BillAdjustment } from "@mr/lib/types/bill-adjustments";
import { create } from "zustand";

type BillAdjustmentsStore = {
  billAdjustments: BillAdjustment[];
  setBillAdjustments: (billAdjustments: BillAdjustment[]) => void;
  selectedBillAdjustment: BillAdjustment | null;
  setSelectedBillAdjustment: (selectedBillAdjustment: BillAdjustment | null) => void;
  refetch?: () => void;
  setRefetch: (fn: () => void) => void;
};

export const useBillAdjustmentsStore = create<BillAdjustmentsStore>((set) => ({
  billAdjustments: [],
  setBillAdjustments: (billAdjustments) => set({ billAdjustments }),

  selectedBillAdjustment: null,
  setSelectedBillAdjustment: (selectedBillAdjustment) => set({ selectedBillAdjustment }),

  refetch: undefined,
  setRefetch: (fn) => set({ refetch: fn }),
}));
