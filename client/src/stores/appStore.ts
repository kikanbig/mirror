import { create } from 'zustand';
import type { Lang } from '../i18n';

interface AppState {
  activeTab: string;
  activeSubPage: string | null;
  isLoading: boolean;
  showOnboarding: boolean;
  soundEnabled: boolean;
  tabResetSignal: number;
  lang: Lang;

  setActiveTab: (tab: string) => void;
  setActiveSubPage: (page: string | null) => void;
  setIsLoading: (v: boolean) => void;
  setShowOnboarding: (v: boolean) => void;
  toggleSound: () => void;
  setLang: (lang: Lang) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'home',
  activeSubPage: null,
  isLoading: false,
  showOnboarding: false,
  soundEnabled: true,
  tabResetSignal: 0,
  lang: 'ru' as Lang,

  setActiveTab: (tab) => {
    if (get().activeTab === tab) {
      if (get().activeSubPage) {
        set({ activeSubPage: null });
      } else {
        set((s) => ({ tabResetSignal: s.tabResetSignal + 1 }));
      }
    } else {
      set({ activeTab: tab, activeSubPage: null });
    }
  },
  setActiveSubPage: (page) => set({ activeSubPage: page }),
  setIsLoading: (v) => set({ isLoading: v }),
  setShowOnboarding: (v) => set({ showOnboarding: v }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  setLang: (lang) => set({ lang }),
}));
