import { create } from "zustand";

type UiState = {
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  isDrawerOpen: false,
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
}));
