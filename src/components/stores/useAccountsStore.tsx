import { AccountDetails } from "@mr/lib/types/accounts";
import { create } from "zustand";

type AccountsStore = {
  selectedAccount: AccountDetails;
  setSelectedAccount: (selectedAccount: AccountDetails) => void;
};

export const useAccountsStore = create<AccountsStore>((set) => ({
  selectedAccount: {} as AccountDetails,
  setSelectedAccount: (selectedAccount) => set({ selectedAccount }),
}));
