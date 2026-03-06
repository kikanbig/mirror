import { create } from 'zustand';
import { TarotCard } from '../data/tarot-types';

export interface DrawnCard {
  card: TarotCard;
  reversed: boolean;
  position: number;
  positionName: string;
}

interface ReadingState {
  spreadType: string | null;
  question: string;
  area: 'love' | 'career' | 'health' | 'general';
  drawnCards: DrawnCard[];
  interpretation: string | null;
  isDrawing: boolean;
  isInterpreting: boolean;

  setSpreadType: (type: string) => void;
  setQuestion: (q: string) => void;
  setArea: (a: 'love' | 'career' | 'health' | 'general') => void;
  addDrawnCard: (card: DrawnCard) => void;
  setInterpretation: (text: string) => void;
  setIsDrawing: (v: boolean) => void;
  setIsInterpreting: (v: boolean) => void;
  reset: () => void;
}

export const useReadingStore = create<ReadingState>((set) => ({
  spreadType: null,
  question: '',
  area: 'general',
  drawnCards: [],
  interpretation: null,
  isDrawing: false,
  isInterpreting: false,

  setSpreadType: (type) => set({ spreadType: type }),
  setQuestion: (q) => set({ question: q }),
  setArea: (a) => set({ area: a }),
  addDrawnCard: (card) =>
    set((s) => ({ drawnCards: [...s.drawnCards, card] })),
  setInterpretation: (text) => set({ interpretation: text }),
  setIsDrawing: (v) => set({ isDrawing: v }),
  setIsInterpreting: (v) => set({ isInterpreting: v }),
  reset: () =>
    set({
      spreadType: null,
      question: '',
      area: 'general',
      drawnCards: [],
      interpretation: null,
      isDrawing: false,
      isInterpreting: false,
    }),
}));
