import { Zonebook } from "@/lib/types/zonebook";
import { create } from "zustand";

type ZonebookStore = {
  zonebooks: Zonebook[];
  setZonebooks: (zonebooks: Zonebook[]) => void;
};

const defaultValues: Pick<ZonebookStore, "zonebooks"> = {
  zonebooks: [],
};

export const useZonebookStore = create<ZonebookStore>((set) => ({
  zonebooks: defaultValues.zonebooks.sort((a, b) =>
    a.zonebook > b.zonebook ? 1 : a.zonebook < b.zonebook ? -1 : 0,
  ),
  setZonebooks: (zonebooks) => set({ zonebooks }),
}));
