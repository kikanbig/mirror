import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SubscriptionTier = 'free' | 'premium';

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

export interface PremiumStatus {
  tier: SubscriptionTier;
  hasFateReport: boolean;
  premiumUntil: string | null;
}

interface UserState {
  profile: UserProfile;
  premiumStatus: PremiumStatus;
  setProfile: (data: Partial<UserProfile>) => void;
  setPremiumStatus: (status: PremiumStatus) => void;
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

const defaultPremiumStatus: PremiumStatus = {
  tier: 'free',
  hasFateReport: false,
  premiumUntil: null,
};

const XP_PER_LEVEL = 100;

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: { ...defaultProfile },
      premiumStatus: { ...defaultPremiumStatus },
      setProfile: (data) =>
        set((state) => ({ profile: { ...state.profile, ...data } })),
      setPremiumStatus: (status) =>
        set((state) => ({
          premiumStatus: status,
          profile: { ...state.profile, isPremium: status.tier === 'premium' },
        })),
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
