// @/stores/helpStore.ts
import { create } from "zustand";

interface HelpStore {
  helpRequested: boolean;
  setHelpRequested: (value: boolean) => void;
}

export const useHelpStore = create<HelpStore>((set) => ({
  helpRequested: false,
  setHelpRequested: (value) => set({ helpRequested: value }),
}));
