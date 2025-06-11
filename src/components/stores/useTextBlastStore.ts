"use client";

import { TextMessage } from "@mr/lib/types/text-message";
import { create } from "zustand";

type TextBlastStore = {
  textMessages: TextMessage[];
  setTextMessages: (textMessages: TextMessage[]) => void;
};

export const useTextBlastStore = create<TextBlastStore>((set) => ({
  textMessages: [],
  setTextMessages: (textMessages) => set({ textMessages }),
}));
