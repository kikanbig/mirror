export type { TarotCard, Suit, Arcana } from './tarot-types';
export { majorArcana } from './tarot-major';
export { wands } from './tarot-wands';
export { cups } from './tarot-cups';
export { swords } from './tarot-swords';
export { pentacles } from './tarot-pentacles';

import { TarotCard } from './tarot-types';
import { majorArcana } from './tarot-major';
import { wands } from './tarot-wands';
import { cups } from './tarot-cups';
import { swords } from './tarot-swords';
import { pentacles } from './tarot-pentacles';

export const minorArcana: TarotCard[] = [...wands, ...cups, ...swords, ...pentacles];
export const fullDeck: TarotCard[] = [...majorArcana, ...minorArcana];

export const getCardById = (id: string): TarotCard | undefined =>
  fullDeck.find((c) => c.id === id);

export const getCardsBysuit = (suit: string): TarotCard[] =>
  fullDeck.filter((c) => c.suit === suit);

export const getMajorArcanaByNumber = (num: number): TarotCard | undefined =>
  majorArcana.find((c) => c.number === num);
