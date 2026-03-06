import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedReading {
  id: string;
  type: 'tarot' | 'synthesis';
  title: string;
  date: string;
  cards: Array<{
    cardId: string;
    cardName: string;
    cardImage: string;
    reversed: boolean;
    positionName: string;
  }>;
  spreadName?: string;
  area?: string;
  question?: string;
  interpretation?: string;
  isBookmarked: boolean;
}

interface HistoryState {
  readings: SavedReading[];
  addReading: (reading: Omit<SavedReading, 'id' | 'date' | 'isBookmarked'>) => void;
  toggleBookmark: (id: string) => void;
  deleteReading: (id: string) => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      readings: [],

      addReading: (reading) =>
        set((state) => ({
          readings: [
            {
              ...reading,
              id: generateId(),
              date: new Date().toISOString(),
              isBookmarked: false,
            },
            ...state.readings,
          ].slice(0, 100),
        })),

      toggleBookmark: (id) =>
        set((state) => ({
          readings: state.readings.map((r) =>
            r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r
          ),
        })),

      deleteReading: (id) =>
        set((state) => ({
          readings: state.readings.filter((r) => r.id !== id),
        })),
    }),
    { name: 'mirror-history' }
  )
);
