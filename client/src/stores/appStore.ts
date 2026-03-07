import { create } from 'zustand';

interface AppState {
  activeTab: string;
  activeSubPage: string | null;
  isLoading: boolean;
  showOnboarding: boolean;
  soundEnabled: boolean;
  tabResetSignal: number;

  setActiveTab: (tab: string) => void;
  setActiveSubPage: (page: string | null) => void;
  setIsLoading: (v: boolean) => void;
  setShowOnboarding: (v: boolean) => void;
  toggleSound: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  activeTab: 'home',
  activeSubPage: null,
  isLoading: false,
  showOnboarding: false,
  soundEnabled: true,
  tabResetSignal: 0,

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
}));
