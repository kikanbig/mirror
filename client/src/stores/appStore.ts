import { create } from 'zustand';

interface AppState {
  activeTab: string;
  isLoading: boolean;
  showOnboarding: boolean;
  soundEnabled: boolean;

  setActiveTab: (tab: string) => void;
  setIsLoading: (v: boolean) => void;
  setShowOnboarding: (v: boolean) => void;
  toggleSound: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'home',
  isLoading: false,
  showOnboarding: false,
  soundEnabled: true,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setIsLoading: (v) => set({ isLoading: v }),
  setShowOnboarding: (v) => set({ showOnboarding: v }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
}));
