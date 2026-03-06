import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  telegramId?: number;
  username?: string;
  firstName?: string;
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  zodiacSign?: string;
  lifePathNumber?: number;
  soulNumber?: number;
  destinyNumber?: number;
  interests?: string[];
  level: number;
  experience: number;
  streak: number;
  lastActiveDate?: string;
  isPremium: boolean;
  onboardingComplete: boolean;
}

interface UserState {
  profile: UserProfile;
  setProfile: (data: Partial<UserProfile>) => void;
  addExperience: (xp: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  reset: () => void;
}

const defaultProfile: UserProfile = {
  level: 1,
  experience: 0,
  streak: 0,
  isPremium: false,
  onboardingComplete: false,
};

const XP_PER_LEVEL = 100;

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: { ...defaultProfile },
      setProfile: (data) =>
        set((state) => ({ profile: { ...state.profile, ...data } })),
      addExperience: (xp) =>
        set((state) => {
          const newXP = state.profile.experience + xp;
          const newLevel = Math.floor(newXP / XP_PER_LEVEL) + 1;
          return {
            profile: {
              ...state.profile,
              experience: newXP,
              level: newLevel,
            },
          };
        }),
      incrementStreak: () =>
        set((state) => ({
          profile: {
            ...state.profile,
            streak: state.profile.streak + 1,
            lastActiveDate: new Date().toISOString().split('T')[0],
          },
        })),
      resetStreak: () =>
        set((state) => ({ profile: { ...state.profile, streak: 0 } })),
      reset: () => set({ profile: { ...defaultProfile } }),
    }),
    { name: 'mirror-user' }
  )
);
