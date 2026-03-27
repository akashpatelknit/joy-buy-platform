import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  dark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      dark: true, // Dark mode is default for luxury theme
      toggle: () =>
        set((s) => {
          const next = !s.dark;
          document.documentElement.classList.toggle('light', !next);
          return { dark: next };
        }),
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state && !state.dark) {
          document.documentElement.classList.add('light');
        }
      },
    }
  )
);
