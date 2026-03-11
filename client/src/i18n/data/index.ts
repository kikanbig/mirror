import type { Lang } from '..';
import type { TarotCard } from '../../data/tarot-types';
import type { Rune } from '../../data/runes';
import type { MoonPhaseInfo } from '../../data/moon-phases';
import type { Spread, SpreadPosition } from '../../data/spreads';
import type { RuneSpread } from '../../data/rune-spreads';
import type { TalentDesc, PurposeDesc, RelationshipDesc, MoneyDesc, ChakraTaskDesc } from '../../data/fate-matrix-descriptions';
import { tarotEn } from './tarot.en';
import { tarotEs } from './tarot.es';
import { runesEn } from './runes.en';
import { runesEs } from './runes.es';
import { moonEn } from './moon.en';
import { moonEs } from './moon.es';
import { spreadsEn } from './spreads.en';
import { spreadsEs } from './spreads.es';
import { runeSpreadsEn } from './rune-spreads.en';
import { runeSpreadsEs } from './rune-spreads.es';
import { affirmationsEn } from './affirmations.en';
import { affirmationsEs } from './affirmations.es';
import { TALENT_DESCRIPTIONS_EN, PURPOSE_DESCRIPTIONS_EN, KARMIC_TAIL_DESCRIPTIONS_EN } from './fate-matrix.en';
import { RELATIONSHIP_DESCRIPTIONS_EN, MONEY_DESCRIPTIONS_EN, CHAKRA_TASK_DESCRIPTIONS_EN, SELF_REALIZATION_DESCRIPTIONS_EN, COMFORT_ZONE_DESCRIPTIONS_EN, CLAN_LINE_DESCRIPTIONS_EN, YEAR_FORECAST_DESCRIPTIONS_EN, FATE_ENERGY_DESCRIPTIONS_EN } from './fate-matrix-part2.en';
import { TALENT_DESCRIPTIONS_ES, PURPOSE_DESCRIPTIONS_ES, KARMIC_TAIL_DESCRIPTIONS_ES } from './fate-matrix.es';
import { RELATIONSHIP_DESCRIPTIONS_ES, MONEY_DESCRIPTIONS_ES, SELF_REALIZATION_DESCRIPTIONS_ES, COMFORT_ZONE_DESCRIPTIONS_ES, YEAR_FORECAST_DESCRIPTIONS_ES, FATE_ENERGY_DESCRIPTIONS_ES } from './fate-matrix-part2.es';
import { CHAKRA_TASK_DESCRIPTIONS_ES, CLAN_LINE_DESCRIPTIONS_ES } from './fate-matrix-part3.es';

type CardOverlay = {
  nameRu?: string;
  keywords?: { upright: string[]; reversed: string[] };
  meanings?: { upright: string; reversed: string };
  love?: { upright: string; reversed: string };
  career?: { upright: string; reversed: string };
  advice?: string;
  affirmation?: string;
};

type RuneOverlay = {
  nameRu?: string;
  meaning?: { upright: string; reversed: string };
  keywords?: string[];
  deity?: string;
  advice?: string;
  divinatory?: { upright: string; reversed: string };
};

const cardOverlays: Record<string, Record<string, CardOverlay>> = {
  en: tarotEn,
  es: tarotEs,
};

const runeOverlays: Record<string, Record<string, RuneOverlay>> = {
  en: runesEn,
  es: runesEs,
};

export function localizeCard(card: TarotCard, lang: Lang): TarotCard {
  if (lang === 'ru') return card;
  const overlay = cardOverlays[lang]?.[card.id];
  if (!overlay) return card;
  return {
    ...card,
    nameRu: overlay.nameRu ?? card.name,
    keywords: overlay.keywords ?? card.keywords,
    meanings: overlay.meanings ?? card.meanings,
    love: overlay.love ?? card.love,
    career: overlay.career ?? card.career,
    advice: overlay.advice ?? card.advice,
    affirmation: overlay.affirmation ?? card.affirmation,
  };
}

export function localizeRune(rune: Rune, lang: Lang): Rune {
  if (lang === 'ru') return rune;
  const overlay = runeOverlays[lang]?.[rune.id];
  if (!overlay) return rune;
  return {
    ...rune,
    nameRu: overlay.nameRu ?? rune.name,
    meaning: overlay.meaning ?? rune.meaning,
    keywords: overlay.keywords ?? rune.keywords,
    deity: overlay.deity ?? rune.deity,
    advice: overlay.advice ?? rune.advice,
    divinatory: overlay.divinatory ?? rune.divinatory,
  };
}

const moonOverlays: Record<string, Record<string, Partial<MoonPhaseInfo>>> = {
  en: moonEn,
  es: moonEs,
};

export function localizeMoon(info: MoonPhaseInfo, lang: Lang): MoonPhaseInfo {
  if (lang === 'ru') return info;
  const overlay = moonOverlays[lang]?.[info.phase];
  if (!overlay) return info;
  return { ...info, ...overlay };
}

const spreadOverlays: Record<string, Record<string, { name: string; description: string; positions: { name: string; description: string }[] }>> = {
  en: spreadsEn,
  es: spreadsEs,
};

export function localizeSpread(spread: Spread, lang: Lang): Spread {
  if (lang === 'ru') return spread;
  const overlay = spreadOverlays[lang]?.[spread.id];
  if (!overlay) return spread;
  return {
    ...spread,
    name: overlay.name,
    description: overlay.description,
    positions: spread.positions.map((p, i) => ({
      ...p,
      name: overlay.positions[i]?.name ?? p.name,
      description: overlay.positions[i]?.description ?? p.description,
    })),
  };
}

const runeSpreadOverlays: Record<string, Record<string, { name: string; description: string; positions: { name: string; description: string }[] }>> = {
  en: runeSpreadsEn,
  es: runeSpreadsEs,
};

export function localizeRuneSpread(spread: RuneSpread, lang: Lang): RuneSpread {
  if (lang === 'ru') return spread;
  const overlay = runeSpreadOverlays[lang]?.[spread.id];
  if (!overlay) return spread;
  return {
    ...spread,
    name: overlay.name,
    description: overlay.description,
    positions: spread.positions.map((p, i) => ({
      ...p,
      name: overlay.positions[i]?.name ?? p.name,
      description: overlay.positions[i]?.description ?? p.description,
    })),
  };
}

const affOverlays: Record<string, string[]> = {
  en: affirmationsEn,
  es: affirmationsEs,
};

export function localizeAffirmation(text: string, index: number, lang: Lang): string {
  if (lang === 'ru') return text;
  return affOverlays[lang]?.[index] ?? text;
}

const MOON_PHASE_NAMES: Record<string, Record<string, string>> = {
  en: {
    new_moon: 'New Moon', waxing_crescent: 'Waxing Crescent', first_quarter: 'First Quarter',
    waxing_gibbous: 'Waxing Gibbous', full_moon: 'Full Moon', waning_gibbous: 'Waning Gibbous',
    last_quarter: 'Last Quarter', waning_crescent: 'Waning Crescent',
  },
  es: {
    new_moon: 'Luna Nueva', waxing_crescent: 'Creciente Cóncava', first_quarter: 'Cuarto Creciente',
    waxing_gibbous: 'Creciente Convexa', full_moon: 'Luna Llena', waning_gibbous: 'Menguante Convexa',
    last_quarter: 'Cuarto Menguante', waning_crescent: 'Menguante Cóncava',
  },
};

export function localizeMoonPhaseName(phase: string, phaseRu: string, lang: Lang): string {
  if (lang === 'ru') return phaseRu;
  return MOON_PHASE_NAMES[lang]?.[phase] ?? phaseRu;
}

export interface FateDescriptions {
  talents: Record<number, TalentDesc>;
  purpose: Record<number, PurposeDesc>;
  karmicTail: Record<number, string>;
  relationships: Record<number, RelationshipDesc>;
  money: Record<number, MoneyDesc>;
  chakraTasks: Record<number, ChakraTaskDesc>;
  selfRealization: Record<number, string>;
  comfortZone: Record<number, string>;
  clanLines: Record<number, { father: string; mother: string; fatherMother: string; motherFather: string }>;
  yearForecast: Record<number, string>;
  energy: Record<number, { name: string; plus: string; minus: string }>;
}

const fateOverlays: Record<string, FateDescriptions> = {
  en: {
    talents: TALENT_DESCRIPTIONS_EN,
    purpose: PURPOSE_DESCRIPTIONS_EN,
    karmicTail: KARMIC_TAIL_DESCRIPTIONS_EN,
    relationships: RELATIONSHIP_DESCRIPTIONS_EN,
    money: MONEY_DESCRIPTIONS_EN,
    chakraTasks: CHAKRA_TASK_DESCRIPTIONS_EN,
    selfRealization: SELF_REALIZATION_DESCRIPTIONS_EN,
    comfortZone: COMFORT_ZONE_DESCRIPTIONS_EN,
    clanLines: CLAN_LINE_DESCRIPTIONS_EN,
    yearForecast: YEAR_FORECAST_DESCRIPTIONS_EN,
    energy: FATE_ENERGY_DESCRIPTIONS_EN,
  },
  es: {
    talents: TALENT_DESCRIPTIONS_ES,
    purpose: PURPOSE_DESCRIPTIONS_ES,
    karmicTail: KARMIC_TAIL_DESCRIPTIONS_ES,
    relationships: RELATIONSHIP_DESCRIPTIONS_ES,
    money: MONEY_DESCRIPTIONS_ES,
    chakraTasks: CHAKRA_TASK_DESCRIPTIONS_ES,
    selfRealization: SELF_REALIZATION_DESCRIPTIONS_ES,
    comfortZone: COMFORT_ZONE_DESCRIPTIONS_ES,
    clanLines: CLAN_LINE_DESCRIPTIONS_ES,
    yearForecast: YEAR_FORECAST_DESCRIPTIONS_ES,
    energy: FATE_ENERGY_DESCRIPTIONS_ES,
  },
};

export function getLocalizedFateDescriptions(lang: Lang): FateDescriptions | null {
  if (lang === 'ru') return null;
  return fateOverlays[lang] ?? null;
}
