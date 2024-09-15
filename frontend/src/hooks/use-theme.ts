import { create } from "zustand";

type ThemeStore = {
  theme: string;
  setTheme: (value: string) => void;
};

const useThemeStore = create<ThemeStore>((set) => ({
  setTheme: (newTheme) => set(() => ({ theme: newTheme })),
  theme: "light",
}));

export { useThemeStore };

