import { MeterReader } from "@mr/lib/types/personnel";
import { create } from "zustand";

type UsersStore = {
  users: MeterReader[];
  setUsers: (users: MeterReader[]) => void;

  selectedUser: MeterReader;
  setSelectedUser: (selectedUser: MeterReader) => void;

  refetchData?: () => void;
  setRefetchData: (fn: () => void) => void;

  reset: () => void;
};

export const useUserAccountsStore = create<UsersStore>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),

  selectedUser: {} as MeterReader,
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  refetchData: undefined,
  setRefetchData: (fn) => set({ refetchData: fn }),

  reset: () =>
    set({
      users: [],
      selectedUser: {} as MeterReader,
      refetchData: undefined,
    }),
}));
