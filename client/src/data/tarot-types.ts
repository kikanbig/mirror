export interface TarotCard {
  id: string;
  name: string;
  nameRu: string;
  number: number;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  image: string;
  keywords: { upright: string[]; reversed: string[] };
  meanings: { upright: string; reversed: string };
  love: { upright: string; reversed: string };
  career: { upright: string; reversed: string };
  advice: string;
  yesOrNo: 'yes' | 'no' | 'maybe';
  element: 'fire' | 'water' | 'air' | 'earth' | 'spirit';
  planet?: string;
  zodiac?: string;
  numerology: string;
  affirmation: string;
}

export type Suit = 'wands' | 'cups' | 'swords' | 'pentacles';
export type Arcana = 'major' | 'minor';
