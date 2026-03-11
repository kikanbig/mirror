import type { MoonPhaseInfo } from '../../data/moon-phases';

export const moonEn: Record<string, Partial<MoonPhaseInfo>> = {
  new_moon: {
    phase: 'new_moon',
    phaseRu: 'New Moon',
    emoji: '🌑',
    description:
      'The Moon is hidden in darkness — a time for new beginnings. This is a moment of silence when the old has gone and the new has not yet manifested. The ideal period for sowing intentions.',
    energy: 'Energy of renewal and inner silence. The world pauses before a new cycle.',
    recommendations: [
      'Write down your intentions and desires for the new lunar cycle',
      'Spend time in solitude and meditation',
      'Start a new project or initiative',
      'Let go of old habits that weigh you down',
      'Create an action plan for the coming month',
    ],
    rituals: [
      'Intention ritual: write 3 main desires on paper by candlelight',
      'Meditation on emptiness and the potential of the new',
      'Space cleansing — open windows, light incense',
    ],
    tarotConnection:
      'The New Moon is linked to The Fool (0) — pure potential, the beginning of the path. Spreads during the new moon help reveal hidden opportunities and new directions.',
  },
  waxing_crescent: {
    phase: 'waxing_crescent',
    phaseRu: 'Waxing Crescent',
    emoji: '🌒',
    description:
      'A thin crescent appears in the sky — your intentions begin to take shape. A time for first steps and the birth of hope. Seeds have been sown, and the first sprouts are breaking through.',
    energy: 'Energy of growth, hope, and first actions. Faith in your plans gains strength.',
    recommendations: [
      'Take the first concrete step toward your goal',
      'Visualize the desired outcome before sleep',
      'Overcome doubts and fears through action',
      'Look for signs and confirmations of the right path',
      'Strengthen your faith in yourself and your beginnings',
    ],
    rituals: [
      'Attraction ritual: light a white candle and speak an affirmation',
      'Create a vision board or collage of desires',
      'Plant a real plant as a symbol of your intentions',
    ],
    tarotConnection:
      'This phase is linked to The Magician (I) — willpower and first actions. Spreads during this phase help understand what resources are available for achieving your goals.',
  },
  first_quarter: {
    phase: 'first_quarter',
    phaseRu: 'First Quarter',
    emoji: '🌓',
    description:
      'The Moon is half illuminated — a time for decisions and overcoming obstacles. The first difficulties test the strength of your intentions. This is the moment of choice: continue or retreat.',
    energy: 'Energy of action, determination, and struggle. Inner conflict leads to growth.',
    recommendations: [
      'Make a decision and act without delay',
      'Revise your plan if you encounter obstacles',
      'Show persistence and do not give up',
      'Address conflicts openly and honestly',
      'Focus on priority tasks',
    ],
    rituals: [
      'Overcoming ritual: write down your fears and burn them symbolically',
      'Meditation on inner strength and determination',
      'Physical activity to release blocked energy',
    ],
    tarotConnection:
      'This phase is linked to The Chariot (VII) — overcoming and the will to win. Spreads during the first quarter reveal what obstacles stand in your way and how to overcome them.',
  },
  waxing_gibbous: {
    phase: 'waxing_gibbous',
    phaseRu: 'Waxing Gibbous',
    emoji: '🌔',
    description:
      'The Moon is almost full — final adjustments before the culmination. A time for refinement, perfection, and patience. Results are close but require one last push.',
    energy: 'Energy of refinement, patience, and persistence. The final stretch before the full moon.',
    recommendations: [
      'Perfect what you have started; pay attention to details',
      'Show patience — the result is already on its way',
      'Adjust your course if necessary',
      'Practice gratitude for what you have already achieved',
      'Strengthen beneficial connections and relationships',
    ],
    rituals: [
      'Gratitude ritual: list everything you are grateful for',
      'Meditation on acceptance and trusting the process',
      'Complete unfinished tasks and tidy up',
    ],
    tarotConnection:
      'This phase is linked to The Hermit (IX) — inner wisdom and patience. Spreads will show what needs refinement and what lessons remain to be learned.',
  },
  full_moon: {
    phase: 'full_moon',
    phaseRu: 'Full Moon',
    emoji: '🌕',
    description:
      'The Moon in full radiance — the culmination of the cycle. Emotions and intuition at their peak. The hidden becomes visible, truth surfaces. A time for harvesting and awareness.',
    energy: 'Peak energy, emotional intensity, maximum intuition. Everything is amplified.',
    recommendations: [
      'Trust your intuition — it is especially strong now',
      'Release what no longer serves your highest good',
      'Complete important tasks and projects',
      'Pay attention to dreams — they carry messages',
      'Avoid impulsive decisions driven by emotions',
    ],
    rituals: [
      'Full moon ritual: charge crystals and your Tarot deck in moonlight',
      'Meditation in moonlight for cleansing and recharging',
      'Release ritual: write on paper what you wish to release and burn it',
    ],
    tarotConnection:
      'The Full Moon is linked to The Moon (XVIII) — intuition, the subconscious, revealing secrets. Spreads during the full moon give the most accurate and profound answers.',
  },
  waning_gibbous: {
    phase: 'waning_gibbous',
    phaseRu: 'Waning Gibbous',
    emoji: '🌖',
    description:
      'The Moon begins to wane — a time for gratitude and reflection. Energy turns inward. Time to share wisdom and process the experience gained.',
    energy: 'Energy of gratitude, sharing knowledge, and reflecting on what has been lived.',
    recommendations: [
      'Share your experience and knowledge with others',
      'Analyze the results of your actions',
      'Express gratitude to those who have helped you',
      'Write down the lessons and insights you have received',
      'Start slowing down and resting more',
    ],
    rituals: [
      'Gratitude ritual: write thank-you letters (even to yourself)',
      'Mindfulness practice — spend time in silence and observation',
      'Share something valuable without expecting anything in return',
    ],
    tarotConnection:
      'This phase is linked to The Star (XVII) — hope, generosity, and inspiration. Spreads help reflect on the experience gained and find wisdom in it.',
  },
  last_quarter: {
    phase: 'last_quarter',
    phaseRu: 'Last Quarter',
    emoji: '🌗',
    description:
      'The Moon is half hidden — a time for release and forgiveness. The old must go to make room for the new. A period of inner work and liberation.',
    energy: 'Energy of liberation, forgiveness, and inner transformation.',
    recommendations: [
      'Release resentments and forgive yourself and others',
      'End relationships or projects that have run their course',
      'Do a thorough cleaning of your home and workspace',
      'Let go of unnecessary things and old attachments',
      'Devote time to self-analysis and reflection',
    ],
    rituals: [
      'Forgiveness ritual: mentally release all resentments with each exhale',
      'Cleansing bath with salt and essential oils',
      'Letting go of old belongings — each item released frees energy',
    ],
    tarotConnection:
      'This phase is linked to Judgement (XX) — releasing the past and transformation. Spreads help understand what to let go of and what is holding you back.',
  },
  waning_crescent: {
    phase: 'waning_crescent',
    phaseRu: 'Waning Crescent',
    emoji: '🌘',
    description:
      'The last thin crescent before the new moon — a time for deep rest and restoration. The cycle completes, and the soul prepares for a new beginning. A period of silence and introspection.',
    energy: 'Energy of rest, restoration, and preparation for a new cycle.',
    recommendations: [
      'Rest more and get enough sleep',
      'Practice meditation and conscious breathing',
      'Keep a dream journal — dreams are especially significant now',
      'Do not start anything new; finish what is old',
      'Spend time alone with yourself; restore your strength',
    ],
    rituals: [
      'Meditation on emptiness and accepting the unknown',
      'Dream journaling and dream interpretation',
      'Completion ritual: summarize the lunar cycle by candlelight',
    ],
    tarotConnection:
      'This phase is linked to The World (XXI) — completion of the cycle and wholeness. Spreads will show the results of your journey and prepare you for a new turn of the spiral.',
  },
};
